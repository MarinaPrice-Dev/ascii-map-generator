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

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 200;
const CELL_SIZE = 20;
const MENU_WIDTH = 340;

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
            <AsciiMapGrid grid={grid} updateCell={updateCell} beginAction={beginAction} selectedChar={selectedChar} selectedFg={selectedFg} selectedBg={selectedBg} cellSize={cellSize} />
          )}
        </main>
        
        <Footer
          selectedChar={selectedChar}
          setSelectedChar={setSelectedChar}
          selectedFg={selectedFg}
          setSelectedFg={setSelectedFg}
          selectedBg={selectedBg}
          setSelectedBg={setSelectedBg}
          isMenuOpen={isMenuOpen}
        />
        
        <Menu isOpen={isMenuOpen} onClose={handleMenuToggle} />
      </div>
    </div>
  )
}

export default App
