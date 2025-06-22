import React, { useState, useEffect } from 'react';
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
    invert: true,
    targetRows: 50,
    targetCols: 100
  });

  const handleOptionChange = (key: keyof ImageImportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const autoCalculateDimensions = () => {
    if (!imageDimensions) return;

    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    let newWidth: number;
    let newHeight: number;

    if (options.targetCols > 0 && options.targetRows > 0) {
      // Both filled in - recalculate height based on width
      newWidth = options.targetCols;
      newHeight = Math.round(newWidth / imageAspectRatio);
    } else if (options.targetCols > 0) {
      // Only width filled in - calculate height
      newWidth = options.targetCols;
      newHeight = Math.round(newWidth / imageAspectRatio);
    } else if (options.targetRows > 0) {
      // Only height filled in - calculate width
      newHeight = options.targetRows;
      newWidth = Math.round(newHeight * imageAspectRatio);
    } else {
      // Both empty - set width to 100 and calculate height
      newWidth = 100;
      newHeight = Math.round(newWidth / imageAspectRatio);
    }

    // Ensure minimum dimensions
    newWidth = Math.max(20, Math.min(200, newWidth));
    newHeight = Math.max(20, Math.min(200, newHeight));

    setOptions(prev => ({
      ...prev,
      targetCols: newWidth,
      targetRows: newHeight
    }));
  };

  const handleImport = () => {
    // Auto-calculate dimensions if any inputs are empty
    if (options.targetCols <= 0 || options.targetRows <= 0) {
      autoCalculateDimensions();
    }
    
    onImport(options);
    onClose();
  };

  useEffect(() => {
    if (isOpen && imageDimensions) {
      // Auto-calculate on dialog open with image
      const imageAspectRatio = imageDimensions.width / imageDimensions.height;
      const newWidth = 100;
      const newHeight = Math.round(newWidth / imageAspectRatio);
      
      // Ensure minimum dimensions
      const finalWidth = Math.max(20, Math.min(200, newWidth));
      const finalHeight = Math.max(20, Math.min(200, newHeight));
      
      setOptions(prev => ({
        ...prev,
        targetCols: finalWidth,
        targetRows: finalHeight
      }));
    }
  }, [isOpen, imageDimensions]);

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
            <p>Grid size: {options.targetCols} × {options.targetRows} characters</p>
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
                value={options.targetCols || ''}
                onChange={(e) => handleOptionChange('targetCols', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                min="20"
                max="200"
                placeholder="Width"
              />
              <span>×</span>
              <input
                type="number"
                value={options.targetRows || ''}
                onChange={(e) => handleOptionChange('targetRows', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                min="20"
                max="200"
                placeholder="Height"
              />
            </div>
            <button 
              type="button" 
              className="auto-calculate-button" 
              onClick={autoCalculateDimensions}
              disabled={!imageDimensions}
            >
              Auto-calculate
            </button>
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
              Better contrast
            </label>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="image-import-button" onClick={handleImport}>Import Image</button>
        </div>
      </div>
    </div>
  );
};

export default ImageImportDialog; 