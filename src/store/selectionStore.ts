import { create } from 'zustand';

export type SelectionMode = 'single' | 'multiple' | 'draw';
export type SelectionTool = 'select-area' | 'select-rectangle' | 'select-cells';

interface SelectionState {
  // Selection state
  selectedCells: Set<string>; // Format: "row,col"
  
  // Tool settings
  activeTool: SelectionTool;
  selectionMode: SelectionMode;
  
  // Selection actions
  selectCell: (row: number, col: number) => void;
  unselectCell: (row: number, col: number) => void;
  selectArea: (startRow: number, startCol: number, endRow: number, endCol: number) => void;
  selectRectangle: (startRow: number, startCol: number, endRow: number, endCol: number) => void;
  updateSelection: (newSelection: Set<string>) => void;
  clearSelection: () => void;
  
  // Tool management
  setActiveTool: (tool: SelectionTool) => void;
  setSelectionMode: (mode: SelectionMode) => void;
  
  // Utility functions
  isCellSelected: (row: number, col: number) => boolean;
  getSelectedCellsCount: () => number;
  isDrawMode: () => boolean;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedCells: new Set(),
  activeTool: 'select-area',
  selectionMode: 'draw', // Default to draw mode

  selectCell: (row: number, col: number) => {
    const { selectionMode, selectedCells } = get();
    const cellKey = `${row},${col}`;
    
    if (selectionMode === 'single') {
      set({ selectedCells: new Set([cellKey]) });
    } else {
      const newSelectedCells = new Set(selectedCells);
      newSelectedCells.add(cellKey);
      set({ selectedCells: newSelectedCells });
    }
  },

  unselectCell: (row: number, col: number) => {
    const { selectedCells } = get();
    const cellKey = `${row},${col}`;
    const newSelectedCells = new Set(selectedCells);
    newSelectedCells.delete(cellKey);
    set({ selectedCells: newSelectedCells });
  },

  selectArea: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const { selectionMode, selectedCells } = get();
    const newSelectedCells = selectionMode === 'single' ? new Set<string>() : new Set(selectedCells);
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        newSelectedCells.add(`${row},${col}`);
      }
    }
    
    set({ selectedCells: newSelectedCells });
  },

  selectRectangle: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const { selectionMode, selectedCells } = get();
    const newSelectedCells = selectionMode === 'single' ? new Set<string>() : new Set(selectedCells);
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    
    // Only select cells on the rectangle border
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        if (row === minRow || row === maxRow || col === minCol || col === maxCol) {
          newSelectedCells.add(`${row},${col}`);
        }
      }
    }
    
    set({ selectedCells: newSelectedCells });
  },

  updateSelection: (newSelection) => set({ selectedCells: newSelection }),

  clearSelection: () => {
    set({ selectedCells: new Set() });
  },

  setActiveTool: (tool: SelectionTool) => {
    set({ activeTool: tool });
  },

  setSelectionMode: (mode: SelectionMode) => {
    set({ selectionMode: mode });
  },

  isCellSelected: (row: number, col: number) => {
    const { selectedCells } = get();
    return selectedCells.has(`${row},${col}`);
  },

  getSelectedCellsCount: () => {
    const { selectedCells } = get();
    return selectedCells.size;
  },

  isDrawMode: () => {
    const { selectionMode } = get();
    return selectionMode === 'draw';
  },
})); 