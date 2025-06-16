import React, { useState, useRef } from 'react';
import { UndoIcon, RedoIcon, ClearIcon, InfoIcon, ZoomInIcon, ZoomOutIcon, ImportIcon } from '../icons/Icons';
import '../icons/Icons.css';
import './Header.css';
import InfoDialog from './InfoDialog';
import ExportDropdown from './ExportDropdown';
import { MIN_ZOOM, MAX_ZOOM } from '../../utils/zoomUtils';
import { importMap } from '../../utils/importMap';
import type { Cell } from '../../types/cell';

interface HeaderProps {
  onSaveMap: (format: 'txt' | 'json') => void;
  onClearMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  grid: Array<Array<{ char: string }>>;
  cellSize: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onImportMap: (grid: Cell[][]) => void;
}

const Header: React.FC<HeaderProps> = ({
  onSaveMap,
  onClearMap,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  grid = [],
  cellSize,
  onZoomIn,
  onZoomOut,
  onImportMap,
}) => {
  const isGridEmpty = grid.every(row => row.every(cell => cell.char === ' '));
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const validateFileType = (file: File): 'txt' | 'json' | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'txt') return 'txt';
    if (extension === 'json') return 'json';
    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input
    event.target.value = '';

    const format = validateFileType(file);
    if (!format) {
      alert('Please select a .txt or .json file');
      return;
    }

    try {
      const result = await importMap(file, { format });
      
      // Validate grid dimensions
      const currentRows = grid.length;
      const currentCols = grid[0]?.length || 0;
      
      if (result.dimensions) {
        if (result.dimensions.rows > currentRows || result.dimensions.cols > currentCols) {
          alert(`The imported map is too large. Maximum dimensions are ${currentRows}x${currentCols}`);
          return;
        }
      }

      onImportMap(result.grid);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to import map');
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <h1>ASCII Studio</h1>
        <div className="header-actions">
          <div className="zoom-controls">
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomOut} 
              disabled={cellSize <= MIN_ZOOM} 
              title="Zoom Out"
            >
              <ZoomOutIcon />
            </button>
            <span className="zoom-level">{cellSize}px</span>
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomIn} 
              disabled={cellSize >= MAX_ZOOM} 
              title="Zoom In"
            >
              <ZoomInIcon />
            </button>
          </div>
          <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
            <UndoIcon />
          </button>
          <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
            <RedoIcon />
          </button>
          <button className="icon-button clear-button" onClick={onClearMap} disabled={isGridEmpty} title="Clear Map">
            <ClearIcon />
          </button>
          <div className="desktop-only">
            <ExportDropdown onExport={onSaveMap} disabled={isGridEmpty} />
          </div>
          <div className="desktop-only">
            <button className="icon-button import-button" onClick={handleImportClick} title="Import Map">
              <ImportIcon />
              <span className="button-label">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <button 
            className="icon-button info-button" 
            onClick={() => setShowInfoDialog(true)} 
            title="More Information"
          >
            <InfoIcon />
          </button>
        </div>
      </header>
      {/* Toolbar for mobile/tablet */}
      <div className="toolbar-actions">
        <div className="zoom-controls">
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomOut} 
              disabled={cellSize <= MIN_ZOOM} 
              title="Zoom Out"
            >
              <ZoomOutIcon />
            </button>
            <span className="zoom-level">{cellSize}px</span>
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomIn} 
              disabled={cellSize >= MAX_ZOOM} 
              title="Zoom In"
            >
              <ZoomInIcon />
            </button>
          </div>
        <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
          <UndoIcon />
        </button>
        <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
          <RedoIcon />
        </button>
        <button className="icon-button clear-button" onClick={onClearMap} disabled={isGridEmpty} title="Clear Map">
          <ClearIcon />
        </button>
        <ExportDropdown onExport={onSaveMap} disabled={isGridEmpty} />
        <button className="icon-button import-button" onClick={handleImportClick} title="Import Map">
          <ImportIcon />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button 
          className="icon-button info-button" 
          onClick={() => setShowInfoDialog(true)} 
          title="More Information"
        >
          <InfoIcon />
        </button>
      </div>
      {showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} />}
    </>
  );
};

export default Header; 