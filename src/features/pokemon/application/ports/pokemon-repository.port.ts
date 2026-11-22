import type { PokemonPage } from '../../domain/pokemon.model';

type Pokemon = {
  id: number;
};

export interface PokemonRepository {
  getPage(offset: number, limit: number, signal?: AbortSignal): Promise<PokemonPage>;
  getById(id: number): Promise<Pokemon>;
}
