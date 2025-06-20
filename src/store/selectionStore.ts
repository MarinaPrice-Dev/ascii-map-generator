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
  selectionMode: 'draw',

  isDrawMode: () => get().selectionMode === 'draw',

  selectCell: (row: number, col: number) => {
    const { selectionMode, selectedCells } = get();
    const newSelectedCells = selectionMode === 'multiple' ? new Set(selectedCells) : new Set<string>();
    newSelectedCells.add(`${row},${col}`);
    set({ selectedCells: newSelectedCells });
  },

  unselectCell: (row: number, col: number) => {
    set(state => {
      const newSelectedCells = new Set(state.selectedCells);
      newSelectedCells.delete(`${row},${col}`);
      return { selectedCells: newSelectedCells };
    });
  },

  selectArea: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const { selectionMode, selectedCells } = get();
    const newSelectedCells = selectionMode === 'multiple' ? new Set(selectedCells) : new Set<string>();
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelectedCells.add(`${r},${c}`);
      }
    }
    set({ selectedCells: newSelectedCells });
  },

  selectRectangle: (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const { selectionMode, selectedCells } = get();
    const newSelectedCells = selectionMode === 'multiple' ? new Set(selectedCells) : new Set<string>();
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (r === minRow || r === maxRow || c === minCol || c === maxCol) {
          newSelectedCells.add(`${r},${c}`);
        }
      }
    }
    set({ selectedCells: newSelectedCells });
  },

  updateSelection: (newSelection) => set({ selectedCells: newSelection }),

  clearSelection: () => {
    set({ selectedCells: new Set() });
  },

  setActiveTool: (tool) => set({ activeTool: tool }),

  setSelectionMode: (mode: SelectionMode) => {
    if (mode === 'draw') {
      set({ selectionMode: mode, selectedCells: new Set() });
    } else {
      set({ selectionMode: mode });
    }
  },

  isCellSelected: (row: number, col: number) => {
    return get().selectedCells.has(`${row},${col}`);
  },

  getSelectedCellsCount: () => {
    const { selectedCells } = get();
    return selectedCells.size;
  },
})); 