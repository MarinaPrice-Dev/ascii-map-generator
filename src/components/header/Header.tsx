import React, { useState, useRef } from 'react';
import { UndoIcon, RedoIcon, InfoIcon, ZoomInIcon, ZoomOutIcon, ImportIcon, MenuIcon, BorderIcon } from '../icons/Icons';
import Tooltip from '../ui/Tooltip';
import '../icons/Icons.css';
import './Header.css';
import InfoDialog from './InfoDialog';
import ExportDropdown from './ExportDropdown';
import ImageImportDialog from './ImageImportDialog';
import { MIN_ZOOM, MAX_ZOOM } from '../../utils/zoomUtils';
import { importMap } from '../../utils/importMap';
import { imageToAscii } from '../../utils/imageToAscii';
import { getActualGridDimensions, isGridEmpty } from '../../utils/mapUtils';
import type { Cell } from '../../types/cell';

interface HeaderProps {
  onSaveMap: (format: 'txt' | 'json' | 'ansi' | 'rot' | 'png' | 'html' | 'html-color') => void;
  onClearMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  grid: Cell[][];
  cellSize: number;
  gridRows: number;
  gridCols: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onImportMap: (grid: Cell[][]) => void;
  onImageImport: (grid: Cell[][], imageDimensions?: { width: number; height: number; gridRows: number; gridCols: number }) => void;
  onResizeGrid: (newRows: number, newCols: number) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  isExportPanelOpen: boolean;
  onExportPanelToggle: () => void;
  isImageDialogOpen: boolean;
  onOpenImageDialog: () => void;
  onCloseImageDialog: () => void;
  showBorders: boolean;
  onBorderToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSaveMap,

