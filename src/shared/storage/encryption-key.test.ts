import { getRandomBytes } from 'expo-crypto';
import { deleteItemAsync, setItemAsync, WHEN_UNLOCKED_THIS_DEVICE_ONLY } from 'expo-secure-store';

import { getOrCreateEncryptionKey } from './encryption-key';

describe('getOrCreateEncryptionKey', () => {
  beforeEach(async () => {
    await deleteItemAsync('pokedex.cache.key');
    jest.clearAllMocks();
  });

  it('creates a 32 character key and stores it in the keychain', async () => {
    const key = await getOrCreateEncryptionKey();

    expect(key).toHaveLength(32);
    expect(getRandomBytes).toHaveBeenCalledWith(24);
    expect(setItemAsync).toHaveBeenCalledWith('pokedex.cache.key', key, {
      keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  });

  it('reuses the stored key on the next call', async () => {
    const first = await getOrCreateEncryptionKey();
    const second = await getOrCreateEncryptionKey();

    expect(second).toBe(first);
    expect(getRandomBytes).toHaveBeenCalledTimes(1);
    expect(setItemAsync).toHaveBeenCalledTimes(1);
  });
});
