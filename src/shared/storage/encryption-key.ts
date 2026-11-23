import { getRandomBytes } from 'expo-crypto';
import { getItemAsync, setItemAsync, WHEN_UNLOCKED_THIS_DEVICE_ONLY } from 'expo-secure-store';

const KEY_NAME = 'pokedex.cache.key';
const KEY_BYTES = 24;

export async function getOrCreateEncryptionKey(): Promise<string> {
  const existing = await getItemAsync(KEY_NAME);
  if (existing) return existing;

  const key = btoa(String.fromCharCode(...getRandomBytes(KEY_BYTES)));
  await setItemAsync(KEY_NAME, key, { keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY });
  return key;
}
