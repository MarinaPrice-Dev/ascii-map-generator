import React, { useState } from 'react';
import { UndoIcon, RedoIcon, ClearIcon, SaveIcon, ThemeIcon, InfoIcon } from '../icons/Icons';
import '../icons/Icons.css';
import './Header.css';
import InfoDialog from './InfoDialog';

interface HeaderProps {
  onSaveMap: () => void;
  onClearMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
  grid: Array<Array<{ char: string }>>;
}

const Header: React.FC<HeaderProps> = ({
  onSaveMap,
  onClearMap,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  darkMode,
  onDarkModeChange,
  grid = [],
}) => {
  const isGridEmpty = grid.every(row => row.every(cell => cell.char === ' '));
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <h1>ASCII Studio</h1>
        <div className="header-actions">
          <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
            <UndoIcon />
          </button>
          <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
            <RedoIcon />
          </button>
          <button className="icon-button clear-button" onClick={onClearMap} disabled={!canUndo} title="Clear Map">
            <ClearIcon />
          </button>
          <button className="icon-button save-button" onClick={onSaveMap} disabled={!canUndo} title="Export Map">
            <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </button>
          <button 
            className="icon-button theme-button" 
            onClick={() => onDarkModeChange(!darkMode)} 
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <ThemeIcon isDark={darkMode} />
          </button>
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
        <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
          <UndoIcon />
        </button>
        <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
          <RedoIcon />
        </button>
        <button className="icon-button clear-button" onClick={onClearMap} disabled={isGridEmpty} title="Clear Map">
          <ClearIcon />
        </button>
        <button className="icon-button save-button" onClick={onSaveMap} disabled={isGridEmpty} title="Export Map">
          <svg className="icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </button>
        <button 
          className="icon-button theme-button" 
          onClick={() => onDarkModeChange(!darkMode)} 
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <ThemeIcon isDark={darkMode} />
        </button>
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