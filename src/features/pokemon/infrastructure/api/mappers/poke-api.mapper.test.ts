import { AppError } from '@/shared';

import { mapPokemonPage } from './poke-api.mapper';

const validList = {
  count: 1350,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const errorKind = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error instanceof AppError ? error.kind : 'other';
  }
  return 'none';
};

describe('mapPokemonPage', () => {
  it('maps the results with id and artwork url', () => {
    const page = mapPokemonPage(validList);

    expect(page.items).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
      {
        id: 2,
        name: 'ivysaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      },
    ]);
  });

  it('reads the next offset from the next url', () => {
    expect(mapPokemonPage(validList).nextOffset).toBe(20);
  });

  it('returns a null next offset on the last page', () => {
    expect(mapPokemonPage({ ...validList, next: null }).nextOffset).toBeNull();
  });

  it('accepts an empty page', () => {
    expect(mapPokemonPage({ next: null, results: [] }).items).toEqual([]);
  });

  it.each([
    ['a non-object response', 'oops'],
    ['a null response', null],
    ['missing results', { next: null }],
    ['results that are not an array', { next: null, results: {} }],
    ['an invalid next value', { next: 20, results: [] }],
    ['a result that is not an object', { next: null, results: ['bulbasaur'] }],
    ['a result without a name', { next: null, results: [{ url: 'https://x.test/pokemon/1/' }] }],
    [
      'a url without an id',
      { next: null, results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/' }] },
    ],
    ['a next url without an offset', { ...validList, next: 'https://pokeapi.co/api/v2/pokemon' }],
  ])('throws invalid-data for %s', (_name, raw) => {
    expect(errorKind(() => mapPokemonPage(raw))).toBe('invalid-data');
  });
});
