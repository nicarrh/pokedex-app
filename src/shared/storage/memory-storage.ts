import type { KeyValueStorage } from './key-value-storage.port';

export class MemoryStorage implements KeyValueStorage {
  private readonly entries = new Map<string, string>();

  get<T>(key: string): T | null {
    const raw = this.entries.get(key);
    if (raw === undefined) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    this.entries.set(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
