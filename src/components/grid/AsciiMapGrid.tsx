import React, { useState } from 'react';
import type { Cell } from '../../types/cell';
import { useSelectionStore } from '../../store/selectionStore';
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
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isUnselectOperation, setIsUnselectOperation] = useState(false);

  const {
    activeTool,
    isCellSelected,
    selectCell,
    unselectCell,
    selectArea,
    selectRectangle,
    isDrawMode
  } = useSelectionStore();

  const handleStart = (row: number, col: number, isRightClick: boolean = false) => {
    // Check if we're in draw mode
    if (isDrawMode()) {
      // Drawing mode - can use selection tools to draw
      beginAction();
      setIsMouseDown(true);
      setStartCell({ row, col });
      setHoverCell({ row, col });
      
      // For individual cell drawing
      if (activeTool === 'select-cells') {
        updateCell(row, col, selectedChar, selectedFg, selectedBg);
      }
      return;
    }

    // Selection mode
    setIsSelectionMode(true);
    setIsMouseDown(true);
    setIsUnselectOperation(isRightClick);
    setStartCell({ row, col });
    setHoverCell({ row, col });

    if (activeTool === 'select-cells') {
      // For individual cell selection
      if (isRightClick) {
        unselectCell(row, col);
      } else {
        selectCell(row, col);
      }
    }
  };

  const handleMove = (row: number, col: number) => {
    if (isMouseDown && startCell) {
      setHoverCell({ row, col });
    }
  };

  const handleEnd = () => {
    if (isMouseDown && startCell && hoverCell && isSelectionMode) {
      // Handle area and rectangle selection/unselection
      if (activeTool === 'select-area') {
        if (isUnselectOperation) {
          // Unselect area - unselect all cells in the area
          const minRow = Math.min(startCell.row, hoverCell.row);
          const maxRow = Math.max(startCell.row, hoverCell.row);
          const minCol = Math.min(startCell.col, hoverCell.col);
          const maxCol = Math.max(startCell.col, hoverCell.col);
          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              unselectCell(r, c);
            }
          }
        } else {
          selectArea(startCell.row, startCell.col, hoverCell.row, hoverCell.col);
        }
      } else if (activeTool === 'select-rectangle') {
        if (isUnselectOperation) {
          // Unselect rectangle - unselect cells on the border
          const minRow = Math.min(startCell.row, hoverCell.row);
          const maxRow = Math.max(startCell.row, hoverCell.row);
          const minCol = Math.min(startCell.col, hoverCell.col);
          const maxCol = Math.max(startCell.col, hoverCell.col);
          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              if (r === minRow || r === maxRow || c === minCol || c === maxCol) {
                unselectCell(r, c);
              }
            }
          }
        } else {
          selectRectangle(startCell.row, startCell.col, hoverCell.row, hoverCell.col);
        }
      }
    } else if (isMouseDown && startCell && hoverCell && !isSelectionMode) {
      // Drawing mode - handle different drawing tools
      if (activeTool === 'select-area') {
        // Draw area - fill all cells in the rectangle
        const minRow = Math.min(startCell.row, hoverCell.row);
        const maxRow = Math.max(startCell.row, hoverCell.row);
        const minCol = Math.min(startCell.col, hoverCell.col);
        const maxCol = Math.max(startCell.col, hoverCell.col);
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            updateCell(r, c, selectedChar, selectedFg, selectedBg);
          }
        }
      } else if (activeTool === 'select-rectangle') {
        // Draw rectangle - only draw on the border
        const minRow = Math.min(startCell.row, hoverCell.row);
        const maxRow = Math.max(startCell.row, hoverCell.row);
        const minCol = Math.min(startCell.col, hoverCell.col);
        const maxCol = Math.max(startCell.col, hoverCell.col);
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            if (r === minRow || r === maxRow || c === minCol || c === maxCol) {
              updateCell(r, c, selectedChar, selectedFg, selectedBg);
            }
          }
        }
      } else if (activeTool === 'select-cells') {
        // Draw individual cells - already handled in handleStart
        // This is for drag operations
        updateCell(hoverCell.row, hoverCell.col, selectedChar, selectedFg, selectedBg);
      }
    }
    setIsMouseDown(false);
    setIsSelectionMode(false);
    setIsUnselectOperation(false);
    setStartCell(null);
    setHoverCell(null);
  };

  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (!isDrawMode() && activeTool === 'select-cells') {
      unselectCell(row, col);
    }
  };

  React.useEffect(() => {
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
    // eslint-disable-next-line
  }, [isMouseDown, startCell, hoverCell, selectedChar, selectedFg, selectedBg, isSelectionMode, activeTool, isUnselectOperation, isDrawMode]);

  // Helper to check if a cell is in the current selection rectangle
  const isInSelection = (row: number, col: number) => {
    if (!isMouseDown || !startCell || !hoverCell || !isSelectionMode) return false;
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
    // Only show for area/rectangle tools
    if (activeTool !== 'select-area' && activeTool !== 'select-rectangle') return null;
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
            const selected = isCellSelected(rowIndex, colIndex);
            const inSelection = isInSelection(rowIndex, colIndex);
            return (
              <div
                key={colIndex}
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={(e) => handleStart(rowIndex, colIndex, e.button === 2)}
                onMouseOver={() => handleMove(rowIndex, colIndex)}
                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                onTouchStart={() => handleStart(rowIndex, colIndex)}
                onTouchMove={handleTouchMove}
                className={`ascii-map-grid-cell ${selected ? 'selected' : ''} ${inSelection ? 'in-selection' : ''}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  color: cell.fg,
                  background: cell.bg,
                  fontSize: Math.floor(cellSize * 0.8),
                  borderColor: selected ? '#ddd' : '#444',
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