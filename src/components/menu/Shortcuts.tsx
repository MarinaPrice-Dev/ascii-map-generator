import React from 'react';
import './Shortcuts.css';

const Shortcuts: React.FC = () => {
  const isMac = navigator.userAgent.includes('Mac');
  const modifierKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="shortcuts-container">
      <div className="shortcuts-section">
        <h3>Keyboard Shortcuts</h3>
          <div className="shortcut-list">
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>I</kbd>
            <span>Draw Mode</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>E</kbd>
            <span>Erase Mode</span>
          </div>
          <div className="shortcut-item">
            {isMac ? (
              <>
                <kbd>{modifierKey} Shift</kbd> <kbd>Space</kbd>
              </>
            ) : (
              <>
                <kbd>{modifierKey}</kbd> <kbd>Space</kbd>
              </>
            )}
            <span>Toggle Select Modes</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>A</kbd>
            <span>Select All</span>
          </div>
          <div className="shortcut-item">
            <kbd>Esc</kbd>
            <span>Clear Selection</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>Z</kbd>
            <span>Undo</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>Y</kbd>
            <span>Redo</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>S</kbd>
            <span>Save/Export</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>O</kbd>
            <span>Open/Import</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>+</kbd>
            <span>Zoom In</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>-</kbd>
            <span>Zoom Out</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>M</kbd>
            <span>Toggle Menu</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>C</kbd>
            <span>Copy</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>V</kbd>
            <span>Paste Mode</span>
          </div>
          <div className="shortcut-item">
            <kbd>{modifierKey}</kbd> <kbd>X</kbd>
            <span>Cut</span>
          </div>
          <div className="shortcut-item">
            <kbd>{isMac ? 'Backspace' : 'Delete'}</kbd>
            <span>Clear Grid</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts; 