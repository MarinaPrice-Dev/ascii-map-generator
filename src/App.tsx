import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import AsciiMapGrid from './AsciiMapGrid'
import CharacterPicker from './CharacterPicker'

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 110; // enough for two rows of elements
const DESKTOP_CELL_SIZE = 20;
const MOBILE_CELL_SIZE = 14;

const getCellSize = () => (window.innerWidth < 600 ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE);

// Cell type with char, fg, bg
export type Cell = { char: string; fg: string; bg: string };

const DEFAULT_FG = '#ffffff';
const DEFAULT_BG = '#222222';
const FG_PRESETS = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
const BG_PRESETS = ['#222222', '#000000', '#ffffff', '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ccffff', '#ffccff'];

const App: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>('#')
  const [selectedFg, setSelectedFg] = useState<string>(DEFAULT_FG);
  const [selectedBg, setSelectedBg] = useState<string>(DEFAULT_BG);
  const [grid, setGrid] = useState<Cell[][]>([])
  const [cellSize, setCellSize] = useState<number>(getCellSize());
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [future, setFuture] = useState<Cell[][][]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const cellSize = getCellSize();
    setCellSize(cellSize);
    const availableWidth = window.innerWidth - 2;
    const availableHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT - 2;
    const cols = Math.floor(availableWidth / cellSize);
    const rows = Math.floor(availableHeight / cellSize);
    const initialGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ char: ' ', fg: DEFAULT_FG, bg: DEFAULT_BG })));
    setGrid(initialGrid);
    setHistory([]);
    setFuture([]);
  }, []);

  // Update a cell with char, fg, bg and push to history
  const updateCell = (row: number, col: number, char: string, fg: string, bg: string) => {
    setGrid(prev => {
      const newGrid = prev.map(arr => arr.slice())
      newGrid[row][col] = { char, fg, bg };
      return newGrid
    })
  }

  // beginAction: push current grid to history, clear future
  const beginAction = () => {
    setHistory(h => [...h, grid]);
    setFuture([]);
  };

  // Undo/Redo logic
  const undo = () => {
    setHistory(h => {
      if (h.length === 0) return h;
      setFuture(f => [grid, ...f]);
      setGrid(h[h.length - 1]);
      return h.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture(f => {
      if (f.length === 0) return f;
      setHistory(h => [...h, grid]);
      setGrid(f[0]);
      return f.slice(1);
    });
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
          <AsciiMapGrid grid={grid} updateCell={updateCell} beginAction={beginAction} selectedChar={selectedChar} selectedFg={selectedFg} selectedBg={selectedBg} cellSize={cellSize} />
        )}
      </main>
      {/* Footer */}
      <footer style={{ height: FOOTER_HEIGHT, borderTop: '1px solid var(--border)', background: 'var(--footer-bg)', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 8, gap: 16 }}>
          <button onClick={saveMap} style={{ height: 32 }}>Save Map</button>
          <button onClick={undo} style={{ height: 32 }} disabled={history.length === 0}>Undo</button>
          <button onClick={redo} style={{ height: 32 }} disabled={future.length === 0}>Redo</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 14 }}>Text</span>
            <input type="color" value={selectedFg} onChange={e => setSelectedFg(e.target.value)} />
            {FG_PRESETS.map(color => (
              <button key={color} style={{ background: color, width: 20, height: 20, border: selectedFg === color ? '2px solid #888' : '1px solid #444', marginLeft: 2, cursor: 'pointer' }} onClick={() => setSelectedFg(color)} />
            ))}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 14 }}>Background</span>
            <input type="color" value={selectedBg} onChange={e => setSelectedBg(e.target.value)} />
            {BG_PRESETS.map(color => (
              <button key={color} style={{ background: color, width: 20, height: 20, border: selectedBg === color ? '2px solid #888' : '1px solid #444', marginLeft: 2, cursor: 'pointer' }} onClick={() => setSelectedBg(color)} />
            ))}
          </label>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CharacterPicker selectedChar={selectedChar} setSelectedChar={setSelectedChar} />
        </div>
      </footer>
    </div>
  )
}

export default App
