jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

jest.mock('expo-crypto', () => ({
  getRandomBytes: jest.fn((count: number) => Uint8Array.from({ length: count }, (_, i) => i + 1)),
}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => {
    const store = new Map<string, string>();
    return {
      getString: (key: string) => store.get(key),
      set: (key: string, value: string) => {
        store.set(key, value);
      },
      remove: (key: string) => store.delete(key),
      clearAll: () => store.clear(),
    };
  }),
  deleteMMKV: jest.fn(() => true),
}));
