import type { Cell } from '../types/cell';
 
export function getInitialGrid(rows: number, cols: number, fg: string, bg: string, char: string = ' '): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ char, fg, bg, selected: false }))
  );
}

export const getActualGridDimensions = (grid: Cell[][]): { rows: number; cols: number } => {
  if (!grid || !Array.isArray(grid) || grid.length === 0) {
    return { rows: 0, cols: 0 };
  }
  
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  return { rows, cols };
}; 