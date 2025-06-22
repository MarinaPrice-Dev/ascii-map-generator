import React, { useState, useEffect } from 'react';
import './ImageImportDialog.css';

interface ImageImportOptions {
  colorMode: 'smart' | 'foreground' | 'background';
  contrast: number;
  brightness: number;
  saturation: number;
  hue: number;
  sepia: number;
  grayscale: number;
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
    saturation: 0,
    hue: 0,
    sepia: 0,
    grayscale: 0,
    invert: true,
    targetRows: 50,
    targetCols: 100
  });

  const handleOptionChange = (key: keyof ImageImportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleInputBlur = (key: 'targetCols' | 'targetRows', value: number) => {
    let constrainedValue = value;
    
    // Handle invalid or empty values
    if (isNaN(value) || value <= 0) {
      constrainedValue = 20;
    } else if (value > 200) {
      constrainedValue = 200;
    } else if (value < 20) {
      constrainedValue = 20;
    }
    
    if (constrainedValue !== value) {
      setOptions(prev => ({ ...prev, [key]: constrainedValue }));
    }
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
    // Removed onClose() to keep dialog open for further adjustments
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
    <div className={`image-import-panel ${isOpen ? 'open' : ''}`}>
      <div className="image-import-navigation">
        <h3>{fileName}</h3>
        <button className="close-button" onClick={onClose} title="Close">×</button>
      </div>

      <div className="image-import-content">
      {imageDimensions && (
        <div className="image-info">
          <p>Image size: {imageDimensions.width} × {imageDimensions.height} pixels</p>
          <p>Grid size: {options.targetCols} × {options.targetRows} characters</p>
        </div>
      )}
        <div className="option-group">
          <div className="color-mode-header">
            <label>Color Mode:</label>
            <select 
              value={options.colorMode} 
              onChange={(e) => handleOptionChange('colorMode', e.target.value)}
            >
              <option value="smart">Smart Mode</option>
              <option value="foreground">Symbols only</option>
              <option value="background">Background only</option>
            </select>
          </div>
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
          <div className="resolution-header">
            <label>Resolution:</label>
            <div className="resolution-inputs">
              <input
                type="number"
                value={options.targetCols || ''}
                onChange={(e) => handleOptionChange('targetCols', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                min="20"
                max="200"
                placeholder="Width"
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur('targetCols', parseInt(e.target.value) || 0)}
              />
              <span>×</span>
              <input
                type="number"
                value={options.targetRows || ''}
                onChange={(e) => handleOptionChange('targetRows', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                min="20"
                max="200"
                placeholder="Height"
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur('targetRows', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <button 
            type="button" 
            className="auto-calculate-button" 
            onClick={autoCalculateDimensions}
            disabled={!imageDimensions}
            title="Change the aspect ratio based on new input"
          >
            Re-calculate aspect ratio
          </button>
        </div>

        <div className="option-group">
          <label>Adjustments:</label>
        </div>

        <div className="option-group">
          <div className="range-header">
            <label>Contrast: {options.contrast}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.contrast}
              onChange={(e) => handleOptionChange('contrast', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="option-group">
          <div className="range-header">
            <label>Brightness: {options.brightness}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.brightness}
              onChange={(e) => handleOptionChange('brightness', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="option-group">
          <div className="range-header">
            <label>Saturation: {options.saturation}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.saturation}
              onChange={(e) => handleOptionChange('saturation', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="option-group">
          <div className="range-header">
            <label>Hue: {options.hue}</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={options.hue}
              onChange={(e) => handleOptionChange('hue', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="option-group">
          <div className="range-header">
            <label>Sepia: {options.sepia}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.sepia}
              onChange={(e) => handleOptionChange('sepia', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="option-group">
          <div className="range-header">
            <label>Grayscale: {options.grayscale}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={options.grayscale}
              onChange={(e) => handleOptionChange('grayscale', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={options.invert}
              onChange={(e) => handleOptionChange('invert', e.target.checked)}
            />
            Change ascii characters
          </label>
        </div>
      </div>

      <div className="image-import-footer">
        <button className="cancel-button" onClick={onClose}>Close</button>
        <button className="image-import-button" onClick={handleImport}>Apply</button>
      </div>
    </div>
  );
};

export default ImageImportDialog; 