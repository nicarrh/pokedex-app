import {
  getOrCreateEncryptionKey,
  MemoryStorage,
  openMmkvStorage,
  type KeyValueStorage,
} from '@/shared';

const CACHE_VERSION = '1';
const VERSION_KEY = 'cache:version';

export async function bootstrapStorage(): Promise<KeyValueStorage> {
  try {
    const storage = openMmkvStorage(await getOrCreateEncryptionKey());
    if (storage.get<string>(VERSION_KEY) !== CACHE_VERSION) {
      storage.clear();
      storage.set(VERSION_KEY, CACHE_VERSION);
    }
    return storage;
  } catch {
    return new MemoryStorage();
  }
}
