import { useCallback, useEffect, useRef, useState } from 'react';

import { useDependencies } from '@/app/composition-root';
import { toUserMessage, type UserMessage } from '@/shared';

import type { PokemonPage, PokemonSummary } from '../../domain/pokemon.model';

type Status = 'loading' | 'error' | 'ready' | 'empty';

export function usePokemonList() {
  const { getPokemonList } = useDependencies();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<readonly PokemonSummary[]>([]);
  const [error, setError] = useState<UserMessage | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Bumping it re-runs the initial load (used by retry).
  const [attempt, setAttempt] = useState(0);

  const nextOffset = useRef<number | null>(null);
  // A ref, not state: it must block a second call within the same render tick.
  const busy = useRef(false);

  const showPage = useCallback((page: PokemonPage, append: boolean) => {
    nextOffset.current = page.nextOffset;
    setItems(prev => (append ? [...prev, ...page.items] : page.items));
    setStatus(append || page.items.length > 0 ? 'ready' : 'empty');
    setError(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    busy.current = true;
    getPokemonList(0, controller.signal)
      .then(page => showPage(page, false))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setError(toUserMessage(e));
        setStatus('error');
      })
      .finally(() => {
        if (!controller.signal.aborted) busy.current = false;
      });
    return () => controller.abort();
  }, [getPokemonList, showPage, attempt]);

  const loadMore = useCallback(() => {
    if (busy.current || status !== 'ready' || nextOffset.current === null) return;
    busy.current = true;
    setLoadingMore(true);
    getPokemonList(nextOffset.current)
      .then(page => showPage(page, true))
      // Failing to paginate keeps what the user already sees; scrolling again retries.
      .catch(() => undefined)
      .finally(() => {
        busy.current = false;
        setLoadingMore(false);
      });
  }, [getPokemonList, showPage, status]);

  const refresh = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setRefreshing(true);
    getPokemonList(0)
      .then(page => showPage(page, false))
      .catch((e: unknown) => {
        setError(toUserMessage(e));
        setStatus('error');
      })
      .finally(() => {
        busy.current = false;
        setRefreshing(false);
      });
  }, [getPokemonList, showPage]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt(n => n + 1);
  }, []);

  return { status, items, error, loadingMore, refreshing, loadMore, refresh, retry };
}
