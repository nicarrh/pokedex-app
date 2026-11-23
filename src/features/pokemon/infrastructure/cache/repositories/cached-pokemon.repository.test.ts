import { AppError, MemoryStorage } from '@/shared';

import type { PokemonRepository } from '../../../application/ports/pokemon-repository.port';
import type { Pokemon, PokemonPage } from '../../../domain/pokemon.model';
import { PokemonType } from '../../../domain/pokemon-type.enum';
import { CachedPokemonRepository } from './cached-pokemon.repository';

const HOUR = 60 * 60 * 1000;

const page: PokemonPage = {
  items: [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.test/1.png' }],
  nextOffset: 20,
};

const pokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.test/1.png',
  types: [PokemonType.Grass],
  abilities: [{ name: 'overgrow', isHidden: false }],
  stats: [{ name: 'hp', value: 45 }],
  weightKg: 6.9,
  heightM: 0.7,
  baseExperience: 64,
};

function setup() {
  const source: jest.Mocked<PokemonRepository> = {
    getPage: jest.fn().mockResolvedValue(page),
    getById: jest.fn().mockResolvedValue(pokemon),
  };
  const storage = new MemoryStorage();
  return { source, storage, repo: new CachedPokemonRepository(source, storage) };
}

describe('CachedPokemonRepository', () => {
  let now: number;

  beforeEach(() => {
    now = 1_700_000_000_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches from the source and saves on a cache miss', async () => {
    const { source, storage, repo } = setup();

    await expect(repo.getById(1)).resolves.toEqual(pokemon);

    expect(source.getById).toHaveBeenCalledTimes(1);
    expect(storage.get('pokemon:detail:1')).toEqual({ data: pokemon, savedAt: now });
  });

  it('serves fresh entries without calling the source', async () => {
    const { source, repo } = setup();
    await repo.getPage(0, 20);

    now += 23 * HOUR;
    await expect(repo.getPage(0, 20)).resolves.toEqual(page);

    expect(source.getPage).toHaveBeenCalledTimes(1);
  });

  it('refreshes expired entries from the source', async () => {
    const { source, repo } = setup();
    await repo.getPage(0, 20);

    now += 25 * HOUR;
    await repo.getPage(0, 20);

    expect(source.getPage).toHaveBeenCalledTimes(2);
  });

  it('keeps details fresh for seven days', async () => {
    const { source, repo } = setup();
    await repo.getById(1);

    now += 6 * 24 * HOUR;
    await repo.getById(1);

    expect(source.getById).toHaveBeenCalledTimes(1);
  });

  it('falls back to an expired entry when the source fails', async () => {
    const { source, repo } = setup();
    await repo.getById(1);

    now += 8 * 24 * HOUR;
    source.getById.mockRejectedValue(new AppError('network'));

    await expect(repo.getById(1)).resolves.toEqual(pokemon);
  });

  it('rethrows the error when there is no cached entry', async () => {
    const { source, repo } = setup();
    source.getById.mockRejectedValue(new AppError('network'));

    await expect(repo.getById(1)).rejects.toMatchObject({ kind: 'network' });
  });

  it('does not fall back to the cache when the caller aborted', async () => {
    const { source, repo } = setup();
    await repo.getById(1);

    now += 8 * 24 * HOUR;
    const controller = new AbortController();
    source.getById.mockImplementation(async () => {
      controller.abort();
      throw new AppError('network');
    });

    await expect(repo.getById(1, controller.signal)).rejects.toMatchObject({ kind: 'network' });
  });

  it('treats a corrupt entry as a miss', async () => {
    const { source, storage, repo } = setup();
    storage.set('pokemon:detail:1', { unexpected: true });

    await expect(repo.getById(1)).resolves.toEqual(pokemon);

    expect(source.getById).toHaveBeenCalledTimes(1);
  });
});
