import type { Cell } from '../types/cell';
import { importMap } from './importMap';
import { useSelectionStore } from '../store/selectionStore';

interface ShortcutProps {
  undo: () => void;
  redo: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleExportPanelToggle: () => void;
  handleMenuToggle: () => void;
  clearSelection: () => void;
  updateSelection: (newSelection: Set<string>) => void;
  gridRows: number;
  gridCols: number;
  handleImportMap: (grid: Cell[][]) => void;
  handleCopy: () => void;
  handlePasteModeToggle: () => void;
  handleCut: () => void;
  handleClear: () => void;
}

export const setupKeyboardShortcuts = (props: ShortcutProps) => {
  const {
    undo,
    redo,
    handleZoomIn,
    handleZoomOut,
    handleExportPanelToggle,
    handleMenuToggle,
    clearSelection,
    updateSelection,
    gridRows,
    gridCols,
    handleImportMap,
    handleCopy,
    handlePasteModeToggle,
    handleCut,
    handleClear,
  } = props;

  const { setSelectionMode } = useSelectionStore.getState();

  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    if (e.key === 'z' && ctrlKey) {
      e.preventDefault();
      undo();
    } else if (e.key === 'y' && ctrlKey) {
      e.preventDefault();
      redo();
    } else if (e.key === 's' && ctrlKey) {
      e.preventDefault();
      handleExportPanelToggle();
    } else if (e.key === 'o' && ctrlKey) {
      e.preventDefault();
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.txt,.json,.ansi,.rot.txt';
      fileInput.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase() as 'txt' | 'json' | 'ansi' | 'rot' | undefined;
        if (!extension) {
            alert('Invalid file type');
            return;
        }
        
        const format = file.name.includes('.rot.txt') ? 'rot' : extension;

        try {
          const imported = await importMap(file, { format });
          handleImportMap(imported.grid);
        } catch (error) {
          console.error(error);
          alert(`Error importing map: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      fileInput.click();
    } else if (e.key === 'a' && ctrlKey) {
      e.preventDefault();
      const allCells = new Set<string>();
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          allCells.add(`${r},${c}`);
        }
      }
      updateSelection(allCells);
      setSelectionMode('single');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clearSelection();
    } else if ((e.key === '=' || e.key === '+') && ctrlKey) {
        e.preventDefault();
        handleZoomIn();
    } else if (e.key === '-' && ctrlKey) {
        e.preventDefault();
        handleZoomOut();
    } else if (e.code === 'Space' && ctrlKey && !isMac) {
      // Windows/Linux: Ctrl + Space
      e.preventDefault();
      const currentMode = useSelectionStore.getState().selectionMode;
      setSelectionMode(currentMode === 'single' ? 'multiple' : 'single');
    } else if (e.code === 'Space' && ctrlKey && e.shiftKey && isMac) {
      // macOS: Cmd + Shift + Space
      e.preventDefault();
      const currentMode = useSelectionStore.getState().selectionMode;
      setSelectionMode(currentMode === 'single' ? 'multiple' : 'single');
    } else if (e.key === 'm' && ctrlKey) {
      e.preventDefault();
      handleMenuToggle();
    } else if (e.key === 'c' && ctrlKey) {
      e.preventDefault();
      handleCopy();
    } else if (e.key === 'v' && ctrlKey) {
      e.preventDefault();
      handlePasteModeToggle();
    } else if (e.key === 'x' && ctrlKey) {
      e.preventDefault();
      handleCut();
    } else if (e.key === 'e' && ctrlKey) {
      // Erase mode: Cmd + E (mac) / Ctrl + E (windows)
      e.preventDefault();
      setSelectionMode('eraser');
    } else if (e.key === 'i' && ctrlKey) {
      // Draw mode: Cmd + I (mac) / Ctrl + I (windows)
      e.preventDefault();
      setSelectionMode('draw');
    } else if (e.key === 'Delete' && !isMac) {
      // Windows: Delete key
      e.preventDefault();
      handleClear();
    } else if (e.key === 'Backspace' && isMac) {
      // macOS: Backspace key
      e.preventDefault();
      handleClear();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}; 