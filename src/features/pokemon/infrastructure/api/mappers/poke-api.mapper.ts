import { AppError } from '@/shared';

import type { Pokemon, PokemonPage, PokemonSummary } from '../../../domain/pokemon.model';
import type { PokeApiListDto } from '../dtos/poke-api.dto';

const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

function invalid(reason: string): never {
  throw new AppError('invalid-data', reason);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseList(raw: unknown): PokeApiListDto {
  if (!isRecord(raw) || !Array.isArray(raw.results)) return invalid('missing results');
  const next = raw.next;
  if (next !== null && typeof next !== 'string') return invalid('invalid next');
  const results = raw.results.map((entry: unknown) => {
    if (!isRecord(entry) || typeof entry.name !== 'string' || typeof entry.url !== 'string') {
      return invalid('invalid result entry');
    }
    return { name: entry.name, url: entry.url };
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
    return { id, name, imageUrl: `${ARTWORK_URL}/${id}.png` };
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
