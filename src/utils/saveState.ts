import type { Cell } from '../types/cell';
import { getInitialGrid } from './mapUtils';

const STORAGE_KEY = 'ascii-map-state';

interface SavedState {
  grid: Cell[][];
  rows: number;
  cols: number;
  timestamp: string;
}

export const loadSavedState = (rows: number, cols: number, defaultFg: string, defaultBg: string): Cell[][] => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState) as SavedState;
      // Only restore if dimensions match
      if (parsed.rows === rows && parsed.cols === cols) {
        return parsed.grid;
      }
    } catch (e) {
      console.error('Failed to parse saved grid state:', e);
    }
  }
  return getInitialGrid(rows, cols, defaultFg, defaultBg);
};

export const saveState = (grid: Cell[][], rows: number, cols: number): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    grid,
    rows,
    cols,
    timestamp: new Date().toISOString()
  }));
};

export const clearSavedState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
}; 