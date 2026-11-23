import { MemoryStorage } from './memory-storage';

describe('MemoryStorage', () => {
  it('stores and reads values', () => {
    const storage = new MemoryStorage();
    storage.set('a', { id: 1 });
    expect(storage.get('a')).toEqual({ id: 1 });
  });

  it('returns null for missing keys', () => {
    expect(new MemoryStorage().get('missing')).toBeNull();
  });

  it('removes and clears values', () => {
    const storage = new MemoryStorage();
    storage.set('a', 1);
    storage.set('b', 2);
    storage.remove('a');
    expect(storage.get('a')).toBeNull();
    storage.clear();
    expect(storage.get('b')).toBeNull();
  });
});
