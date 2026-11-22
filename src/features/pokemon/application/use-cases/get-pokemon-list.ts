import type { PokemonPage } from '../../domain/pokemon.model';
import type { PokemonRepository } from '../ports/pokemon-repository.port';

export const PAGE_SIZE = 20;

export function getPokemonList(
  repo: PokemonRepository,
  offset: number,
  signal?: AbortSignal,
): Promise<PokemonPage> {
  if (!Number.isInteger(offset) || offset < 0) {
    return Promise.reject(new RangeError('offset must be an integer >= 0'));
  }
  return repo.getPage(offset, PAGE_SIZE, signal);
}
