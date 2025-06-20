import React, { useState } from 'react';
import './Help.css';

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shortcuts');

  return (
    <div className="help-container">
      <div className="help-tabs">
        <button 
          className={`help-tab ${activeTab === 'shortcuts' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortcuts')}
        >
          Shortcuts
        </button>
        <button 
          className={`help-tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          Tools
        </button>
        <button 
          className={`help-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
      </div>

      <div className="help-content">
        {activeTab === 'shortcuts' && (
          <div className="help-section">
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
                <kbd>Delete</kbd>
                <span>Clear Selection</span>
              </div>
              <div className="shortcut-item">
                <kbd>+</kbd>
                <span>Zoom In</span>
              </div>
              <div className="shortcut-item">
                <kbd>-</kbd>
                <span>Zoom Out</span>
              </div>
              <div className="shortcut-item">
                <kbd>Space</kbd>
                <span>Toggle Draw/Select Mode</span>
              </div>
              <div className="shortcut-item">
                <kbd>M</kbd>
                <span>Toggle Menu</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="help-section">
            <h3>Selection Tools</h3>
            <div className="tool-help">
              <div className="tool-item">
                <h4>Select Area</h4>
                <p>Click and drag to select a rectangular area. All cells within the area will be selected.</p>
                <div className="tool-usage">
                  <strong>Usage:</strong> Left-click to select, right-click to unselect
                </div>
              </div>
              
              <div className="tool-item">
                <h4>Select Rectangle</h4>
                <p>Click and drag to select only the border cells of a rectangle.</p>
                <div className="tool-usage">
                  <strong>Usage:</strong> Left-click to select, right-click to unselect
                </div>
              </div>
              
              <div className="tool-item">
                <h4>Select Cells</h4>
                <p>Click individual cells to select or unselect them one by one.</p>
                <div className="tool-usage">
                  <strong>Usage:</strong> Left-click to select, right-click to unselect
                </div>
              </div>
            </div>

            <h3>Drawing Modes</h3>
            <div className="mode-help">
              <div className="mode-item">
                <h4>Draw Mode</h4>
                <p>Use any selection tool to draw with the selected character and colors.</p>
              </div>
              
              <div className="mode-item">
                <h4>Select Mode</h4>
                <p>Use selection tools to select cells for copying, moving, or other operations.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="help-section">
            <h3>Getting Started</h3>
            <div className="general-help">
              <div className="help-item">
                <h4>Creating Your First Map</h4>
                <ol>
                  <li>Choose a character from the footer palette</li>
                  <li>Select foreground and background colors</li>
                  <li>Click on the grid to start drawing</li>
                  <li>Use the selection tools for larger areas</li>
                  <li>Save your work using the export button</li>
                </ol>
              </div>
              
              <div className="help-item">
                <h4>Export Formats</h4>
                <ul>
                  <li><strong>Text (.txt):</strong> Plain ASCII text file</li>
                  <li><strong>JSON (.json):</strong> Structured data with colors and metadata</li>
                  <li><strong>ANSI (.ans):</strong> ANSI art format with colors</li>
                  <li><strong>ROT (.rot):</strong> ROT13 encoded text</li>
                </ul>
              </div>
              
              <div className="help-item">
                <h4>Tips & Tricks</h4>
                <ul>
                  <li>Use the zoom controls to work on fine details</li>
                  <li>Hold Shift while selecting for precise control</li>
                  <li>Use the undo/redo buttons to experiment freely</li>
                  <li>Save frequently to avoid losing your work</li>
                  <li>Try different color combinations for unique effects</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help; 