import React, { useState } from 'react';

type AsciiMapGridProps = {
  grid: string[][];
  updateCell: (row: number, col: number, char: string) => void;
  selectedChar: string;
  cellSize: number;
};

const AsciiMapGrid: React.FC<AsciiMapGridProps> = ({ grid, updateCell, selectedChar, cellSize }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    setStartCell({ row, col });
    setHoverCell({ row, col });
  };

  const handleMouseOver = (row: number, col: number) => {
    if (isMouseDown && startCell) {
      setHoverCell({ row, col });
    }
  };

  const handleMouseUp = () => {
    if (isMouseDown && startCell && hoverCell) {
      const minRow = Math.min(startCell.row, hoverCell.row);
      const maxRow = Math.max(startCell.row, hoverCell.row);
      const minCol = Math.min(startCell.col, hoverCell.col);
      const maxCol = Math.max(startCell.col, hoverCell.col);
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          updateCell(r, c, selectedChar);
        }
      }
    }
    setIsMouseDown(false);
    setStartCell(null);
    setHoverCell(null);
  };

  React.useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
    // eslint-disable-next-line
  }, [isMouseDown, startCell, hoverCell, selectedChar]);

  // Helper to check if a cell is in the current selection rectangle
  const isInSelection = (row: number, col: number) => {
    if (!isMouseDown || !startCell || !hoverCell) return false;
    const minRow = Math.min(startCell.row, hoverCell.row);
    const maxRow = Math.max(startCell.row, hoverCell.row);
    const minCol = Math.min(startCell.col, hoverCell.col);
    const maxCol = Math.max(startCell.col, hoverCell.col);
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };

  return (
    <div style={{ display: 'inline-block', border: '1px solid #ccc', background: '#222', userSelect: 'none' }}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => {
            const selected = isInSelection(rowIndex, colIndex);
            return (
              <div
                key={colIndex}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  border: '1px solid #444',
                  color: '#fff',
                  background: selected
                    ? '#555'
                    : cell === ' ' ? '#222' : '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontSize: Math.floor(cellSize * 0.8),
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AsciiMapGrid; 