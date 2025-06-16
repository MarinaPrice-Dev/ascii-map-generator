import React, { useState } from 'react';
import { UndoIcon, RedoIcon, ClearIcon, InfoIcon, ZoomInIcon, ZoomOutIcon } from '../icons/Icons';
import '../icons/Icons.css';
import './Header.css';
import InfoDialog from './InfoDialog';
import ExportDropdown from './ExportDropdown';
import { MIN_ZOOM, MAX_ZOOM } from '../../utils/zoomUtils';

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
}) => {
  const isGridEmpty = grid.every(row => row.every(cell => cell.char === ' '));
  const [showInfoDialog, setShowInfoDialog] = useState(false);

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
          <ExportDropdown onExport={onSaveMap} disabled={isGridEmpty} />
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