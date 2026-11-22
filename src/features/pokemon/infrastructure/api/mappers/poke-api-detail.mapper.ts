import type { Pokemon } from '../../../domain/pokemon.model';
import { PokemonType } from '../../../domain/pokemon-type.enum';
import type { PokeApiDetailDto } from '../dtos/poke-api-detail.dto';
import { artworkUrl } from './artwork';
import {
  invalid,
  isRecord,
  readArray,
  readBoolean,
  readNullableNumber,
  readNumber,
  readRecord,
  readString,
} from './validation';

function readEntries(source: Record<string, unknown>, key: string): Record<string, unknown>[] {
  return readArray(source, key).map(entry => (isRecord(entry) ? entry : invalid(`${key} entry`)));
}

function parseDetail(raw: unknown): PokeApiDetailDto {
  if (!isRecord(raw)) return invalid('response must be an object');
  const id = readNumber(raw, 'id');
  if (!Number.isInteger(id) || id <= 0) return invalid('id must be a positive integer');

  return {
    id,
    name: readString(raw, 'name'),
    height: readNumber(raw, 'height'),
    weight: readNumber(raw, 'weight'),
    base_experience: readNullableNumber(raw, 'base_experience'),
    types: readEntries(raw, 'types').map(entry => ({
      type: { name: readString(readRecord(entry, 'type'), 'name') },
    })),
    abilities: readEntries(raw, 'abilities').map(entry => ({
      is_hidden: readBoolean(entry, 'is_hidden'),
      ability: { name: readString(readRecord(entry, 'ability'), 'name') },
    })),
    stats: readEntries(raw, 'stats').map(entry => ({
      base_stat: readNumber(entry, 'base_stat'),
      stat: { name: readString(readRecord(entry, 'stat'), 'name') },
    })),
  };
}

function toPokemonType(name: string): PokemonType {
  return Object.values(PokemonType).find(type => type === name) ?? invalid(`unknown type ${name}`);
}

export function mapPokemon(raw: unknown): Pokemon {
  const dto = parseDetail(raw);
  // The UI needs a primary type for the header, so an empty list is unusable.
  if (dto.types.length === 0) return invalid('types must not be empty');

  return {
    id: dto.id,
    name: dto.name,
    imageUrl: artworkUrl(dto.id),
    types: dto.types.map(({ type }) => toPokemonType(type.name)),
    abilities: dto.abilities.map(({ ability, is_hidden }) => ({
      name: ability.name,
      isHidden: is_hidden,
    })),
    stats: dto.stats.map(({ stat, base_stat }) => ({ name: stat.name, value: base_stat })),
    // PokéAPI sends decimetres and hectograms.
    heightM: dto.height / 10,
    weightKg: dto.weight / 10,
    baseExperience: dto.base_experience,
  };
}
