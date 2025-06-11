import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import AsciiMapGrid from './components/AsciiMapGrid'
import { useUndoRedo } from './utils/useUndoRedo'
import { getInitialGrid } from './utils/mapUtils'
import Header from './components/Header'
import { Footer } from './components/footer/Footer'
import type { Cell } from './types/cell'

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 150;
const DESKTOP_CELL_SIZE = 20;
const MOBILE_CELL_SIZE = 14;

const getCellSize = () => (window.innerWidth < 600 ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE);

const DEFAULT_FG = '#ffffff';
const DEFAULT_BG = '#222222';
const FG_PRESETS = ['#ffffff', '#222222', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
const BG_PRESETS = ['#222222', '#000000', '#ffffff', '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ccffff', '#ffccff'];

const App: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>('#')
  const [selectedFg, setSelectedFg] = useState<string>(DEFAULT_FG);
  const [selectedBg, setSelectedBg] = useState<string>(DEFAULT_BG);
  const [cellSize, setCellSize] = useState<number>(getCellSize());
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // Initial grid setup
  const getGridDims = () => {
    const cellSize = getCellSize();
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    const cols = Math.floor(availableWidth / cellSize);
    const rows = Math.floor(availableHeight / cellSize);
    return { rows, cols };
  };

  const { rows, cols } = getGridDims();
  const [grid, setGrid, undo, redo, canUndo, canRedo, beginAction] = useUndoRedo<Cell[][]>(getInitialGrid(rows, cols, DEFAULT_FG, DEFAULT_BG));

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const cellSize = getCellSize();
    setCellSize(cellSize);
    // Only reset grid on mount, not on every resize
    // eslint-disable-next-line
  }, []);

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
    setGrid(getInitialGrid(rows, cols, DEFAULT_FG, DEFAULT_BG));
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
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
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
        fgPresets={FG_PRESETS}
        bgPresets={BG_PRESETS}
      />
    </div>
  )
}

export default App
