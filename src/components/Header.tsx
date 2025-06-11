import React from 'react';
import { UndoIcon, RedoIcon, ClearIcon, SaveIcon, ThemeIcon } from './icons/Icons';
import './icons/Icons.css';

interface HeaderProps {
  onSaveMap: () => void;
  onClearMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
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
}) => {
  return (
    <>
      {/* Header */}
      <header className="app-header" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>ASCII Studio</h1>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
            <UndoIcon />
          </button>
          <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
            <RedoIcon />
          </button>
          <button className="icon-button clear-button" onClick={onClearMap} title="Clear Map">
            <ClearIcon />
          </button>
          <button className="icon-button save-button" onClick={onSaveMap} title="Export Map">
            <SaveIcon />
          </button>
          <button 
            className="icon-button theme-button" 
            onClick={() => onDarkModeChange(!darkMode)} 
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <ThemeIcon isDark={darkMode} />
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
        <button className="icon-button clear-button" onClick={onClearMap} title="Clear Map">
          <ClearIcon />
        </button>
        <button className="icon-button save-button" onClick={onSaveMap} title="Export Map">
          <SaveIcon />
        </button>
        <button 
          className="icon-button theme-button" 
          onClick={() => onDarkModeChange(!darkMode)} 
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <ThemeIcon isDark={darkMode} />
        </button>
      </div>
    </>
  );
};

export default Header; 