import type { Cell } from '../types/cell';

export const MIN_ZOOM = 10;
export const MAX_ZOOM = 30;
export const ZOOM_STEP = 1;

export interface ZoomState {
  cellSize: number;
  rows: number;
  cols: number;
}

export const calculateGridDimensions = (
  cellSize: number,
  availableWidth: number,
  availableHeight: number
): { rows: number; cols: number } => {
  const cellWidth = Math.floor(cellSize * 0.5);
  const cols = Math.floor(availableWidth / cellWidth);
  const rows = Math.floor(availableHeight / cellSize);
  return { rows: rows, cols: cols };
};

export const expandGrid = (
  grid: Cell[][],
  newRows: number,
  newCols: number,
  defaultFg: string,
  defaultBg: string
): Cell[][] => {
  // Safety check for undefined or null grid
  if (!grid || !Array.isArray(grid) || grid.length === 0) {
    // Return a new grid with the requested dimensions
    return Array(newRows).fill(null).map(() =>
      Array(newCols).fill(null).map(() => ({
        char: ' ',
        fg: defaultFg,
        bg: defaultBg,
        selected: false
      }))
    );
  }

  const currentRows = grid.length;
  const currentCols = grid[0]?.length || 0;

  // Additional safety check: ensure all rows exist and have proper length
  for (let r = 0; r < currentRows; r++) {
    if (!grid[r] || !Array.isArray(grid[r])) {
      // If any row is malformed, return a completely new grid
      return Array(newRows).fill(null).map(() =>
        Array(newCols).fill(null).map(() => ({
          char: ' ',
          fg: defaultFg,
          bg: defaultBg,
          selected: false
        }))
      );
    }
  }

  // If new dimensions are smaller, just return the existing grid
  if (newRows <= currentRows && newCols <= currentCols) {
    return grid;
  }

  // Create new grid with expanded dimensions
  const newGrid: Cell[][] = Array(newRows).fill(null).map(() =>
    Array(newCols).fill(null).map(() => ({
      char: ' ',
      fg: defaultFg,
      bg: defaultBg,
      selected: false
    }))
  );

  // Copy existing grid content with additional safety checks
  for (let r = 0; r < currentRows; r++) {
    for (let c = 0; c < currentCols; c++) {
      if (grid[r] && grid[r][c]) {
        newGrid[r][c] = grid[r][c];
      } else {
        // Fallback for any missing cells
        newGrid[r][c] = {
          char: ' ',
          fg: defaultFg,
          bg: defaultBg,
          selected: false
        };
      }
    }
  }

  return newGrid;
};

export const handleZoom = (
  currentCellSize: number,
  zoomIn: boolean,
  availableWidth: number,
  availableHeight: number,
): { newCellSize: number; newRows: number; newCols: number } => {
  const newCellSize = zoomIn
    ? Math.min(currentCellSize + ZOOM_STEP, MAX_ZOOM)
    : Math.max(currentCellSize - ZOOM_STEP, MIN_ZOOM);

  const { rows, cols } = calculateGridDimensions(
    newCellSize,
    availableWidth,
    availableHeight
  );

  return {
    newCellSize,
    newRows: rows,
    newCols: cols
  };
}; 