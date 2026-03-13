// ============================================
// NULISIN - LOCAL STORAGE HOOKS
// ============================================

import { useState, useEffect, useCallback } from 'react';

// Generic local storage hook
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use default
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook for draft autosave
export interface DraftData {
  name: string;
  date: string;
  content: string;
  selectedFontId: string;
  selectedPaperId: string;
  lastSaved: number;
}

export function useDraftAutosave() {
  const [draft, setDraft, removeDraft] = useLocalStorage<DraftData | null>('nulisin_draft', null);

  const saveDraft = useCallback((data: Omit<DraftData, 'lastSaved'>) => {
    setDraft({
      ...data,
      lastSaved: Date.now(),
    });
  }, [setDraft]);

  const clearDraft = useCallback(() => {
    removeDraft();
  }, [removeDraft]);

  const getDraftAge = useCallback((): number | null => {
    if (!draft?.lastSaved) return null;
    return Date.now() - draft.lastSaved;
  }, [draft]);

  return {
    draft,
    saveDraft,
    clearDraft,
    getDraftAge,
  };
}

// Hook for custom fonts
export interface StoredFont {
  id: string;
  name: string;
  source: string; // base64 data URL
  uploadedAt: number;
}

export function useCustomFonts() {
  const [fonts, setFonts, removeFonts] = useLocalStorage<StoredFont[]>('nulisin_custom_fonts', []);

  const addFont = useCallback((font: Omit<StoredFont, 'uploadedAt'>) => {
    setFonts((prev) => {
      // Remove existing font with same ID if exists
      const filtered = prev.filter((f) => f.id !== font.id);
      return [...filtered, { ...font, uploadedAt: Date.now() }];
    });
  }, [setFonts]);

  const removeFont = useCallback((id: string) => {
    setFonts((prev) => prev.filter((f) => f.id !== id));
  }, [setFonts]);

  const getFontById = useCallback((id: string): StoredFont | undefined => {
    return fonts.find((f) => f.id === id);
  }, [fonts]);

  const clearAllFonts = useCallback(() => {
    removeFonts();
  }, [removeFonts]);

  return {
    fonts,
    addFont,
    removeFont,
    getFontById,
    clearAllFonts,
  };
}

// Hook for custom papers
export interface StoredPaper {
  id: string;
  name: string;
  backgroundImage: string; // base64 data URL
  width: number;
  height: number;
  zones: {
    name: { x: number; y: number; width: number; height: number };
    date: { x: number; y: number; width: number; height: number };
    content: { x: number; y: number; width: number; height: number };
  };
  lineHeight: number;
  padding: { top: number; right: number; bottom: number; left: number };
  uploadedAt: number;
}

export function useCustomPapers() {
  const [papers, setPapers, removePapers] = useLocalStorage<StoredPaper[]>('nulisin_custom_papers', []);

  const addPaper = useCallback((paper: Omit<StoredPaper, 'uploadedAt'>) => {
    setPapers((prev) => {
      // Remove existing paper with same ID if exists
      const filtered = prev.filter((p) => p.id !== paper.id);
      return [...filtered, { ...paper, uploadedAt: Date.now() }];
    });
  }, [setPapers]);

  const removePaper = useCallback((id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  }, [setPapers]);

  const getPaperById = useCallback((id: string): StoredPaper | undefined => {
    return papers.find((p) => p.id === id);
  }, [papers]);

  const clearAllPapers = useCallback(() => {
    removePapers();
  }, [removePapers]);

  return {
    papers,
    addPaper,
    removePaper,
    getPaperById,
    clearAllPapers,
  };
}

// Hook for debounced value (useful for autosave)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
