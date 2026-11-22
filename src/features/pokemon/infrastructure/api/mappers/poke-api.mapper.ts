import type { Pokemon, PokemonPage, PokemonSummary } from '../../../domain/pokemon.model';
import type { PokeApiListDto } from '../dtos/poke-api.dto';
import { artworkUrl } from './artwork';
import { invalid, isRecord, readArray, readString } from './validation';

function parseList(raw: unknown): PokeApiListDto {
  if (!isRecord(raw)) return invalid('response must be an object');
  const next = raw.next;
  if (next !== null && typeof next !== 'string') return invalid('next must be a string or null');
  const results = readArray(raw, 'results').map(entry => {
    if (!isRecord(entry)) return invalid('result entry must be an object');
    return { name: readString(entry, 'name'), url: readString(entry, 'url') };
  });
  return { next, results };
}

function idFromUrl(url: string): number {
  const match = /\/pokemon\/(\d+)\/?$/.exec(url);
  if (!match?.[1]) return invalid(`cannot read id from ${url}`);
  return Number(match[1]);
}

function offsetFromUrl(url: string): number {
  const match = /[?&]offset=(\d+)/.exec(url);
  if (!match?.[1]) return invalid(`cannot read offset from ${url}`);
  return Number(match[1]);
}

export function mapPokemonPage(raw: unknown): PokemonPage {
  const dto = parseList(raw);
  const items: PokemonSummary[] = dto.results.map(({ name, url }) => {
    const id = idFromUrl(url);
    return { id, name, imageUrl: artworkUrl(id) };
  });
  return { items, nextOffset: dto.next === null ? null : offsetFromUrl(dto.next) };
}

export const mapPokemon = (raw: unknown): Pokemon => {
  if (!isRecord(raw) || !raw?.id || raw === undefined) {
    return invalid('invalid or no content');
  }
  const { id } = raw;
  if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
    return invalid('invalid pokemon id');
  }

  return { id };
};
