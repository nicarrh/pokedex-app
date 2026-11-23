import type { KeyValueStorage } from '@/shared';

import type { PokemonRepository } from '../../../application/ports/pokemon-repository.port';
import type { Pokemon, PokemonPage } from '../../../domain/pokemon.model';

const PAGE_TTL_MS = 24 * 60 * 60 * 1000;
const DETAIL_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  savedAt: number;
}

function isCacheEntry<T>(value: unknown): value is CacheEntry<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'savedAt' in value &&
    typeof value.savedAt === 'number'
  );
}

export class CachedPokemonRepository implements PokemonRepository {
  constructor(
    private readonly source: PokemonRepository,
    private readonly storage: KeyValueStorage,
  ) {}

  getPage(offset: number, limit: number, signal?: AbortSignal): Promise<PokemonPage> {
    return this.cached(
      `pokemon:page:${offset}`,
      PAGE_TTL_MS,
      () => this.source.getPage(offset, limit, signal),
      signal,
    );
  }

  getById(id: number, signal?: AbortSignal): Promise<Pokemon> {
    return this.cached(
      `pokemon:detail:${id}`,
      DETAIL_TTL_MS,
      () => this.source.getById(id, signal),
      signal,
    );
  }

  private async cached<T>(
    key: string,
    ttlMs: number,
    load: () => Promise<T>,
    signal?: AbortSignal,
  ): Promise<T> {
    const entry = this.read<T>(key);
    if (entry && Date.now() - entry.savedAt < ttlMs) return entry.data;

    try {
      const data = await load();
      this.write(key, data);
      return data;
    } catch (error) {
      if (signal?.aborted || !entry) throw error;
      return entry.data;
    }
  }

  private read<T>(key: string): CacheEntry<T> | null {
    try {
      const value = this.storage.get<unknown>(key);
      return isCacheEntry<T>(value) ? value : null;
    } catch {
      return null;
    }
  }

  private write<T>(key: string, data: T): void {
    try {
      this.storage.set(key, { data, savedAt: Date.now() } satisfies CacheEntry<T>);
    } catch {
      return;
    }
  }
}
