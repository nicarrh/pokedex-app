import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { getPokemonDetail } from '@/features/pokemon/application/use-cases/get-pokemon-detail';
import { getPokemonList } from '@/features/pokemon/application/use-cases/get-pokemon-list';
import type { Pokemon, PokemonPage } from '@/features/pokemon/domain/pokemon.model';
import { CachedPokemonRepository } from '@/features/pokemon/infrastructure/cache/repositories/cached-pokemon.repository';
import { PokeApiRepository } from '@/features/pokemon/infrastructure/api/repositories/poke-api.repository';
import type { KeyValueStorage } from '@/shared';

export interface Dependencies {
  getPokemonList: (offset: number, signal?: AbortSignal) => Promise<PokemonPage>;
  getPokemonDetail: (id: number, signal?: AbortSignal) => Promise<Pokemon>;
}

const DependenciesContext = createContext<Dependencies | null>(null);

// Composition root: the only place where adapters are instantiated.
export function DependenciesProvider({
  storage,
  children,
}: {
  storage: KeyValueStorage;
  children: ReactNode;
}) {
  const dependencies = useMemo<Dependencies>(() => {
    const pokemonRepository = new CachedPokemonRepository(new PokeApiRepository(), storage);
    return {
      getPokemonList: (offset, signal) => getPokemonList(pokemonRepository, offset, signal),
      getPokemonDetail: (id, signal) => getPokemonDetail(pokemonRepository, id, signal),
    };
  }, [storage]);

  return (
    <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>
  );
}

export function useDependencies(): Dependencies {
  const dependencies = useContext(DependenciesContext);
  if (!dependencies) throw new Error('useDependencies must be used inside DependenciesProvider');
  return dependencies;
}
