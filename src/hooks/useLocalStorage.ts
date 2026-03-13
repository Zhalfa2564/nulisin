// ============================================
// NULISIN - LOCAL STORAGE HOOKS
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';

// Generic local storage hook
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use a ref to hold the initial value so it doesn't change identity between renders.
  // This prevents the infinite render loop caused by passing a new [] literal on each render.
  const initialValueRef = useRef<T>(initialValue);

  const [storedValue, setStoredValue] = useState<T>(() => {
    // Lazy initializer: runs ONCE on mount, not on every render.
    if (typeof window === 'undefined') {
      return initialValueRef.current;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValueRef.current;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValueRef.current;
    }
  });

  // Stable setter that does not depend on storedValue (avoids dependency loop).
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Stable remover.
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValueRef.current);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

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
