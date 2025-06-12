import React, { useState } from 'react';
import type { Cell } from '../types/cell';

type AsciiMapGridProps = {
  grid: Cell[][];
  updateCell: (row: number, col: number, char: string, fg: string, bg: string) => void;
  beginAction: () => void;
  selectedChar: string;
  selectedFg: string;
  selectedBg: string;
  cellSize: number;
};

const AsciiMapGrid: React.FC<AsciiMapGridProps> = ({ grid, updateCell, beginAction, selectedChar, selectedFg, selectedBg, cellSize }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  const handleStart = (row: number, col: number) => {
    beginAction();
    setIsMouseDown(true);
    setStartCell({ row, col });
    setHoverCell({ row, col });
  };

  const handleMove = (row: number, col: number) => {
    if (isMouseDown && startCell) {
      setHoverCell({ row, col });
    }
  };

  const handleEnd = () => {
    if (isMouseDown && startCell && hoverCell) {
      const minRow = Math.min(startCell.row, hoverCell.row);
      const maxRow = Math.max(startCell.row, hoverCell.row);
      const minCol = Math.min(startCell.col, hoverCell.col);
      const maxCol = Math.max(startCell.col, hoverCell.col);
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          updateCell(r, c, selectedChar, selectedFg, selectedBg);
        }
      }
    }
    setIsMouseDown(false);
    setStartCell(null);
    setHoverCell(null);
  };

  React.useEffect(() => {
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
    // eslint-disable-next-line
  }, [isMouseDown, startCell, hoverCell, selectedChar, selectedFg, selectedBg]);

  // Helper to check if a cell is in the current selection rectangle
  const isInSelection = (row: number, col: number) => {
    if (!isMouseDown || !startCell || !hoverCell) return false;
    const minRow = Math.min(startCell.row, hoverCell.row);
    const maxRow = Math.max(startCell.row, hoverCell.row);
    const minCol = Math.min(startCell.col, hoverCell.col);
    const maxCol = Math.max(startCell.col, hoverCell.col);
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element) {
      const rowIndex = element.getAttribute('data-row');
      const colIndex = element.getAttribute('data-col');
      
      if (rowIndex !== null && colIndex !== null) {
        handleMove(parseInt(rowIndex), parseInt(colIndex));
      }
    }
  };

  return (
    <div 
      style={{ 
        display: 'inline-block', 
        border: '1px solid #ccc', 
        background: 'var(--bg)', 
        userSelect: 'none',
        touchAction: 'none' // Prevent default touch actions like scrolling
      }}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => {
            const selected = isInSelection(rowIndex, colIndex);
            return (
              <div
                key={colIndex}
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={() => handleStart(rowIndex, colIndex)}
                onMouseOver={() => handleMove(rowIndex, colIndex)}
                onTouchStart={() => handleStart(rowIndex, colIndex)}
                onTouchMove={handleTouchMove}
                style={{
                  width: cellSize,
                  height: cellSize,
                  border: '1px solid #444',
                  color: cell.fg,
                  background: selected ? '#555' : cell.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontSize: Math.floor(cellSize * 0.8),
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {cell.char}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AsciiMapGrid; 