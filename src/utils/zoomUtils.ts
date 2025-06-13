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
  const cols = Math.floor(availableWidth / cellSize);
  const rows = Math.floor(availableHeight / cellSize);
  return { rows, cols };
};

export const expandGrid = (
  grid: Cell[][],
  newRows: number,
  newCols: number,
  defaultFg: string,
  defaultBg: string
): Cell[][] => {
  const currentRows = grid.length;
  const currentCols = grid[0]?.length || 0;

  // If new dimensions are smaller, just return the existing grid
  if (newRows <= currentRows && newCols <= currentCols) {
    return grid;
  }

  // Create new grid with expanded dimensions
  const newGrid: Cell[][] = Array(newRows).fill(null).map(() =>
    Array(newCols).fill(null).map(() => ({
      char: ' ',
      fg: defaultFg,
      bg: defaultBg
    }))
  );

  // Copy existing grid content
  for (let r = 0; r < currentRows; r++) {
    for (let c = 0; c < currentCols; c++) {
      newGrid[r][c] = grid[r][c];
    }
  }

  return newGrid;
};

export const handleZoom = (
  currentCellSize: number,
  zoomIn: boolean,
  availableWidth: number,
  availableHeight: number,
  defaultFg: string,
  defaultBg: string
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