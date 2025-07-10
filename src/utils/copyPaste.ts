import type { Cell } from '../types/cell';

/**
 * Copy grid data to clipboard as HTML with preserved colors and formatting
 * @param grid - The 2D grid of cells
 * @param selectedCells - Set of selected cell keys in "row,col" format
 * @returns Promise that resolves when copy is complete
 */
export const copyGridAsHtml = async (grid: Cell[][], selectedCells: Set<string>): Promise<void> => {
  try {
    // Determine what to copy: selection or entire grid
    const gridData = selectedCells.size > 0 ? getSelectedCellsData(grid, selectedCells) : getAllGridData(grid);
    
    if (!gridData || !gridData.cells || gridData.cells.length === 0) {
      console.warn('No data to copy');
      return;
    }

    // Generate HTML with preserved colors and symbols
    const htmlContent = generateHtmlFromCells(gridData.cells, gridData.rows, gridData.cols);
    
    // Copy to clipboard
    await copyHtmlToClipboard(htmlContent);
    
    console.log('Copy successful');
  } catch (error) {
    console.error('Error copying:', error);
    throw error;
  }
};

/**
 * Get selected cells data as a 2D grid with bounds
 */
const getSelectedCellsData = (grid: Cell[][], selectedCells: Set<string>): { cells: Cell[][], rows: number, cols: number } => {
  // Find bounds of selection
  let minRow = Infinity, maxRow = -Infinity;
  let minCol = Infinity, maxCol = -Infinity;
  
  selectedCells.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
  });

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  
  // Create a 2D array for the selected region
  const selectedGrid: Cell[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const gridRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      const originalRow = minRow + row;
      const originalCol = minCol + col;
      const cellKey = `${originalRow},${originalCol}`;
      
      if (selectedCells.has(cellKey) && grid[originalRow]?.[originalCol]) {
        gridRow.push({ ...grid[originalRow][originalCol] });
      } else {
        // Add empty cell to maintain grid structure
        gridRow.push({ char: ' ', fg: '#FFFFFF', bg: '#222222' });
      }
    }
    selectedGrid.push(gridRow);
  }

  return { cells: selectedGrid, rows, cols };
};

/**
 * Get all grid data as a 2D grid with dimensions
 */
const getAllGridData = (grid: Cell[][]): { cells: Cell[][], rows: number, cols: number } => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  // Create a copy of the grid
  const gridCopy: Cell[][] = grid.map(row => 
    row.map(cell => ({ ...cell }))
  );
  
  return { cells: gridCopy, rows, cols };
};

/**
 * Generate HTML from a 2D grid of cells with preserved formatting
 */
const generateHtmlFromCells = (cells: Cell[][], rows: number, cols: number): string => {
  let html = '<div style="font-family: monospace; line-height: 1; white-space: pre;">';
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = cells[row]?.[col];
      
      if (cell) {
        // Escape HTML special characters
        const escapedChar = cell.char
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        
        html += `<span style="color: ${cell.fg}; background-color: ${cell.bg};">${escapedChar}</span>`;
      }
    }
    html += '<br>';
  }
  
  html += '</div>';
  return html;
};

/**
 * Copy HTML content to clipboard with fallback support
 */
const copyHtmlToClipboard = async (htmlContent: string): Promise<void> => {
  try {
    // Create a temporary element to hold the HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
    document.body.appendChild(tempElement);
    
    // Select the content
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // Copy to clipboard
    const success = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(tempElement);
    if (selection) {
      selection.removeAllRanges();
    }
    
    if (!success) {
      // Fallback to modern clipboard API
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([htmlContent.replace(/<[^>]*>/g, '')], { type: 'text/plain' })
        })
      ]);
    }
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error);
    // Fallback: try to copy as plain text
    try {
      const plainText = htmlContent.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(plainText);
      console.log('Fallback: Plain text copied to clipboard');
    } catch (fallbackError) {
      console.error('Failed to copy as plain text:', fallbackError);
      throw fallbackError;
    }
  }
}; 