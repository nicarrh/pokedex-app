import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { getPokemonDetail } from '@/features/pokemon/application/use-cases/get-pokemon-detail';
import { getPokemonList } from '@/features/pokemon/application/use-cases/get-pokemon-list';
import type { Pokemon, PokemonPage } from '@/features/pokemon/domain/pokemon.model';
import { PokeApiRepository } from '@/features/pokemon/infrastructure/api/repositories/poke-api.repository';

export interface Dependencies {
  getPokemonList: (offset: number, signal?: AbortSignal) => Promise<PokemonPage>;
  getPokemonDetail: (id: number, signal?: AbortSignal) => Promise<Pokemon>;
}

const DependenciesContext = createContext<Dependencies | null>(null);

// Composition root: the only place where adapters are instantiated.
export function DependenciesProvider({ children }: { children: ReactNode }) {
  const dependencies = useMemo<Dependencies>(() => {
    const pokemonRepository = new PokeApiRepository();
    return {
      getPokemonList: (offset, signal) => getPokemonList(pokemonRepository, offset, signal),
      getPokemonDetail: (id, signal) => getPokemonDetail(pokemonRepository, id, signal),
    };
  }, []);

  return (
    <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>
  );
}

export function useDependencies(): Dependencies {
  const dependencies = useContext(DependenciesContext);
  if (!dependencies) throw new Error('useDependencies must be used inside DependenciesProvider');
  return dependencies;
}
