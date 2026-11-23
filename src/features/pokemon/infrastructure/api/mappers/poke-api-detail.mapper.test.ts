import { AppError } from '@/shared';

import { PokemonType } from '../../../domain/pokemon-type.enum';
import { mapPokemon } from './poke-api-detail.mapper';

const validDetail = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  order: 1,
  types: [
    { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
    { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
  ],
  abilities: [
    { is_hidden: false, slot: 1, ability: { name: 'overgrow', url: 'https://x.test/1/' } },
    { is_hidden: true, slot: 3, ability: { name: 'chlorophyll', url: 'https://x.test/2/' } },
  ],
  stats: [
    { base_stat: 45, effort: 0, stat: { name: 'hp', url: 'https://x.test/stat/1/' } },
    { base_stat: 49, effort: 0, stat: { name: 'attack', url: 'https://x.test/stat/2/' } },
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

describe('mapPokemon', () => {
  it('maps a valid response and ignores extra fields', () => {
    expect(mapPokemon(validDetail)).toEqual({
      id: 1,
      name: 'bulbasaur',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      types: [PokemonType.Grass, PokemonType.Poison],
      abilities: [
        { name: 'overgrow', isHidden: false },
        { name: 'chlorophyll', isHidden: true },
      ],
      stats: [
        { name: 'hp', value: 45 },
        { name: 'attack', value: 49 },
      ],
      heightM: 0.7,
      weightKg: 6.9,
      baseExperience: 64,
    });
  });

  it('keeps a null base experience', () => {
    expect(mapPokemon({ ...validDetail, base_experience: null }).baseExperience).toBeNull();
  });

  it.each([
    ['a non-object response', 'oops'],
    ['a null response', null],
    ['a missing name', { ...validDetail, name: undefined }],
    ['a height that is not a number', { ...validDetail, height: '7' }],
    ['a weight that is not finite', { ...validDetail, weight: Infinity }],
    ['a zero id', { ...validDetail, id: 0 }],
    ['a decimal id', { ...validDetail, id: 1.5 }],
    ['a base experience that is not a number', { ...validDetail, base_experience: '64' }],
    ['missing types', { ...validDetail, types: undefined }],
    ['an empty types list', { ...validDetail, types: [] }],
    ['an unknown type', { ...validDetail, types: [{ type: { name: 'cosmic' } }] }],
    ['an ability without is_hidden', { ...validDetail, abilities: [{ ability: { name: 'x' } }] }],
    ['a stat without a value', { ...validDetail, stats: [{ stat: { name: 'hp' } }] }],
    ['a type entry that is not an object', { ...validDetail, types: ['grass'] }],
  ])('throws invalid-data for %s', (_name, raw) => {
    expect(errorKind(() => mapPokemon(raw))).toBe('invalid-data');
  });
});
