import React, { useState, useEffect } from 'react';
import { AspectIcon } from '../icons/Icons';
import ImageRangeSlider from './ImageRangeSlider';
import Tooltip from '../ui/Tooltip';
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
  targetCols: 80
};

const ImageImportDialog: React.FC<ImageImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  fileName,
  imageDimensions
}) => {
  const [options, setOptions] = useState<ImageImportOptions>(defaultOptions);

  const handleOptionChange = (key: keyof ImageImportOptions, value: string | number | boolean) => {
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
      constrainedValue = key === 'targetCols' ? 40 : 20;
    } else if (value > (key === 'targetCols' ? 400 : 200)) {
      constrainedValue = key === 'targetCols' ? 400 : 200;
    } else if (value < (key === 'targetCols' ? 40 : 20)) {
      constrainedValue = key === 'targetCols' ? 40 : 20;
    }
    
    // Note: targetCols represents actual grid width (not doubled in Header.tsx)
    if (constrainedValue !== value) {
      setOptions(prev => ({ ...prev, [key]: constrainedValue }));
    }
  };

  const autoCalculateDimensions = () => {
    if (!imageDimensions) return;

    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    let newGridWidth: number;
    let newHeight: number;

    if (options.targetCols > 0 && options.targetRows > 0) {
      // Both filled in - recalculate height based on grid width
      // Since cell width is half cell height, we need to adjust the aspect ratio calculation
      newGridWidth = options.targetCols;
      // Visual width = gridWidth * 0.5, so we need to account for this in the aspect ratio
      newHeight = Math.round((newGridWidth * 0.5) / imageAspectRatio);
    } else if (options.targetCols > 0) {
      // Only width filled in - calculate height based on grid width
      newGridWidth = options.targetCols;
      // Visual width = gridWidth * 0.5, so we need to account for this in the aspect ratio
      newHeight = Math.round((newGridWidth * 0.5) / imageAspectRatio);
    } else if (options.targetRows > 0) {
      // Only height filled in - calculate grid width
      newHeight = options.targetRows;
      // Visual width = gridWidth * 0.5, so gridWidth = visualWidth * 2
      // visualWidth = height * imageAspectRatio
      newGridWidth = Math.round(newHeight * imageAspectRatio * 2);
    } else {
      // Both empty - set grid width to 80 and calculate height
      newGridWidth = 80;
      // Visual width = 80 * 0.5 = 40, so height = 40 / imageAspectRatio
      newHeight = Math.round((newGridWidth * 0.5) / imageAspectRatio);
    }

    // Ensure minimum dimensions (constraints apply to grid width)
    newGridWidth = Math.max(40, Math.min(400, newGridWidth));
    newHeight = Math.max(20, Math.min(200, newHeight));

    const newOptions = {
      ...options,
      targetCols: newGridWidth, // Store actual grid width in options
      targetRows: newHeight,
    };
    
    setOptions(newOptions);
    onImport(newOptions); // This will be doubled in Header.tsx, so we need to halve it here
  };

  useEffect(() => {
    if (isOpen && imageDimensions) {
      // Reset all options to default, then set dimensions from the initial import
      // Display actual grid dimensions to the user
      setOptions({
        ...defaultOptions,
        targetCols: imageDimensions.gridCols, // Show actual grid width
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
            <label>Grid size:</label>
            <div className="resolution-inputs">
              <input
                type="number"
                value={options.targetCols || ''}
                onChange={(e) => handleOptionChange('targetCols', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                min="40"
                max="400"
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
            <Tooltip content="Auto-calculate dimensions to maintain image aspect ratio" placement="top">
              <button 
                type="button" 
                className="auto-calculate-button" 
                onClick={autoCalculateDimensions}
                disabled={!imageDimensions}
              >
                <AspectIcon />
              </button>
            </Tooltip>
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
        <button 
          type="button" 
          className="reset-ranges-button" 
          onClick={handleResetRanges}>
          Reset
        </button>
        <div className="footer-spacer"></div>
        <button className="cancel-button" onClick={onClose}>Finish</button>
      </div>
    </div>
  );
};

export default ImageImportDialog; 