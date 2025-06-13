import React, { useState } from 'react';
import type { Cell } from '../../types/cell';
import './AsciiMapGrid.css';

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

  // Calculate selection rectangle position and size
  const getSelectionRectangle = () => {
    if (!isMouseDown || !startCell || !hoverCell) return null;

    const minRow = Math.min(startCell.row, hoverCell.row);
    const maxRow = Math.max(startCell.row, hoverCell.row);
    const minCol = Math.min(startCell.col, hoverCell.col);
    const maxCol = Math.max(startCell.col, hoverCell.col);

    return {
      top: minRow * cellSize,
      left: minCol * cellSize,
      width: (maxCol - minCol + 1) * cellSize,
      height: (maxRow - minRow + 1) * cellSize
    };
  };

  const selectionRect = getSelectionRectangle();

  return (
    <div className="ascii-map-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="ascii-map-grid-row">
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
                className={`ascii-map-grid-cell ${selected ? 'selected' : ''}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  color: cell.fg,
                  background: cell.bg,
                  fontSize: Math.floor(cellSize * 0.8),
                }}
              >
                {cell.char}
              </div>
            );
          })}
        </div>
      ))}
      {selectionRect && (
        <div
          className="selection-rectangle"
          style={{
            top: selectionRect.top,
            left: selectionRect.left,
            width: selectionRect.width,
            height: selectionRect.height
          }}
        />
      )}
    </div>
  );
};

export default AsciiMapGrid; 