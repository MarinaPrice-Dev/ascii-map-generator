import type { Cell } from '../types/cell'

interface ExportOptions {
  format: 'txt' | 'json' | 'ansi' | 'rot';
}

interface BoundingBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

const findBoundingBox = (grid: Cell[][]): BoundingBox => {
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
}

const hexToAnsi = (hex: string): number => {
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }
  
  return 16 + 
    (Math.round(r / 255 * 5) * 36) + 
    (Math.round(g / 255 * 5) * 6) + 
    Math.round(b / 255 * 5);
}

const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const generateFileName = (base: string, ext: string): string => {
  const shortStamp = Date.now().toString(36); // Base36 is compact (0-9 + a-z)
  return `${base}-${shortStamp}.${ext}`;
}

const exportAsTxt = (grid: Cell[][], options: ExportOptions) => {
  const { top, left, bottom, right } = findBoundingBox(grid);
  let content = '';
  
  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      content += grid[row][col].char;
    }
    content += '\n';
  }
  
  downloadFile(content, generateFileName('map', 'txt'));
}

const exportAsJson = (grid: Cell[][], options: ExportOptions) => {
  const { top, left, bottom, right } = findBoundingBox(grid);
  const data = {
    dimensions: {
      rows: bottom - top + 1,
      cols: right - left + 1
    },
    grid: grid.slice(top, bottom + 1).map(row => 
      row.slice(left, right + 1).map(cell => ({
        char: cell.char,
        fg: cell.fg,
        bg: cell.bg
      }))
    )
  };
  
  downloadFile(JSON.stringify(data, null, 2), generateFileName('map', 'json'));
}

const exportAsAnsi = (grid: Cell[][], options: ExportOptions) => {
  const { top, left, bottom, right } = findBoundingBox(grid);
  let content = '';
  
  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      const cell = grid[row][col];
      const fgCode = hexToAnsi(cell.fg);
      const bgCode = hexToAnsi(cell.bg);
      content += `\x1b[38;5;${fgCode}m\x1b[48;5;${bgCode}m${cell.char}`;
    }
    content += '\x1b[0m\n';
  }
  
  downloadFile(content, generateFileName('map', 'ansi'));
}

// Export as ROT.js format
const exportAsRot = (grid: Cell[][], options: ExportOptions) => {
  const { top, left, bottom, right } = findBoundingBox(grid);
  let content = '';
  
  for (let row = top; row <= bottom; row++) {
    let line = '';
    let currentFg = '';
    let currentBg = '';
    
    for (let col = left; col <= right; col++) {
      const cell = grid[row][col];
      
      // Handle color changes
      if (cell.fg !== currentFg) {
        if (cell.fg === '#FFFFFF') {
          line += '%c{}';
        } else {
          line += `%c{${cell.fg}}`;
        }
        currentFg = cell.fg;
      }
      
      if (cell.bg !== currentBg) {
        if (cell.bg === '#000000') {
          line += '%b{}';
        } else {
          line += `%b{${cell.bg}}`;
        }
        currentBg = cell.bg;
      }
      
      // Handle leading spaces
      if (cell.char === ' ' && line === '') {
        line += '\u00A0'; // Use non-breaking space for leading spaces
      } else {
        line += cell.char;
      }
    }
    
    // Reset colors at end of line
    if (currentFg !== '#FFFFFF') line += '%c{}';
    if (currentBg !== '#000000') line += '%b{}';
    
    content += line + '\n';
  }
  
  downloadFile(content, generateFileName('map', 'rot.txt'));
};

// Main export function
export const exportMap = (grid: Cell[][], options: ExportOptions) => {
  if (!grid || !Array.isArray(grid) || grid.length === 0) {
    throw new Error('Invalid grid data');
  }

  switch (options.format) {
    case 'txt':
      exportAsTxt(grid, options);
      break;
    case 'json':
      exportAsJson(grid, options);
      break;
    case 'ansi':
      exportAsAnsi(grid, options);
      break;
    case 'rot':
      exportAsRot(grid, options);
      break;
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
} 