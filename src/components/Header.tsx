import React from 'react';

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
        <h1 style={{ fontSize: 24, margin: 0 }}>ASCII Map Generator</h1>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onUndo} style={{ height: 32 }} disabled={!canUndo}>Undo</button>
          <button onClick={onRedo} style={{ height: 32 }} disabled={!canRedo}>Redo</button>
          <button onClick={onClearMap} style={{ height: 32 }}>Clear Map</button>
          <button onClick={onSaveMap} style={{ height: 32 }}>Save Map</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
            <span style={{ fontSize: 14 }}>Dark Mode</span>
            <input type="checkbox" checked={darkMode} onChange={() => onDarkModeChange(!darkMode)} />
          </label>
        </div>
      </header>
      {/* Toolbar for mobile/tablet */}
      <div className="toolbar-actions">
        <button onClick={onUndo} style={{ height: 40 }} disabled={!canUndo}>Undo</button>
        <button onClick={onRedo} style={{ height: 40 }} disabled={!canRedo}>Redo</button>
        <button onClick={onClearMap} style={{ height: 40 }}>Clear</button>
        <button onClick={onSaveMap} style={{ height: 40 }}>Save</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 14 }}>Dark</span>
          <input type="checkbox" checked={darkMode} onChange={() => onDarkModeChange(!darkMode)} />
        </label>
      </div>
    </>
  );
};

export default Header; 