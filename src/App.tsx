import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import AsciiMapGrid from './AsciiMapGrid'
import CharacterPicker from './CharacterPicker'

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 110; // enough for two rows of elements
const DESKTOP_CELL_SIZE = 20;
const MOBILE_CELL_SIZE = 14;

const getCellSize = () => (window.innerWidth < 600 ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE);

const App: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>('#')
  const [grid, setGrid] = useState<string[][]>([])
  const [cellSize, setCellSize] = useState<number>(getCellSize());
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set CSS variables for theme
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    // Calculate available space for grid
    const cellSize = getCellSize();
    setCellSize(cellSize);
    // Subtract a few extra pixels to avoid overflow from borders
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    const cols = Math.floor(availableWidth / cellSize);
    const rows = Math.floor(availableHeight / cellSize);
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(' ')));
    // eslint-disable-next-line
  }, []);

  // Function to update a cell in the grid
  const updateCell = (row: number, col: number, char: string) => {
    setGrid(prev => {
      const newGrid = prev.map(arr => arr.slice())
      newGrid[row][col] = char
      return newGrid
    })
  }

  // Function to export the minimal bounding rectangle of filled cells
  const saveMap = () => {
    if (!grid.length) return;
    let minRow = grid.length, maxRow = -1, minCol = grid[0].length, maxCol = -1
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] !== ' ') {
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
      lines.push(grid[r].slice(minCol, maxCol + 1).join(''))
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
      {/* Header */}
      <header style={{ height: HEADER_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>ASCII Map Generator</h1>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>Dark Mode</span>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(d => !d)} />
          </label>
        </div>
      </header>
      {/* Main Grid Area */}
      <main ref={mainRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg)' }}>
        {grid.length > 0 && (
          <AsciiMapGrid grid={grid} updateCell={updateCell} selectedChar={selectedChar} cellSize={cellSize} />
        )}
      </main>
      {/* Footer */}
      <footer style={{ height: FOOTER_HEIGHT, borderTop: '1px solid var(--border)', background: 'var(--footer-bg)', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <button onClick={saveMap} style={{ height: 32, marginRight: 16 }}>Save Map</button>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CharacterPicker selectedChar={selectedChar} setSelectedChar={setSelectedChar} />
        </div>
      </footer>
    </div>
  )
}

export default App
