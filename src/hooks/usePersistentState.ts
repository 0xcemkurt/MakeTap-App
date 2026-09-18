import { useState, useEffect } from 'react';

export const STORAGE_VERSION = 'v1';

export function storageKey(base: string): string {
  return `maketab_${base}_${STORAGE_VERSION}`;
}

export function loadPersisted<T>(baseKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(baseKey));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Basit shape guard: null/undefined ise fallback
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function usePersistentState<T>(baseKey: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => loadPersisted(baseKey, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(baseKey), JSON.stringify(value));
    } catch (e) {
      console.error(`[MakeTab] localStorage yazılamadı: ${baseKey}`, e);
    }
  }, [baseKey, value]);

  return [value, setValue] as const;
}

export function clearDemoStorage() {
  try {
    Object.keys(localStorage)
      // Auth anahtarına dokunma — sıfırlama çıkış yaptırmamalı
      .filter((k) => k.startsWith('maketab_') && k !== 'maketab_auth_user')
      .forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error('[MakeTab] storage temizlenemedi', e);
  }
}
