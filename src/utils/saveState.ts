import type { Cell } from '../types/cell';
import { getInitialGrid } from './mapUtils';

const STORAGE_KEY = 'ascii-map-state';

interface SavedState {
  grid: Cell[][];
  rows: number;
  cols: number;
  cellSize: number;
  timestamp: string;
}

export const loadSavedState = (
  rows: number, 
  cols: number, 
  defaultFg: string, 
  defaultBg: string,
  defaultCellSize: number
): { grid: Cell[][]; cellSize: number } => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState) as SavedState;
      // Always restore the cellSize if it exists
      const savedCellSize = parsed.cellSize || defaultCellSize;
      
      // If dimensions match, restore the grid as is
      if (parsed.rows === rows && parsed.cols === cols) {
        return {
          grid: parsed.grid,
          cellSize: savedCellSize
        };
      }
      
      // If dimensions don't match, create a new grid with the saved cellSize
      return {
        grid: getInitialGrid(rows, cols, defaultFg, defaultBg),
        cellSize: savedCellSize
      };
    } catch (e) {
      console.error('Failed to parse saved grid state:', e);
    }
  }
  return {
    grid: getInitialGrid(rows, cols, defaultFg, defaultBg),
    cellSize: defaultCellSize
  };
};

export const saveState = (grid: Cell[][], rows: number, cols: number, cellSize: number): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    grid,
    rows,
    cols,
    cellSize,
    timestamp: new Date().toISOString()
  }));
};

export const clearSavedState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
}; 