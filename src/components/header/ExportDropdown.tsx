import React from 'react';
import { SaveIcon } from '../icons/Icons';
import './ExportDropdown.css';

interface ExportDropdownProps {
  onExport: (format: 'txt' | 'json' | 'ansi' | 'rot') => void;
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
  const handleExport = (format: 'txt' | 'json' | 'ansi' | 'rot') => {
    onExport(format);
    // The panel is now closed by the App component
  };

  return (
    <div className="export-dropdown">
      <button 
        className={`icon-button save-button ${isOpen ? 'dropdown-open' : ''}`}
        onClick={onToggle}
        disabled={disabled}
        title="Export Map"
      >
        <SaveIcon />
        <span className="button-label">Export</span>
      </button>
      
      <div className={`export-panel ${isOpen ? 'open' : ''}`}>
        <div className="export-panel-header">
          <span>Export Formats</span>
          <button className="export-panel-close" onClick={onToggle}>×</button>
        </div>
        <div className="export-panel-content">
          <div className="export-item" onClick={() => handleExport('txt')}>
            <div className="export-item-content">
              <span className="export-label">Text File (.txt)</span>
              <span className="export-description">Plain text, no colors. Best for sharing.</span>
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
      </div>
    </div>
  );
};

export default ExportDropdown; 