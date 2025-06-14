import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import AsciiMapGrid from './components/grid/AsciiMapGrid'
import { useUndoRedo } from './utils/useUndoRedo'
import { getInitialGrid } from './utils/mapUtils'
import { loadSavedState, saveState, clearSavedState } from './utils/saveState'
import Header from './components/header/Header'
import { Footer } from './components/footer/Footer'
import type { Cell } from './types/cell'
import { handleZoom, expandGrid } from './utils/zoomUtils'

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 150;
const CELL_SIZE = 20;

const getCellSize = () => CELL_SIZE;

const DEFAULT_FG = '#FFFFFF';
const DEFAULT_BG = '#222222';

const App: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>('#')
  const [selectedFg, setSelectedFg] = useState<string>(DEFAULT_FG);
  const [selectedBg, setSelectedBg] = useState<string>(DEFAULT_BG);
  const mainRef = useRef<HTMLDivElement>(null);

  // Initial grid setup
  const getGridDims = (currentCellSize: number) => {
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    const cols = Math.floor(availableWidth / currentCellSize);
    const rows = Math.floor(availableHeight / currentCellSize);
    return { rows, cols };
  };

  // First, try to load saved zoom level
  const savedState = localStorage.getItem('ascii-map-state');
  let initialCellSize = getCellSize();
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      if (parsed.cellSize) {
        initialCellSize = parsed.cellSize;
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }

  // Calculate grid dimensions based on the zoom level
  const { rows, cols } = getGridDims(initialCellSize);
  
  // Now load the complete saved state with the correct dimensions
  const { grid: savedGrid, cellSize: savedCellSize } = loadSavedState(
    rows,
    cols,
    DEFAULT_FG,
    DEFAULT_BG,
    initialCellSize
  );

  const [cellSize, setCellSize] = useState<number>(savedCellSize);
  const [grid, setGrid, undo, redo, canUndo, canRedo, beginAction] = useUndoRedo<Cell[][]>(savedGrid);

  // Save grid state whenever it changes
  useEffect(() => {
    const { rows, cols } = getGridDims(cellSize);
    saveState(grid, rows, cols, cellSize);
  }, [grid, cellSize]);

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
    setGrid(prevGrid => expandGrid(prevGrid, newRows, newCols, DEFAULT_FG, DEFAULT_BG));
  };

  // Update a cell with char, fg, bg
  const updateCell = (row: number, col: number, char: string, fg: string, bg: string) => {
    setGrid(prev => {
      const newGrid = prev.map(arr => arr.slice())
      newGrid[row][col] = { char, fg, bg };
      return newGrid
    })
  }

  // Clear map
  const clearMap = () => {
    beginAction();
    const { rows, cols } = getGridDims(cellSize);
    setGrid(getInitialGrid(rows, cols, DEFAULT_FG, DEFAULT_BG));
    clearSavedState();
  };

  // Save map (only chars)
  const saveMap = () => {
    if (!grid.length) return;
    let minRow = grid.length, maxRow = -1, minCol = grid[0].length, maxCol = -1
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c].char !== ' ') {
          if (r < minRow) minRow = r
          if (r > maxRow) maxRow = r
          if (c < minCol) minCol = c
          if (c > maxCol) maxCol = c
        }
      }
    }
    if (maxRow === -1) return // nothing to save
    const lines = []
    for (let r = minRow; r <= maxRow; r++) {
      lines.push(grid[r].slice(minCol, maxCol + 1).map(cell => cell.char).join(''))
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ascii-map.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header
        onSaveMap={saveMap}
        onClearMap={clearMap}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        grid={grid}
        cellSize={cellSize}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      {/* Main Grid Area */}
      <main ref={mainRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg)' }}>
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
      />
    </div>
  )
}

export default App
