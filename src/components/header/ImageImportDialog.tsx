import React, { useState } from 'react';
import './ImageImportDialog.css';

interface ImageImportOptions {
  colorMode: 'smart' | 'foreground' | 'background';
  contrast: number;
  brightness: number;
  invert: boolean;
  targetRows: number;
  targetCols: number;
}

interface ImageImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (options: ImageImportOptions) => void;
  fileName: string;
  imageDimensions?: { width: number; height: number };
}

const ImageImportDialog: React.FC<ImageImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  fileName,
  imageDimensions
}) => {
  const [options, setOptions] = useState<ImageImportOptions>({
    colorMode: 'smart',
    contrast: 0,
    brightness: 0,
    invert: false,
    targetRows: 100,
    targetCols: 100
  });

  const handleOptionChange = (key: keyof ImageImportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleImport = () => {
    onImport(options);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="image-import-overlay">
      <div className="image-import-dialog">
        <div className="dialog-header">
          <h3>Import Image: {fileName}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        {imageDimensions && (
          <div className="image-info">
            <p>Image size: {imageDimensions.width} × {imageDimensions.height} pixels</p>
            <p>Grid size: {options.targetRows} × {options.targetCols} characters</p>
          </div>
        )}

        <div className="dialog-content">
          <div className="option-group">
            <label>Color Mode:</label>
            <select 
              value={options.colorMode} 
              onChange={(e) => handleOptionChange('colorMode', e.target.value)}
            >
              <option value="smart">Smart Both (for optimal results)</option>
              <option value="foreground">Foreground only</option>
              <option value="background">Background only</option>
            </select>
            <div className="option-description">
              {options.colorMode === 'foreground' && (
                <small>Uses image colors as foreground with default background</small>
              )}
              {options.colorMode === 'smart' && (
                <small>Intelligently uses both foreground and background colors for optimal results</small>
              )}
              {options.colorMode === 'background' && (
                <small>Uses image colors as background with default foreground</small>
              )}
            </div>
          </div>

          <div className="option-group">
            <label>Target Resolution:</label>
            <div className="resolution-inputs">
              <input
                type="number"
                value={options.targetRows}
                onChange={(e) => handleOptionChange('targetRows', parseInt(e.target.value) || 50)}
                min="20"
                max="200"
                placeholder="Rows"
              />
              <span>×</span>
              <input
                type="number"
                value={options.targetCols}
                onChange={(e) => handleOptionChange('targetCols', parseInt(e.target.value) || 50)}
                min="20"
                max="200"
                placeholder="Columns"
              />
            </div>
          </div>

          <div className="option-group">
            <label>Contrast: {options.contrast}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.contrast}
              onChange={(e) => handleOptionChange('contrast', parseInt(e.target.value))}
            />
          </div>

          <div className="option-group">
            <label>Brightness: {options.brightness}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.brightness}
              onChange={(e) => handleOptionChange('brightness', parseInt(e.target.value))}
            />
          </div>

          <div className="option-group">
            <label>
              <input
                type="checkbox"
                checked={options.invert}
                onChange={(e) => handleOptionChange('invert', e.target.checked)}
              />
              Invert Colors
            </label>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="import-button" onClick={handleImport}>Import Image</button>
        </div>
      </div>
    </div>
  );
};

export default ImageImportDialog; 