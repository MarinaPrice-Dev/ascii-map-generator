import React, { useState } from 'react';
import type { Cell } from '../../types/cell';
import { useSelectionStore } from '../../store/selectionStore';
import './AsciiMapGrid.css';

type AsciiMapGridProps = {
  grid: Cell[][];
  updateCell: (row: number, col: number, char: string, fg: string, bg: string) => void;
  updateGrid: (newGrid: Cell[][]) => void;
  beginAction: () => void;
  selectedChar: string;
  selectedFg: string;
  selectedBg: string;
  cellSize: number;
  defaultFg: string;
  defaultBg: string;
  showBorders: boolean;
  pasteMode?: boolean;
  pastePreviewData?: Cell[][] | null;
  onPaste?: (row: number, col: number) => void;
};

const AsciiMapGrid: React.FC<AsciiMapGridProps> = ({
  grid, updateCell, updateGrid, beginAction, selectedChar, selectedFg, selectedBg, cellSize, defaultFg, defaultBg, showBorders, pasteMode, pastePreviewData, onPaste
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const [previousCell, setPreviousCell] = useState<{ row: number; col: number } | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isUnselectOperation, setIsUnselectOperation] = useState(false);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [previewCell, setPreviewCell] = useState<{ row: number; col: number } | null>(null);

  const {
    activeTool,
    isCellSelected,
    selectCell,
    unselectCell,
    selectArea,
    selectRectangle,
    isDrawMode,
    selectionMode
  } = useSelectionStore();

  // Line interpolation function using Bresenham's algorithm
  const getCellsBetween = (start: { row: number; col: number }, end: { row: number; col: number }) => {
    const cells: { row: number; col: number }[] = [];
    let { row: x0, col: y0 } = start;
    let { row: x1, col: y1 } = end;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    
    while (true) {
      cells.push({ row: x0, col: y0 });
      
      if (x0 === x1 && y0 === y1) break;
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    
    return cells;
  };

  const clearCell = (row: number, col: number) => {
    updateCell(row, col, ' ', defaultFg, defaultBg);
  };

  const processCell = (row: number, col: number) => {
    const cellKey = `${row},${col}`;
    if (visitedCells.has(cellKey)) return;

    if (isDrawMode()) {
      if (isUnselectOperation) {
        clearCell(row, col);
      } else {
        updateCell(row, col, selectedChar, selectedFg, selectedBg);
      }
    } else {
      if (isUnselectOperation) {
        unselectCell(row, col);
      } else {
        selectCell(row, col);
      }
    }
    
    setVisitedCells(prev => new Set(prev).add(cellKey));
  };

  const handleStart = (row: number, col: number, isRightClick: boolean = false) => {
    setVisitedCells(new Set());
    setPreviousCell({ row, col });

    if (isDrawMode()) {
      beginAction();
      setIsMouseDown(true);
      setStartCell({ row, col });
      setHoverCell({ row, col });
      setIsUnselectOperation(isRightClick);
      
      // Set selection mode to true for area/rectangle tools to show the selection rectangle
      if (activeTool === 'select-area' || activeTool === 'select-rectangle') {
        setIsSelectionMode(true);
      }

      if (activeTool === 'select-cells') {
        processCell(row, col);
      }
      return;
    }

    setIsSelectionMode(true);
    setIsMouseDown(true);
    setIsUnselectOperation(isRightClick);
    setStartCell({ row, col });
    setHoverCell({ row, col });

    if (activeTool === 'select-cells') {
      processCell(row, col);
    }
  };

  const handleMove = (row: number, col: number) => {
    if (isMouseDown && startCell) {
      setHoverCell({ row, col });
      
      // Handle continuous drawing/selection for select-cells tool
      if (activeTool === 'select-cells' && previousCell) {
        // Get all cells between the previous position and current position
        const cellsToProcess = getCellsBetween(previousCell, { row, col });
        
        // Process each cell in the line
        cellsToProcess.forEach(cell => {
          processCell(cell.row, cell.col);
        });
      }
      
      setPreviousCell({ row, col });
    }
  };

  const handleEnd = () => {
    if (isMouseDown && startCell && hoverCell) {
      if (selectionMode !== 'draw') {
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
      } else { // This is Draw Mode
        const minRow = Math.min(startCell.row, hoverCell.row);
        const maxRow = Math.max(startCell.row, hoverCell.row);
        const minCol = Math.min(startCell.col, hoverCell.col);
        const maxCol = Math.max(startCell.col, hoverCell.col);

        if (activeTool === 'select-area') {
          // Batch update all cells in the area
          const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              if (isUnselectOperation) {
                newGrid[r][c] = { char: ' ', fg: defaultFg, bg: defaultBg, selected: false };
              } else {
                newGrid[r][c] = { char: selectedChar, fg: selectedFg, bg: selectedBg, selected: false };
              }
            }
          }
          updateGrid(newGrid);
        } else if (activeTool === 'select-rectangle') {
          // Batch update cells on the rectangle border
          const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
          for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
              if (r === minRow || r === maxRow || c === minCol || c === maxCol) {
                if (isUnselectOperation) {
                  newGrid[r][c] = { char: ' ', fg: defaultFg, bg: defaultBg, selected: false };
                } else {
                  newGrid[r][c] = { char: selectedChar, fg: selectedFg, bg: selectedBg, selected: false };
                }
              }
            }
          }
          updateGrid(newGrid);
        }
      }
    }

    setIsMouseDown(false);
    setIsSelectionMode(false);
    setIsUnselectOperation(false);
    setStartCell(null);
    setHoverCell(null);
    setPreviousCell(null);
    setVisitedCells(new Set());
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
  }, [isMouseDown, startCell, hoverCell, previousCell, selectedChar, selectedFg, selectedBg, isSelectionMode, activeTool, isUnselectOperation, isDrawMode, visitedCells]);

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
    // Show for area/rectangle tools in both draw and selection modes
    if (activeTool !== 'select-area' && activeTool !== 'select-rectangle') return null;
    const minRow = Math.min(startCell.row, hoverCell.row);
    const maxRow = Math.max(startCell.row, hoverCell.row);
    const minCol = Math.min(startCell.col, hoverCell.col);
    const maxCol = Math.max(startCell.col, hoverCell.col);
    const cellWidth = Math.floor(cellSize * 0.5);
    return {
      top: minRow * cellSize,
      left: minCol * cellWidth,
      width: (maxCol - minCol + 1) * cellWidth,
      height: (maxRow - minRow + 1) * cellSize
    };
  };

  const selectionRect = getSelectionRectangle();

  // Render preview overlay for paste mode
  const renderPastePreview = () => {
    if (!pasteMode || !pastePreviewData || !previewCell) return null;
    const rows = pastePreviewData.length;
    const cols = Math.max(...pastePreviewData.map(row => row.length));
    const startRow = previewCell.row;
    const startCol = previewCell.col;
    const cellWidth = Math.floor(cellSize * 0.5);
    return (
      <div style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, top: 0, left: 0 }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: 'flex', position: 'absolute', top: (startRow + r) * cellSize, left: startCol * cellWidth }}>
            {Array.from({ length: cols }).map((_, c) => {
              const cell = pastePreviewData[r]?.[c];
              // Crop if out of bounds
              if (startRow + r >= grid.length || startCol + c >= grid[0].length || !cell) return null;
              return (
                <div
                  key={c}
                  style={{
                    width: cellWidth,
                    height: cellSize,
                    opacity: 0.8,
                    background: cell.bg,
                    color: cell.fg,
                    fontFamily: 'monospace',
                    fontSize: Math.floor(cellSize * 0.8),
                    border: '1px dashed #3b83f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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

  return (
    <div 
      className={`ascii-map-grid ${selectionMode !== 'draw' ? 'selection-mode' : ''} ${!showBorders ? 'no-borders' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${Math.floor(cellSize * 0.5)}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
        position: 'relative',
      }}
    >
      {renderPastePreview()}
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
                onMouseDown={(e) => {
                  if (pasteMode && pastePreviewData && onPaste) {
                    e.preventDefault();
                    onPaste(rowIndex, colIndex);
                  } else {
                    handleStart(rowIndex, colIndex, e.button === 2);
                  }
                }}
                onMouseOver={() => handleMove(rowIndex, colIndex)}
                onMouseEnter={() => setPreviewCell({ row: rowIndex, col: colIndex })}
                onMouseLeave={() => setPreviewCell(null)}
                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                onTouchStart={() => handleStart(rowIndex, colIndex)}
                onTouchMove={handleTouchMove}
                className={`ascii-map-grid-cell ${selected ? 'selected' : ''} ${inSelection ? 'in-selection' : ''}`}
                style={{
                  width: Math.floor(cellSize * 0.5),
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
      {previewCell && isDrawMode() && (
        <div
          className="cell-preview"
          style={{
            position: 'absolute',
            top: previewCell.row * cellSize,
            left: previewCell.col * Math.floor(cellSize * 0.5),
            width: Math.floor(cellSize * 0.5),
            height: cellSize,
            backgroundColor: selectedBg,
            color: selectedFg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.floor(cellSize * 0.8),
            fontFamily: 'monospace',
            lineHeight: 1,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {selectedChar}
        </div>
      )}
    </div>
  );
};

export default AsciiMapGrid; 