import React from 'react';
import './Shortcuts.css';

const Shortcuts: React.FC = () => {
  return (
    <div className="shortcuts-container">
      <div className="shortcuts-section">
        <h3>Keyboard Shortcuts</h3>
        <div className="shortcut-list">
          <div className="shortcut-item">
            <kbd>Ctrl + Z</kbd>
            <span>Undo</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + Y</kbd>
            <span>Redo</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + S</kbd>
            <span>Save/Export</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + O</kbd>
            <span>Open/Import</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + A</kbd>
            <span>Select All</span>
          </div>
          <div className="shortcut-item">
            <kbd>Esc</kbd>
            <span>Clear Selection</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + +</kbd>
            <span>Zoom In</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + -</kbd>
            <span>Zoom Out</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + Space</kbd>
            <span>Toggle Draw/Select</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + M</kbd>
            <span>Toggle Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts; 