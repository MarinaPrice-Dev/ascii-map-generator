import React, { useState, useEffect } from 'react';
import { AspectIcon } from '../icons/Icons';
import ImageRangeSlider from './ImageRangeSlider';
import './ImageImportDialog.css';

interface ImageImportOptions {
  colorMode: 'smart' | 'foreground' | 'background';
  contrast: number;
  brightness: number;
  saturation: number;
  hue: number;
  sepia: number;
  grayscale: number;
  characterDensity: number;
  edgeDetection: number;
  threshold: number;
  dithering: number;
  vignette: number;
  grain: number;
  blur: number;
  sharpen: number;
  pixelate: number;
  posterize: number;
  vibrance: number;
  temperature: number;
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  invert: boolean;
  targetRows: number;
  targetCols: number;
}

interface ImageImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (options: ImageImportOptions) => void;
  fileName: string;
  imageDimensions?: { width: number; height: number; gridRows: number; gridCols: number };
}

const defaultOptions: ImageImportOptions = {
  colorMode: 'smart',
  contrast: 0,
  brightness: 0,
  saturation: 0,
  hue: 0,
  sepia: 0,
  grayscale: 0,
  characterDensity: 0,
  edgeDetection: 0,
  threshold: 0,
  dithering: 0,
  vignette: 0,
  grain: 0,
  blur: 0,
  sharpen: 0,
  pixelate: 0,
  posterize: 0,
  vibrance: 0,
  temperature: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  invert: true,
  targetRows: 50,
  targetCols: 100
};

const ImageImportDialog: React.FC<ImageImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  fileName,
  imageDimensions
}) => {
  const [options, setOptions] = useState<ImageImportOptions>(defaultOptions);

  const handleOptionChange = (key: keyof ImageImportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
    
    // Auto-apply for color mode and adjustments (except range inputs)
    if (key !== 'targetCols' && key !== 'targetRows') {
      // For range inputs, we'll handle them separately with onMouseUp
      if (key !== 'contrast' && key !== 'brightness' && key !== 'saturation' && key !== 'hue' && key !== 'sepia' && key !== 'grayscale') {
        // Auto-apply for non-range inputs (color mode, invert)
        setTimeout(() => onImport({ ...options, [key]: value }), 0);
      }
    }
  };

  const handleRangeChange = (key: keyof ImageImportOptions, value: number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleRangeMouseUp = () => {
    // Apply changes when user releases the range slider
    onImport(options);
  };

  const handleResetRanges = () => {
    const resetOptions: ImageImportOptions = {
      ...options,
      ...defaultOptions
    };
    
    // Keep the current dimensions
    resetOptions.targetCols = options.targetCols;
    resetOptions.targetRows = options.targetRows;
    
    setOptions(resetOptions);
    onImport(resetOptions);
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

    const newOptions = {
      ...options,
      targetCols: newWidth,
      targetRows: newHeight,
    };
    
    setOptions(newOptions);
    onImport(newOptions);
  };

  const handleImport = () => {
    let finalOptions = { ...options };
    
    // Auto-calculate dimensions if any inputs are empty
    if (options.targetCols <= 0 || options.targetRows <= 0) {
      if (imageDimensions) {
        const imageAspectRatio = imageDimensions.width / imageDimensions.height;
        const newWidth = 100;
        const newHeight = Math.round(newWidth / imageAspectRatio);

        finalOptions = {
          ...options,
          targetCols: Math.max(20, Math.min(200, newWidth)),
          targetRows: Math.max(20, Math.min(200, newHeight)),
        };
      }
    }
    
    onImport(finalOptions);
    // Removed onClose() to keep dialog open for further adjustments
  };

  useEffect(() => {
    if (isOpen && imageDimensions) {
      // Reset all options to default, then set dimensions from the initial import
      setOptions({
        ...defaultOptions,
        targetCols: imageDimensions.gridCols,
        targetRows: imageDimensions.gridRows,
      });
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
        </div>
      )}

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
            <button 
              type="button" 
              className="auto-calculate-button" 
              onClick={autoCalculateDimensions}
              disabled={!imageDimensions}
              title="Change the aspect ratio based on new input"
            >
              <AspectIcon />
            </button>
          </div>
        </div>
        <div className="line"></div>
        
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

        <div className="option-group" style={{ display: 'none' }}>
          <label>
            <input
              type="checkbox"
              checked={options.invert}
              onChange={(e) => handleOptionChange('invert', e.target.checked)}
            />
            Change ascii characters
          </label>
        </div>

        <div className="line"></div>
        <div className="option-group">
          <div className="adjustments-header">
            <label>Adjustments:</label>
            <button 
              type="button" 
              className="reset-ranges-button" 
              onClick={handleResetRanges}
              title="Reset all adjustments to 0"
            >
              Reset
            </button>
          </div>
        </div>

        <ImageRangeSlider
          label="Brightness"
          value={options.brightness}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('brightness', value)}
          onApply={() => handleRangeMouseUp()}
        />
        
        <ImageRangeSlider
          label="Contrast"
          value={options.contrast}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('contrast', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Exposure"
          value={options.exposure}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('exposure', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Highlights"
          value={options.highlights}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('highlights', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Shadows"
          value={options.shadows}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('shadows', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Whites"
          value={options.whites}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('whites', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Blacks"
          value={options.blacks}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('blacks', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <div className="line"></div>
        <div className="option-group">
          <div className="adjustments-header">
            <label>Color & Tone:</label>
          </div>
        </div>

        <ImageRangeSlider
          label="Saturation"
          value={options.saturation}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('saturation', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Vibrance"
          value={options.vibrance}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('vibrance', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Temperature"
          value={options.temperature}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('temperature', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Hue"
          value={options.hue}
          min={-180}
          max={180}
          onChange={(value) => handleRangeChange('hue', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Sepia"
          value={options.sepia}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('sepia', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Grayscale"
          value={options.grayscale}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('grayscale', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <div className="line"></div>
        <div className="option-group">
          <div className="adjustments-header">
            <label>Effects:</label>
          </div>
        </div>

        <ImageRangeSlider
          label="Sharpen"
          value={options.sharpen}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('sharpen', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Blur"
          value={options.blur}
          min={0}
          max={50}
          onChange={(value) => handleRangeChange('blur', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Vignette"
          value={options.vignette}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('vignette', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Grain"
          value={options.grain}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('grain', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Pixelate"
          value={options.pixelate}
          min={0}
          max={50}
          onChange={(value) => handleRangeChange('pixelate', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Posterize"
          value={options.posterize}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('posterize', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <div className="line"></div>
        <div className="option-group">
          <div className="adjustments-header">
            <label>ASCII Conversion:</label>
          </div>
        </div>

        <ImageRangeSlider
          label="Character Density"
          value={options.characterDensity}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('characterDensity', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Edge Detection"
          value={options.edgeDetection}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('edgeDetection', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Threshold"
          value={options.threshold}
          min={-100}
          max={100}
          onChange={(value) => handleRangeChange('threshold', value)}
          onApply={() => handleRangeMouseUp()}
        />

        <ImageRangeSlider
          label="Dithering"
          value={options.dithering}
          min={0}
          max={100}
          onChange={(value) => handleRangeChange('dithering', value)}
          onApply={() => handleRangeMouseUp()}
        />
      </div>

      <div className="image-import-footer">
        <button className="cancel-button" onClick={onClose}>Close</button>
        <button className="image-import-button" onClick={handleImport}>Apply</button>
      </div>
    </div>
  );
};

export default ImageImportDialog; 