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

export const isGridEmpty = (grid: Cell[][]): boolean => {
  return grid.every(row => row.every(cell => cell.char === ' '));
};

// Test cases for isGridEmpty:
// - Empty grid: all cells have char === ' ' -> returns true
// - Grid with content: any cell has char !== ' ' -> returns false
// - Mixed grid: some cells have content, some are empty -> returns false 

/**
 * Find the bounding box of non-empty cells in the grid
 * @param grid - The 2D grid of cells
 * @returns Bounding box coordinates { top, left, bottom, right }
 */
export const findBoundingBox = (grid: Cell[][]): { top: number; left: number; bottom: number; right: number } => {
  let top = grid.length;
  let left = grid[0]?.length || 0;
  let bottom = 0;
  let right = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].char !== ' ') {
        top = Math.min(top, row);
        left = Math.min(left, col);
        bottom = Math.max(bottom, row);
        right = Math.max(right, col);
      }
    }
  }

  return { top, left, bottom, right };
};

/**
 * Extract a subgrid based on bounding box coordinates
 * @param grid - The source 2D grid of cells
 * @param bounds - Bounding box coordinates
 * @returns Subgrid containing only the relevant area
 */
export const extractSubgrid = (grid: Cell[][], bounds: { top: number; left: number; bottom: number; right: number }): Cell[][] => {
  const { top, left, bottom, right } = bounds;
  
  // Handle case where no content is found
  if (top > bottom || left > right) {
    return [];
  }
  
  const rows = bottom - top + 1;
  const cols = right - left + 1;
  
  const subgrid: Cell[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const gridRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      const originalRow = top + row;
      const originalCol = left + col;
      if (grid[originalRow]?.[originalCol]) {
        gridRow.push({ ...grid[originalRow][originalCol] });
      } else {
        // Fallback for out-of-bounds cells
        gridRow.push({ char: ' ', fg: '#FFFFFF', bg: '#222222' });
      }
    }
    subgrid.push(gridRow);
  }
  
  return subgrid;
}; 