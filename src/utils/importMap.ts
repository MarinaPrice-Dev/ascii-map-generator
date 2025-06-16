import type { Cell } from '../types/cell';

interface ImportOptions {
  format: 'txt' | 'json';
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

export const importMap = async (file: File, options: ImportOptions): Promise<ImportedData> => {
  try {
    switch (options.format) {
      case 'txt':
        return await parseTxtFile(file);
      case 'json':
        return await parseJsonFile(file);
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