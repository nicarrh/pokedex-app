import { useEffect, useState, useCallback } from 'react';
import type { Pokemon } from '../../domain/pokemon.model';
import { toUserMessage, UserMessage } from '@/shared';
import { useDependencies } from '@/app/composition-root';

type State =
  | { status: 'loading' }
  | { status: 'error'; error: UserMessage }
  | { status: 'ready'; pokemon: Pokemon };

export const usePokemonDetail = (pokemonId: number) => {
  const { getPokemonDetail } = useDependencies();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt(n => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getPokemonDetail(pokemonId, controller.signal)
      .then(pokemon => setState({ status: 'ready', pokemon }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', error: toUserMessage(e) });
      });
    return () => controller.abort();
  }, [getPokemonDetail, pokemonId, attempt]);

  return { state, retry };
};
