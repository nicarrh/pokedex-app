import { createMMKV, deleteMMKV, type MMKV } from 'react-native-mmkv';

import type { KeyValueStorage } from './key-value-storage.port';

const STORAGE_ID = 'pokedex-cache';

export class MmkvStorage implements KeyValueStorage {
  private readonly mmkv: MMKV;

  constructor(encryptionKey: string) {
    this.mmkv = createMMKV({ id: STORAGE_ID, encryptionKey, encryptionType: 'AES-256' });
  }

  get<T>(key: string): T | null {
    const raw = this.mmkv.getString(key);
    if (raw === undefined) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    this.mmkv.set(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.mmkv.remove(key);
  }

  clear(): void {
    this.mmkv.clearAll();
  }
}

export function openMmkvStorage(encryptionKey: string): MmkvStorage {
  try {
    return new MmkvStorage(encryptionKey);
  } catch {
    deleteMMKV(STORAGE_ID);
    return new MmkvStorage(encryptionKey);
  }
}
