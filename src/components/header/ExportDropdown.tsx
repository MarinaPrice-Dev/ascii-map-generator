import React, { useState, useRef, useEffect } from 'react';
import { SaveIcon } from '../icons/Icons';
import './ExportDropdown.css';

interface ExportDropdownProps {
  onExport: (format: 'txt' | 'json') => void;
  disabled: boolean;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport, disabled }) => {
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

  const handleExport = (format: 'txt' | 'json') => {
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
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">Export Format</div>
          <button onClick={() => handleExport('txt')} className="dropdown-item">
            .txt (colours not included)
          </button>
          <button onClick={() => handleExport('json')} className="dropdown-item">
            .json
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown; 