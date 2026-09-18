import { describe, it, expect } from 'vitest';
import { storageKey, STORAGE_VERSION } from './usePersistentState';

describe('usePersistentState storage (Hafif MVP)', () => {
  it('key formatı version içerir', () => {
    expect(storageKey('classroom')).toBe(`maketab_classroom_${STORAGE_VERSION}`);
    expect(storageKey('messages')).toContain(STORAGE_VERSION);
  });
});
