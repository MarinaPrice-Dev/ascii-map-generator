import React from 'react';
import { createPortal } from 'react-dom';
import { SaveIcon } from '../icons/Icons';
import './ExportDropdown.css';

interface ExportDropdownProps {
  onExport: (format: 'txt' | 'json' | 'ansi' | 'rot' | 'png' | 'html' | 'html-color') => void;
  disabled?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExport,
  disabled = false,
  isOpen,
  onToggle,
}) => {
  const handleExport = (format: 'txt' | 'json' | 'ansi' | 'rot' | 'png' | 'html' | 'html-color') => {
    onExport(format);
    // The panel is now closed by the App component
  };

  return (
    <div className="export-dropdown">
      <button 
        className={`icon-button save-button ${isOpen ? 'dropdown-open' : ''}`}
        onClick={onToggle}
        disabled={disabled}
        title="Export"
      >
        <SaveIcon />
        <span className="button-label">Export</span>
      </button>
      
      {isOpen && createPortal(
        <div className={`export-panel ${isOpen ? 'open' : ''}`}>
          <div className="export-panel-header">
            <span>Export Formats</span>
            <button className="export-panel-close" onClick={onToggle}>×</button>
          </div>
          <div className="export-panel-content">
          <div className="export-item" onClick={() => handleExport('html-color')}>
              <div className="export-item-content">
                <span className="export-label">HTML File (.html)  <span style={{fontWeight: '400', color: '#aaa'}}>**Recommended**</span></span>
                <span className="export-description">HTML with individual character colors preserved. Ideal for sharing.</span>
              </div>
            </div>
            <div className="export-item" onClick={() => handleExport('html')}>
              <div className="export-item-content">
                <span className="export-label">HTML File (.html) - Plain text</span>
                <span className="export-description">Basic HTML with monospaced font styling, no colors.</span>
              </div>
            </div>
            <div className="export-item" onClick={() => handleExport('txt')}>
              <div className="export-item-content">
                <span className="export-label">Text File (.txt)</span>
                <span className="export-description">Plain text, no colors.</span>
              </div>
            </div>
            <div className="export-item" onClick={() => handleExport('png')}>
              <div className="export-item-content">
                <span className="export-label">PNG Image (.png)</span>
                <span className="export-description">High-quality image with exact colors and styling.</span>
              </div>
            </div>
            <div className="export-item" onClick={() => handleExport('json')}>
              <div className="export-item-content">
                <span className="export-label">JSON File (.json)</span>
                <span className="export-description">Includes colors and metadata. Ideal for re-importing.</span>
              </div>
            </div>
            <div className="export-item" onClick={() => handleExport('ansi')}>
              <div className="export-item-content">
                <span className="export-label">ANSI Art File (.ans)</span>
                <span className="export-description">Standard format for text art with colors.</span>
              </div>
            </div>
            <div className="export-item" onClick={() => handleExport('rot')}>
              <div className="export-item-content">
                <span className="export-label">ROT.js File (.rot.txt)</span>
                <span className="export-description">Special format for the ROT.js roguelike library.</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExportDropdown; 