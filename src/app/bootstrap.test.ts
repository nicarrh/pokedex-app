import { getItemAsync } from 'expo-secure-store';

import { bootstrapStorage } from './bootstrap';

describe('bootstrapStorage', () => {
  it('returns a working storage', async () => {
    const storage = await bootstrapStorage();
    storage.set('a', 1);
    expect(storage.get('a')).toBe(1);
  });

  it('falls back to memory storage when the key cannot be read', async () => {
    jest.mocked(getItemAsync).mockRejectedValueOnce(new Error('keychain unavailable'));

    const storage = await bootstrapStorage();
    storage.set('a', 1);
    expect(storage.get('a')).toBe(1);
  });
});
