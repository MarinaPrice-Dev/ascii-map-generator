import type { Cell } from './App';

export function getInitialGrid(rows: number, cols: number, fg: string, bg: string, char: string = ' '): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ char, fg, bg }))
  );
} 