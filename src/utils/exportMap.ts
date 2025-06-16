import type { Cell } from '../types/cell'

export const exportMap = (grid: Cell[][]) => {
  if (!grid.length) return;
  
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
  
  if (maxRow === -1) return // nothing to save
  
  const lines = []
  for (let r = minRow; r <= maxRow; r++) {
    lines.push(grid[r].slice(minCol, maxCol + 1).map(cell => cell.char).join(''))
  }
  
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ascii-map.txt'
  a.click()
  URL.revokeObjectURL(url)
} 