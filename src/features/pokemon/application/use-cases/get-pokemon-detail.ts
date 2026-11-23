import type { Pokemon } from '../../domain/pokemon.model';
import type { PokemonRepository } from '../ports/pokemon-repository.port';

export function getPokemonDetail(
  repo: PokemonRepository,
  id: number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  if (!Number.isInteger(id) || id <= 0) {
    return Promise.reject(new RangeError('id must be an integer > 0'));
  }
  return repo.getById(id, signal);
}
