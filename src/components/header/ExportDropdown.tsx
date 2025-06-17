import React, { useState, useRef, useEffect } from 'react';
import { SaveIcon } from '../icons/Icons';
import './ExportDropdown.css';

interface ExportDropdownProps {
  onExport: (format: 'txt' | 'json' | 'ansi' | 'rot') => void;
  onClose: () => void;
  disabled?: boolean;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'txt' | 'json' | 'ansi' | 'rot') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="export-dropdown" ref={dropdownRef}>
      <button 
        className={`icon-button save-button ${isOpen ? 'dropdown-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        title="Export Map"
      >
        <SaveIcon />
        <span className="button-label">Export</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">Export Formats</div>
          <button className="dropdown-item" onClick={() => handleExport('txt')}>Text File (.txt)
            <span className="button-description"> - no colours</span>
          </button>
          <button className="dropdown-item" onClick={() => handleExport('json')}>JSON File (.json)</button>
          <button className="dropdown-item" onClick={() => handleExport('ansi')}>ANSI File (.ansi)</button>
          <button className="dropdown-item" onClick={() => handleExport('rot')}>ROT.js File (.rot.txt)</button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown; 