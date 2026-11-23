import type { Pokemon, PokemonPage } from '../../domain/pokemon.model';

export interface PokemonRepository {
  getPage(offset: number, limit: number, signal?: AbortSignal): Promise<PokemonPage>;
  getById(id: number, signal?: AbortSignal): Promise<Pokemon>;
}
