import React, { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import './assets/responsive.css'
import AsciiMapGrid from './components/grid/AsciiMapGrid'
import { useUndoRedo } from './utils/useUndoRedo'
import { getInitialGrid } from './utils/mapUtils'
import { loadSavedState, saveState, clearSavedState } from './utils/saveState'
import { exportMap } from './utils/exportMap'
import Header from './components/header/Header'
import { Footer } from './components/footer/Footer'
import Menu from './components/menu/Menu'
import Sidebar from './components/sidebar/Sidebar'
import type { Cell } from './types/cell'
import { handleZoom, expandGrid } from './utils/zoomUtils'
import { useSelectionStore } from './store/selectionStore'
import { setupKeyboardShortcuts } from './utils/shortcuts'
import Loader from './components/loader/Loader'

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
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBorders, setShowBorders] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // Calculate initial grid dimensions once
  const getInitialGridDims = (currentCellSize: number) => {
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
    const cellWidth = Math.floor(currentCellSize * 0.5);
    const cols = Math.floor(availableWidth / cellWidth);
    const rows = Math.floor(availableHeight / currentCellSize);
    return { rows: rows, cols: cols };
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

  // Safe setGrid function that validates the grid before setting it
  const safeSetGrid = useCallback((newGrid: Cell[][] | ((prev: Cell[][]) => Cell[][])) => {
    if (typeof newGrid === 'function') {
      const currentGrid = grid; // Get current grid from state
      const result = newGrid(currentGrid);
      // Validate the result
      if (!result || !Array.isArray(result) || result.length === 0) {
        console.warn('Invalid grid generated, using fallback');
        setGrid(getInitialGrid(gridRows, gridCols, DEFAULT_FG, DEFAULT_BG));
      } else {
        setGrid(result);
      }
    } else {
      // Validate the new grid
      if (!newGrid || !Array.isArray(newGrid) || newGrid.length === 0) {
        console.warn('Invalid grid provided, using fallback');
        setGrid(getInitialGrid(gridRows, gridCols, DEFAULT_FG, DEFAULT_BG));
      } else {
        setGrid(newGrid);
      }
    }
  }, [grid, gridRows, gridCols]);

  // Ensure grid is properly initialized
  useEffect(() => {
    if (!grid || !Array.isArray(grid) || grid.length === 0) {
      console.warn('Grid was not properly initialized, creating new grid');
      safeSetGrid(getInitialGrid(gridRows, gridCols, DEFAULT_FG, DEFAULT_BG));
    }
  }, [grid, gridRows, gridCols, safeSetGrid]);

  // Save grid state whenever it changes
  useEffect(() => {
    saveState(grid, gridRows, gridCols, cellSize);
  }, [grid, gridRows, gridCols, cellSize]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    beginAction();
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
    
    const { newCellSize, newRows, newCols } = handleZoom(
      cellSize,
      true,
      availableWidth,
      availableHeight
    );

    setCellSize(newCellSize);
    setGridRows(newRows);
    setGridCols(newCols);
    safeSetGrid(prevGrid => {
      // Safety check to ensure grid is properly initialized
      if (!prevGrid || !Array.isArray(prevGrid) || prevGrid.length === 0) {
        return getInitialGrid(newRows, newCols, DEFAULT_FG, DEFAULT_BG);
      }
      return expandGrid(prevGrid, newRows, newCols, DEFAULT_FG, DEFAULT_BG);
    });
  };

  const handleZoomOut = () => {
    beginAction();
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
    
    const { newCellSize, newRows, newCols } = handleZoom(
      cellSize,
      false,
      availableWidth,
      availableHeight
    );

    setCellSize(newCellSize);
    setGridRows(newRows);
    setGridCols(newCols);
    safeSetGrid(prevGrid => {
      // Safety check to ensure grid is properly initialized
      if (!prevGrid || !Array.isArray(prevGrid) || prevGrid.length === 0) {
        return getInitialGrid(newRows, newCols, DEFAULT_FG, DEFAULT_BG);
      }
      return expandGrid(prevGrid, newRows, newCols, DEFAULT_FG, DEFAULT_BG);
    });
  };

  // Update a cell with char, fg, bg
  const updateCell = (row: number, col: number, char: string, fg: string, bg: string) => {
    safeSetGrid(prev => {
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

  // Update entire grid
  const updateGrid = (newGrid: Cell[][]) => {
    safeSetGrid(newGrid);
  }

  // Clear map
  const clearMap = () => {
    beginAction();
    safeSetGrid(getInitialGrid(gridRows, gridCols, DEFAULT_FG, DEFAULT_BG));
    clearSavedState();
  };

  // Reset grid to defaults
  const handleReset = () => {
    // Calculate initial grid dimensions based on default cell size
    const defaultCellSize = 20;
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
    const cellWidth = Math.floor(defaultCellSize * 0.5);
    const cols = Math.floor(availableWidth / cellWidth);
    const rows = Math.floor(availableHeight / defaultCellSize);
    
    // Reset all state to defaults
    setCellSize(defaultCellSize);
    setGridRows(rows);
    setGridCols(cols);
    safeSetGrid(getInitialGrid(rows, cols, DEFAULT_FG, DEFAULT_BG));
    
    // Clear saved state and history
    clearSavedState();
    
    // Clear selection
    clearSelection();
    
    // Reset character and color selections to defaults
    setSelectedChar('#');
    setSelectedFg(DEFAULT_FG);
    setSelectedBg(DEFAULT_BG);
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

  const openImageDialog = () => {
    setIsMenuOpen(false); // Close menu when opening image dialog
    setIsImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
  };

  const handleBorderToggle = () => {
    setShowBorders(prev => !prev);
  };

  // Handle map export
  const handleExport = async (format: 'txt' | 'json' | 'ansi' | 'rot' | 'png' | 'html' | 'html-color') => {
    setIsLoading(true);
    try {
      // Calculate font size based on cell size for HTML export
      const fontSize = Math.floor(cellSize * 0.8);
      await exportMap(grid, { format }, fontSize);
    setIsExportPanelOpen(false); // Close panel after exporting
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportMap = (importedGrid: Cell[][]) => {
    beginAction();
    
    // Safety check for current grid
    if (!grid || !Array.isArray(grid) || grid.length === 0) {
      console.warn('Current grid is invalid, creating new grid with imported dimensions');
      safeSetGrid(importedGrid);
      return;
    }
    
    // Create a new grid with the same dimensions as the current grid
    const newGrid = Array.from({ length: grid.length }, (_, rowIndex) =>
      Array.from({ length: grid[0]?.length || 0 }, (_, colIndex) => {
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

    safeSetGrid(newGrid);
  };

  const handleImageImport = (importedGrid: Cell[][], imageDimensions?: { width: number; height: number; gridRows: number; gridCols: number }) => {
    beginAction();
    
    // Validate the imported grid structure
    if (!importedGrid || !Array.isArray(importedGrid) || importedGrid.length === 0) {
      console.error('Invalid imported grid structure');
      return;
    }
    
    // Validate each row in the imported grid
    for (let r = 0; r < importedGrid.length; r++) {
      if (!importedGrid[r] || !Array.isArray(importedGrid[r])) {
        console.error(`Invalid row structure at index ${r}`);
        return;
      }
    }
    
    if (imageDimensions && imageDimensions.gridRows > 0 && imageDimensions.gridCols > 0) {
      // Use the grid dimensions from the image conversion result
      const { gridRows: newRows, gridCols: newCols } = imageDimensions;
      
      // Update grid dimensions (keep current cell size)
      setGridRows(newRows);
      setGridCols(newCols);
      
      // Validate that the imported grid matches the expected dimensions
      if (importedGrid.length === newRows && importedGrid[0]?.length === newCols) {
        safeSetGrid(importedGrid);
      } else {
        console.warn('Imported grid dimensions do not match expected dimensions, creating new grid');
        safeSetGrid(getInitialGrid(newRows, newCols, DEFAULT_FG, DEFAULT_BG));
      }
    } else {
      // Fallback to regular import if no image dimensions
      handleImportMap(importedGrid);
    }
  };

  const handleTransform = (
    transformFn: (grid: Cell[][], selection: Set<string>) => { newGrid: Cell[][], newSelection?: Set<string> }
  ) => {
    beginAction();
    const { newGrid, newSelection } = transformFn(grid, selectedCells);
    safeSetGrid(newGrid);

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
      safeSetGrid(newGrid);
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
      safeSetGrid(newGrid);
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
      safeSetGrid(newGrid);
    }
    setSelectedBg(newBg);
  };

  // Handle grid resizing
  const handleResizeGrid = (newRows: number, newCols: number) => {
    beginAction();
    
    // Create new grid with the new dimensions
    const newGrid = getInitialGrid(newRows, newCols, DEFAULT_FG, DEFAULT_BG);
    
    // Copy existing content, expanding or shrinking as needed
    const minRows = Math.min(grid.length, newRows);
    const minCols = Math.min(grid[0]?.length || 0, newCols);
    
    for (let row = 0; row < minRows; row++) {
      for (let col = 0; col < minCols; col++) {
        if (grid[row] && grid[row][col]) {
          newGrid[row][col] = { ...grid[row][col] };
        }
      }
    }
    
    setGridRows(newRows);
    setGridCols(newCols);
    setGrid(newGrid);
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
      {isLoading && <Loader message="Exporting..." />}
      <Header
        onSaveMap={handleExport}
        onClearMap={clearMap}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        grid={grid}
        cellSize={cellSize}
        gridRows={gridRows}
        gridCols={gridCols}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onImportMap={handleImportMap}
        onImageImport={handleImageImport}
        onResizeGrid={handleResizeGrid}
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        isExportPanelOpen={isExportPanelOpen}
        onExportPanelToggle={handleExportPanelToggle}
        isImageDialogOpen={isImageDialogOpen}
        onOpenImageDialog={openImageDialog}
        onCloseImageDialog={closeImageDialog}
        showBorders={showBorders}
        onBorderToggle={handleBorderToggle}
      />
      
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          {/* Main Grid Area */}
          <main ref={mainRef} className={`main-grid-area ${isMenuOpen ? 'menu-open' : ''} ${isImageDialogOpen ? 'imageimportdialog-open' : ''}`}>
            {grid.length > 0 && (
              <AsciiMapGrid
                grid={grid}
                updateCell={updateCell}
                updateGrid={updateGrid}
                beginAction={beginAction}
                selectedChar={selectedChar}
                selectedFg={selectedFg}
                selectedBg={selectedBg}
                cellSize={cellSize}
                defaultFg={DEFAULT_FG}
                defaultBg={DEFAULT_BG}
                showBorders={showBorders}
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
            isImageDialogOpen={isImageDialogOpen}
          />
        </div>
        
        <Menu 
          isOpen={isMenuOpen} 
          onClose={handleMenuToggle} 
          onRotate={handleRotate} 
          onMirror={handleMirror}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}

export default App
