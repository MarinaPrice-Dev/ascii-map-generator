import type { Cell } from '../types/cell';

interface ImportOptions {
  format: 'txt' | 'json' | 'ansi';
}

interface ImportedData {
  grid: Cell[][];
  dimensions?: {
    rows: number;
    cols: number;
  };
}

const DEFAULT_FG = '#FFFFFF';
const DEFAULT_BG = '#222222';

// ANSI color code to hex conversion
const ansiToHex = (code: number): string => {
  if (code >= 232 && code <= 255) {
    // Grayscale
    const value = Math.round(((code - 232) / 23) * 255);
    const hex = value.toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
  }
  
  // Color
  const r = Math.floor((code - 16) / 36) * 51;
  const g = Math.floor(((code - 16) % 36) / 6) * 51;
  const b = ((code - 16) % 6) * 51;
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Parse ANSI escape sequences
const parseAnsiEscape = (text: string): { char: string; fg: string; bg: string }[] => {
  const cells: { char: string; fg: string; bg: string }[] = [];
  let currentFg = '#FFFFFF';
  let currentBg = '#000000';
  
  // Split by ANSI escape sequences
  const parts = text.split(/\x1b\[([0-9;]*)m/);
  
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Text content
      const chars = parts[i].split('');
      for (const char of chars) {
        cells.push({
          char,
          fg: currentFg,
          bg: currentBg
        });
      }
    } else {
      // ANSI codes
      const codes = parts[i].split(';').map(Number);
      for (let j = 0; j < codes.length; j++) {
        const code = codes[j];
        if (code === 0) {
          // Reset
          currentFg = '#FFFFFF';
          currentBg = '#000000';
        } else if (code === 38 && codes[j + 1] === 5) {
          // Foreground color
          currentFg = ansiToHex(codes[j + 2]);
          j += 2;
        } else if (code === 48 && codes[j + 1] === 5) {
          // Background color
          currentBg = ansiToHex(codes[j + 2]);
          j += 2;
        }
      }
    }
  }
  
  return cells;
};

const parseTxtFile = async (file: File): Promise<ImportedData> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('File is empty');
  }

  const grid: Cell[][] = lines.map(line => 
    line.split('').map(char => ({
      char,
      fg: DEFAULT_FG,
      bg: DEFAULT_BG
    }))
  );

  return {
    grid,
    dimensions: {
      rows: grid.length,
      cols: grid[0].length
    }
  };
};

const parseJsonFile = async (file: File): Promise<ImportedData> => {
  const text = await file.text();
  const data = JSON.parse(text);

  // Validate the JSON structure
  if (!data.grid || !Array.isArray(data.grid)) {
    throw new Error('Invalid JSON format: missing or invalid grid data');
  }

  // Validate each cell has the required properties
  const grid = data.grid.map((row: any[]) => {
    if (!Array.isArray(row)) {
      throw new Error('Invalid JSON format: grid rows must be arrays');
    }
    return row.map((cell: any) => {
      if (!cell || typeof cell !== 'object') {
        throw new Error('Invalid JSON format: cells must be objects');
      }
      if (typeof cell.char !== 'string') {
        throw new Error('Invalid JSON format: cell.char must be a string');
      }
      return {
        char: cell.char,
        fg: cell.fg || DEFAULT_FG,
        bg: cell.bg || DEFAULT_BG
      };
    });
  });

  return {
    grid,
    dimensions: data.dimensions || {
      rows: grid.length,
      cols: grid[0].length
    }
  };
};

const parseAnsiFile = async (file: File): Promise<ImportedData> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('File is empty');
  }
  
  const grid = lines.map(line => parseAnsiEscape(line));
  
  // Ensure all rows have the same length
  const maxLength = Math.max(...grid.map(row => row.length));
  return {
    grid: grid.map(row => {
      while (row.length < maxLength) {
        row.push({ char: ' ', fg: '#FFFFFF', bg: '#000000' });
      }
      return row;
    })
  };
};

export const importMap = async (file: File, options: ImportOptions): Promise<ImportedData> => {
  try {
    // Validate file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['txt', 'json', 'ansi'].includes(extension)) {
      throw new Error('Unsupported file type');
    }
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      throw new Error('File too large (max 1MB)');
    }
    
    // Parse based on format
    switch (options.format) {
      case 'txt':
        return parseTxtFile(file);
      case 'json':
        return parseJsonFile(file);
      case 'ansi':
        return parseAnsiFile(file);
      default:
        throw new Error(`Unsupported import format: ${options.format}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to import map: ${error.message}`);
    }
    throw new Error('Failed to import map: Unknown error');
  }
}; 