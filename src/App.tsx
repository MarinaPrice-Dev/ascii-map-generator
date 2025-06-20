import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import AsciiMapGrid from './components/grid/AsciiMapGrid'
import { useUndoRedo } from './utils/useUndoRedo'
import { getInitialGrid } from './utils/mapUtils'
import { loadSavedState, saveState, clearSavedState } from './utils/saveState'
import { exportMap } from './utils/exportMap'
import Header from './components/header/Header'
import { Footer } from './components/footer/Footer'
import Menu from './components/menu/Menu'
import type { Cell } from './types/cell'
import { handleZoom, expandGrid } from './utils/zoomUtils'
import { useSelectionStore } from './store/selectionStore'
import { setupKeyboardShortcuts } from './utils/shortcuts'

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 200;
const CELL_SIZE = 20;

const getCellSize = () => CELL_SIZE;

const DEFAULT_FG = '#FFFFFF';
const DEFAULT_BG = '#222222';

const App: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>('#')
  const [selectedFg, setSelectedFg] = useState<string>(DEFAULT_FG);
  const [selectedBg, setSelectedBg] = useState<string>(DEFAULT_BG);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Calculate initial grid dimensions once
  const getInitialGridDims = (currentCellSize: number) => {
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    const cols = Math.floor(availableWidth / currentCellSize);
    const rows = Math.floor(availableHeight / currentCellSize);
    // Make it square by using the smaller dimension for both rows and columns
    const squareSize = Math.max(rows, cols);
    return { rows: squareSize, cols: squareSize };
  };

  // First, try to load saved zoom level and dimensions
  const savedState = localStorage.getItem('ascii-map-state');
  let initialCellSize = getCellSize();
  let initialRows = 0;
  let initialCols = 0;
  
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      if (parsed.cellSize) {
        initialCellSize = parsed.cellSize;
      }
      if (parsed.rows && parsed.cols) {
        // Use saved dimensions if available
        initialRows = parsed.rows;
        initialCols = parsed.cols;
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }

  // If no saved dimensions, calculate them
  if (initialRows === 0 || initialCols === 0) {
    const dims = getInitialGridDims(initialCellSize);
    initialRows = dims.rows;
    initialCols = dims.cols;
  }
  
  // Now load the complete saved state with the correct dimensions
  const { grid: savedGrid, cellSize: savedCellSize } = loadSavedState(
    initialRows,
    initialCols,
    DEFAULT_FG,
    DEFAULT_BG,
    initialCellSize
  );

  const [cellSize, setCellSize] = useState<number>(savedCellSize);
  const [gridRows, setGridRows] = useState<number>(initialRows);
  const [gridCols, setGridCols] = useState<number>(initialCols);
  const [grid, setGrid, undo, redo, canUndo, canRedo, beginAction] = useUndoRedo<Cell[][]>(savedGrid);

  const { selectedCells, updateSelection, clearSelection } = useSelectionStore();

  // Save grid state whenever it changes
  useEffect(() => {
    saveState(grid, gridRows, gridCols, cellSize);
  }, [grid, gridRows, gridCols, cellSize]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    beginAction();
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    
    const { newCellSize, newRows, newCols } = handleZoom(
      cellSize,
      true,
      availableWidth,
      availableHeight
    );

    setCellSize(newCellSize);
    setGridRows(newRows);
    setGridCols(newCols);
    setGrid(prevGrid => expandGrid(prevGrid, newRows, newCols, DEFAULT_FG, DEFAULT_BG));
  };

  const handleZoomOut = () => {
    beginAction();
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    
    const { newCellSize, newRows, newCols } = handleZoom(
      cellSize,
      false,
      availableWidth,
      availableHeight
    );

    setCellSize(newCellSize);
    setGridRows(newRows);
    setGridCols(newCols);
    setGrid(prevGrid => expandGrid(prevGrid, newRows, newCols, DEFAULT_FG, DEFAULT_BG));
  };

  // Update a cell with char, fg, bg
  const updateCell = (row: number, col: number, char: string, fg: string, bg: string) => {
    setGrid(prev => {
      const newGrid = prev.map(arr => arr.slice())
      newGrid[row][col] = { 
        char, 
        fg, 
        bg, 
        selected: newGrid[row][col]?.selected || false 
      };
      return newGrid
    })
  }

  // Clear map
  const clearMap = () => {
    beginAction();
    setGrid(getInitialGrid(gridRows, gridCols, DEFAULT_FG, DEFAULT_BG));
    clearSavedState();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
    if (!isMenuOpen) {
      setIsExportPanelOpen(false); // Close export panel if opening menu
    }
  };

  const handleExportPanelToggle = () => {
    setIsExportPanelOpen(prev => !prev);
    if (!isExportPanelOpen) {
      setIsMenuOpen(false); // Close menu if opening export panel
    }
  };

  // Handle map export
  const handleExport = (format: 'txt' | 'json' | 'ansi' | 'rot') => {
    exportMap(grid, { format });
    setIsExportPanelOpen(false); // Close panel after exporting
  };

  const handleImportMap = (importedGrid: Cell[][]) => {
    beginAction();
    // Create a new grid with the same dimensions as the current grid
    const newGrid = Array.from({ length: grid.length }, (_, rowIndex) =>
      Array.from({ length: grid[0].length }, (_, colIndex) => {
        const importedCell = importedGrid[rowIndex]?.[colIndex];
        if (importedCell) {
          return {
            char: importedCell.char,
            fg: importedCell.fg || DEFAULT_FG,
            bg: importedCell.bg || DEFAULT_BG,
            selected: importedCell.selected || false,
          };
        }
        return {
          char: ' ',
          fg: DEFAULT_FG,
          bg: DEFAULT_BG,
          selected: false,
        };
      })
    );

    setGrid(newGrid);
  };

  const handleTransform = (
    transformFn: (grid: Cell[][], selection: Set<string>) => { newGrid: Cell[][], newSelection?: Set<string> }
  ) => {
    beginAction();
    const { newGrid, newSelection } = transformFn(grid, selectedCells);
    setGrid(newGrid);

    if (newSelection) {
      updateSelection(newSelection);
    } else {
      clearSelection();
    }
  };

  const handleRotate = (direction: 'left' | 'right') => {
    handleTransform((currentGrid, currentSelection) => {
      // Full grid rotation logic will be complex due to dimension changes,
      // so for now we only handle selection rotation.
      if (currentSelection.size === 0) return { newGrid: currentGrid };

      const newGrid = currentGrid.map(row => [...row]); // Deep copy
      const cellsToMove: { from: { r: number, c: number }, cell: Cell }[] = [];
      let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;

      currentSelection.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        cellsToMove.push({ from: { r, c }, cell: newGrid[r][c] });
        minR = Math.min(minR, r); maxR = Math.max(maxR, r);
        minC = Math.min(minC, c); maxC = Math.max(maxC, c);
        newGrid[r][c] = { char: ' ', fg: DEFAULT_FG, bg: DEFAULT_BG, selected: false };
      });

      const centerX = (minC + maxC) / 2;
      const centerY = (minR + maxR) / 2;
      const newSelection = new Set<string>();

      cellsToMove.forEach(({ from, cell }) => {
        const { r, c } = from;
        const newR = Math.round(centerY + (direction === 'right' ? 1 : -1) * (c - centerX));
        const newC = Math.round(centerX + (direction === 'right' ? -1 : 1) * (r - centerY));

        if (newR >= 0 && newR < gridRows && newC >= 0 && newC < gridCols) {
          newGrid[newR][newC] = { ...cell, selected: true };
          newSelection.add(`${newR},${newC}`);
        }
      });
      
      return { newGrid, newSelection };
    });
  };

  const handleMirror = (direction: 'horizontal' | 'vertical') => {
    handleTransform((currentGrid, currentSelection) => {
       if (currentSelection.size === 0) { // Full grid mirror
         const newGrid = direction === 'horizontal' 
           ? currentGrid.map(row => [...row].reverse())
           : [...currentGrid].reverse();
         return { newGrid };
       }

      // Selection mirror logic
      const newGrid = currentGrid.map(row => [...row]);
      const cellsToMove: { from: { r: number, c: number }, cell: Cell }[] = [];
      let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;

      currentSelection.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        cellsToMove.push({ from: { r, c }, cell: newGrid[r][c] });
        minR = Math.min(minR, r); maxR = Math.max(maxR, r);
        minC = Math.min(minC, c); maxC = Math.max(maxC, c);
        newGrid[r][c] = { char: ' ', fg: DEFAULT_FG, bg: DEFAULT_BG, selected: false };
      });

      const newSelection = new Set<string>();

      cellsToMove.forEach(({ from, cell }) => {
        const { r, c } = from;
        const newR = direction === 'vertical' ? maxR - (r - minR) : r;
        const newC = direction === 'horizontal' ? maxC - (c - minC) : c;
        
        if (newR >= 0 && newR < gridRows && newC >= 0 && newC < gridCols) {
          newGrid[newR][newC] = { ...cell, selected: true };
          newSelection.add(`${newR},${newC}`);
        }
      });

      return { newGrid, newSelection };
    });
  };

  const handleUpdateSelectedChar = (newChar: string) => {
    if (selectedCells.size > 0) {
      beginAction();
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      selectedCells.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        if (newGrid[r]?.[c]) {
          newGrid[r][c].char = newChar;
        }
      });
      setGrid(newGrid);
    }
    setSelectedChar(newChar);
  };

  const handleUpdateSelectedFg = (newFg: string) => {
    if (selectedCells.size > 0) {
      beginAction();
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      selectedCells.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        if (newGrid[r]?.[c]) {
          newGrid[r][c].fg = newFg;
        }
      });
      setGrid(newGrid);
    }
    setSelectedFg(newFg);
  };

  const handleUpdateSelectedBg = (newBg: string) => {
    if (selectedCells.size > 0) {
      beginAction();
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      selectedCells.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        if (newGrid[r]?.[c]) {
          newGrid[r][c].bg = newBg;
        }
      });
      setGrid(newGrid);
    }
    setSelectedBg(newBg);
  };

  // Setup keyboard shortcuts
  useEffect(() => {
    const cleanup = setupKeyboardShortcuts({
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
    });

    return cleanup;
  }, [
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
    handleImportMap
  ]);

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header
        onSaveMap={handleExport}
        onClearMap={clearMap}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        grid={grid}
        cellSize={cellSize}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onImportMap={handleImportMap}
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        isExportPanelOpen={isExportPanelOpen}
        onExportPanelToggle={handleExportPanelToggle}
      />
      
      <div className="main-content">
        {/* Main Grid Area */}
        <main ref={mainRef} className={`main-grid-area ${isMenuOpen ? 'menu-open' : ''}`}>
          {grid.length > 0 && (
            <AsciiMapGrid
              grid={grid}
              updateCell={updateCell}
              beginAction={beginAction}
              selectedChar={selectedChar}
              selectedFg={selectedFg}
              selectedBg={selectedBg}
              cellSize={cellSize}
              defaultFg={DEFAULT_FG}
              defaultBg={DEFAULT_BG}
            />
          )}
        </main>
        
        <Footer
          selectedChar={selectedChar}
          setSelectedChar={handleUpdateSelectedChar}
          selectedFg={selectedFg}
          setSelectedFg={handleUpdateSelectedFg}
          selectedBg={selectedBg}
          setSelectedBg={handleUpdateSelectedBg}
          isMenuOpen={isMenuOpen}
        />
        
        <Menu 
          isOpen={isMenuOpen} 
          onClose={handleMenuToggle} 
          onRotate={handleRotate} 
          onMirror={handleMirror}
        />
      </div>
    </div>
  )
}

export default App
