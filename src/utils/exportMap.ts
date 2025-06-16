import type { Cell } from '../types/cell'

interface ExportOptions {
  format: 'txt' | 'json';
}

interface BoundingBox {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}

const getBoundingBox = (grid: Cell[][]): BoundingBox => {
  let minRow = grid.length, maxRow = -1, minCol = grid[0].length, maxCol = -1
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c].char !== ' ') {
        if (r < minRow) minRow = r
        if (r > maxRow) maxRow = r
        if (c < minCol) minCol = c
        if (c > maxCol) maxCol = c
      }
    }
  }
  return { minRow, maxRow, minCol, maxCol };
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const exportAsTxt = (grid: Cell[][], boundingBox: BoundingBox) => {
  const { minRow, maxRow, minCol, maxCol } = boundingBox;
  const lines = []
  for (let r = minRow; r <= maxRow; r++) {
    lines.push(grid[r].slice(minCol, maxCol + 1).map(cell => cell.char).join(''))
  }
  downloadFile(lines.join('\n'), 'ascii-map.txt', 'text/plain')
}

const exportAsJson = (grid: Cell[][], boundingBox: BoundingBox) => {
  const { minRow, maxRow, minCol, maxCol } = boundingBox;
  const trimmedGrid = grid
    .slice(minRow, maxRow + 1)
    .map(row => row.slice(minCol, maxCol + 1));

  const exportData = {
    grid: trimmedGrid,
    dimensions: {
      rows: maxRow - minRow + 1,
      cols: maxCol - minCol + 1
    },
    metadata: {
      exportedAt: new Date().toISOString(),
      format: 'json'
    }
  };

  downloadFile(
    JSON.stringify(exportData, null, 2),
    'ascii-map.json',
    'application/json'
  )
}

export const exportMap = (grid: Cell[][], options: ExportOptions = { format: 'txt' }) => {
  if (!grid.length) return;
  
  const boundingBox = getBoundingBox(grid);
  if (boundingBox.maxRow === -1) return; // nothing to save

  switch (options.format) {
    case 'txt':
      exportAsTxt(grid, boundingBox);
      break;
    case 'json':
      exportAsJson(grid, boundingBox);
      break;
    default:
      console.warn(`Unsupported export format: ${options.format}`);
  }
} 