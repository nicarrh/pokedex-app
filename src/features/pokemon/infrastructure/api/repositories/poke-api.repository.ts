import { getJson } from '@/shared';

import type { PokemonRepository } from '../../../application/ports/pokemon-repository.port';
import type { PokemonPage } from '../../../domain/pokemon.model';
import { mapPokemonPage } from '../mappers/poke-api.mapper';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokeApiRepository implements PokemonRepository {
  async getPage(offset: number, limit: number, signal?: AbortSignal): Promise<PokemonPage> {
    const raw = await getJson(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, { signal });
    return mapPokemonPage(raw);
  }
}