  onUndo,
  onRedo,
  canUndo,
  canRedo,
  grid = [],
  cellSize,
  gridRows,
  gridCols,
  onZoomIn,
  onZoomOut,
  onImportMap,
  onImageImport,
  onResizeGrid,
  isMenuOpen,
  onMenuToggle,
  isExportPanelOpen,
  onExportPanelToggle,
  isImageDialogOpen,
  onOpenImageDialog,
  onCloseImageDialog,
  showBorders,
  onBorderToggle,
}) => {
  const gridIsEmpty = isGridEmpty(grid);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; gridRows: number; gridCols: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate actual grid dimensions from the grid data
  const actualDimensions = getActualGridDimensions(grid);
  const actualRows = actualDimensions.rows;
  const actualCols = actualDimensions.cols;
  
  // Update input values when grid dimensions change
  React.useEffect(() => {
    // No longer needed since we're not using input fields
  }, [gridRows, gridCols]);

  const handleResizeGrid = (type: 'cols' | 'rows', action: 'increase' | 'decrease') => {
    let newRows = actualRows;
    let newCols = actualCols;
    
    if (type === 'cols') {
      newCols = action === 'increase' ? actualCols + 1 : Math.max(1, actualCols - 1);
    } else {
      newRows = action === 'increase' ? actualRows + 1 : Math.max(1, actualRows - 1);
    }
    
    onResizeGrid(newRows, newCols);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const validateFileType = (file: File): 'txt' | 'json' | 'ansi' | 'rot' | 'image' | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Check for image files first
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'image';
    }
    
    // Check for text-based formats
    if (extension === 'txt') {
      // Check if it's a ROT.js file by looking for color codes
      return file.name.toLowerCase().includes('.rot.txt') ? 'rot' : 'txt';
    }
    if (extension === 'json') return 'json';
    if (extension === 'ansi') return 'ansi';
    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input
    event.target.value = '';

    const format = validateFileType(file);
    if (!format) {
      alert('Please select a .txt, .json, .ansi, .rot.txt, or image file (.png, .jpg, .jpeg, .gif, .bmp, .webp)');
      return;
    }

    if (format === 'image') {
      try {
        const dimensions = await getImageDimensions(file);
        const imageAspectRatio = dimensions.width / dimensions.height;
        const newWidth = 40;
        const newHeight = Math.round(newWidth / imageAspectRatio);

        const result = await imageToAscii(file, {
          targetCols: newWidth * 2,
          targetRows: newHeight,
          colorMode: 'smart',
          invert: true,
        });

        const updatedDimensions = {
          width: dimensions.width,
          height: dimensions.height,
          gridRows: result.dimensions.rows,
          gridCols: result.dimensions.cols,
        };

        onImageImport(result.grid, updatedDimensions);

        // Now show the dialog for adjustments
        setSelectedImageFile(file);
        setImageDimensions(updatedDimensions);
        onOpenImageDialog();
      } catch (error) {
        alert('Failed to load or process image');
        console.error(error);
      }
    } else {
      // For text-based formats, process immediately
    try {
      const result = await importMap(file, { format });
      
        // Validate dimensions for text-based formats
      if (format !== 'rot') {
        const currentRows = grid.length;
        const currentCols = grid[0]?.length || 0;
        
        if (result.dimensions) {
          if (result.dimensions.rows > currentRows || result.dimensions.cols > currentCols) {
            alert(`The imported map is too large. Maximum dimensions are ${currentRows}x${currentCols}`);
            return;
          }
        }
      }
      onImportMap(result.grid);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to import map');
      }
    }
    }
  };

  interface ImageImportOptions {
    targetRows?: number;
    targetCols?: number;
    colorMode?: 'smart' | 'foreground' | 'background';
    contrast?: number;
    brightness?: number;
    saturation?: number;
    hue?: number;
    sepia?: number;
    grayscale?: number;
    characterDensity?: number;
    edgeDetection?: number;
    threshold?: number;
    dithering?: number;
    vignette?: number;
    grain?: number;
    blur?: number;
    sharpen?: number;
    pixelate?: number;
    posterize?: number;
    vibrance?: number;
    temperature?: number;
    exposure?: number;
    highlights?: number;
    shadows?: number;
    whites?: number;
    blacks?: number;
    invert?: boolean;
  }

  const handleImageImport = async (options: ImageImportOptions) => {
    if (!selectedImageFile) return;

    try {
      const result = await imageToAscii(selectedImageFile, {
        targetRows: options.targetRows,
        targetCols: options.targetCols,
        colorMode: options.colorMode,
        contrast: options.contrast,
        brightness: options.brightness,
        saturation: options.saturation,
        hue: options.hue,
        sepia: options.sepia,
        grayscale: options.grayscale,
        characterDensity: options.characterDensity,
        edgeDetection: options.edgeDetection,
        threshold: options.threshold,
        dithering: options.dithering,
        vignette: options.vignette,
        grain: options.grain,
        blur: options.blur,
        sharpen: options.sharpen,
        pixelate: options.pixelate,
        posterize: options.posterize,
        vibrance: options.vibrance,
        temperature: options.temperature,
        exposure: options.exposure,
        highlights: options.highlights,
        shadows: options.shadows,
        whites: options.whites,
        blacks: options.blacks,
        invert: options.invert
      });

      // Update the image dimensions with the actual grid dimensions
      const updatedDimensions = {
        width: imageDimensions?.width || 0,
        height: imageDimensions?.height || 0,
        gridRows: result.dimensions.rows,
        gridCols: result.dimensions.cols
      };

      // Pass the actual grid dimensions from the conversion result
      onImageImport(result.grid, updatedDimensions);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to convert image');
      }
    }
  };

  // Helper function to get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number; gridRows: number; gridCols: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        const dimensions = { width: img.width, height: img.height, gridRows: 0, gridCols: 0 };
        URL.revokeObjectURL(objectUrl);
        resolve(dimensions);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      
      img.src = objectUrl;
    });
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <h1>ASCII Studio</h1>
        <div className="header-actions">
          <div className="desktop-only grid-dimensions">
            <div className="dimension-inputs">
              <Tooltip content="Decrease Columns" placement="bottom">
                <button
                  className="icon-button"
                  onClick={() => handleResizeGrid('cols', 'decrease')}
                  disabled={actualCols <= 1}
                >
                  -
                </button>
              </Tooltip>
              <span className="dimension-separator">{actualCols}</span>
              <Tooltip content="Increase Columns" placement="bottom">
                <button
                  className="icon-button"
                  onClick={() => handleResizeGrid('cols', 'increase')}
                  disabled={actualCols >= 350}
                >
                  +
                </button>
              </Tooltip>
            </div>
            <span className="dimension-separator dimension-multiply">×</span>
            <div className="dimension-inputs">
              <Tooltip content="Decrease Rows" placement="bottom">
                <button
                  className="icon-button"
                  onClick={() => handleResizeGrid('rows', 'decrease')}
                  disabled={actualRows <= 1}
                >
                  -
                </button>
              </Tooltip>
              <span className="dimension-separator">{actualRows}</span>
              <Tooltip content="Increase Rows" placement="bottom">
                <button
                  className="icon-button"
                  onClick={() => handleResizeGrid('rows', 'increase')}
                  disabled={actualRows >= 150}
                >
                  +
                </button>
              </Tooltip>
            </div>
          </div>
          <Tooltip content={showBorders ? "Hide Grid Borders" : "Show Grid Borders"} placement="bottom">
            <button 
              className={`icon-button border-button ${showBorders ? 'active' : ''}`}
              onClick={onBorderToggle}
            >
              <BorderIcon />
            </button>
          </Tooltip>
          <div className="zoom-controls">
            <Tooltip content="Zoom Out" placement="bottom">
              <button 
                className="icon-button zoom-button" 
                onClick={onZoomOut} 
                disabled={cellSize <= MIN_ZOOM} 
              >
                <ZoomOutIcon />
              </button>
            </Tooltip>
            <span className="zoom-level">{cellSize}px</span>
            <Tooltip content="Zoom In" placement="bottom">
              <button 
                className="icon-button zoom-button" 
                onClick={onZoomIn} 
                disabled={cellSize >= MAX_ZOOM} 
              >
                <ZoomInIcon />
              </button>
            </Tooltip>
          </div>
          <button className="icon-button" onClick={onUndo} disabled={!canUndo}>
            <UndoIcon />
          </button>
          <button className="icon-button" onClick={onRedo} disabled={!canRedo}>
            <RedoIcon />
          </button>
          <div className="desktop-only">
            <ExportDropdown
              onExport={onSaveMap}
              disabled={gridIsEmpty}
              isOpen={isExportPanelOpen}
              onToggle={onExportPanelToggle}
            />
          </div>
          <div className="desktop-only">
            <button className={`icon-button import-button ${isImageDialogOpen ? 'open' : ''}`} onClick={handleImportClick}>
              <ImportIcon />
              <span className="button-label">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json,.ansi,.png,.jpg,.jpeg,.gif,.bmp,.webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <button 
            className="icon-button info-button" 
            onClick={() => setShowInfoDialog(true)} 
          >
            <InfoIcon />
          </button>
          <button 
            className={`icon-button menu-button ${isMenuOpen ? 'active' : ''}`}
            onClick={onMenuToggle} 
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      {/* Toolbar for mobile/tablet */}
      <div className="toolbar-actions">
        <Tooltip content={showBorders ? "Hide Grid Borders" : "Show Grid Borders"} placement="top">
          <button 
            className={`icon-button border-button ${showBorders ? 'active' : ''}`}
            onClick={onBorderToggle}
          >
            <BorderIcon />
          </button>
        </Tooltip>
        <div className="zoom-controls">
            <Tooltip content="Zoom Out" placement="top">
              <button 
                className="icon-button zoom-button" 
                onClick={onZoomOut} 
                disabled={cellSize <= MIN_ZOOM} 
              >
                <ZoomOutIcon />
              </button>
            </Tooltip>
            <span className="zoom-level">{cellSize}px</span>
            <Tooltip content="Zoom In" placement="top">
              <button 
                className="icon-button zoom-button" 
                onClick={onZoomIn} 
                disabled={cellSize >= MAX_ZOOM} 
              >
                <ZoomInIcon />
              </button>
            </Tooltip>
          </div>
        <button className="icon-button" onClick={onUndo} disabled={!canUndo}>
          <UndoIcon />
        </button>
        <button className="icon-button" onClick={onRedo} disabled={!canRedo}>
          <RedoIcon />
        </button>
        <ExportDropdown
              onExport={onSaveMap}
              disabled={gridIsEmpty}
              isOpen={isExportPanelOpen}
              onToggle={onExportPanelToggle}
            />
        <button className={`icon-button import-button ${isImageDialogOpen ? 'open' : ''}`} onClick={handleImportClick}>
          <ImportIcon />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json,.ansi,.png,.jpg,.jpeg,.gif,.bmp,.webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button 
          className="icon-button info-button" 
          onClick={() => setShowInfoDialog(true)} 
        >
          <InfoIcon />
        </button>
        <button 
          className={`icon-button menu-button ${isMenuOpen ? 'active' : ''}`}
          onClick={onMenuToggle} 
        >
          <MenuIcon />
        </button>
      </div>
      
      {/* Dialogs */}
      {showInfoDialog && (
        <InfoDialog onClose={() => setShowInfoDialog(false)} />
      )}
      
      <ImageImportDialog
        isOpen={isImageDialogOpen}
        onClose={onCloseImageDialog}
        onImport={handleImageImport}
        fileName={selectedImageFile?.name || ''}
        imageDimensions={imageDimensions || undefined}
      />
    </>
  );
};

export default Header; 