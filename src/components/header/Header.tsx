import React, { useState, useRef, useEffect } from 'react';
import { UndoIcon, RedoIcon, ClearIcon, InfoIcon, ZoomInIcon, ZoomOutIcon, ImportIcon, MenuIcon } from '../icons/Icons';
import '../icons/Icons.css';
import './Header.css';
import InfoDialog from './InfoDialog';
import ExportDropdown from './ExportDropdown';
import ImageImportDialog from './ImageImportDialog';
import { MIN_ZOOM, MAX_ZOOM } from '../../utils/zoomUtils';
import { importMap } from '../../utils/importMap';
import { imageToAscii } from '../../utils/imageToAscii';
import type { Cell } from '../../types/cell';

interface HeaderProps {
  onSaveMap: (format: 'txt' | 'json' | 'ansi' | 'rot') => void;
  onClearMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  grid: Array<Array<{ char: string }>>;
  cellSize: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onImportMap: (grid: Cell[][]) => void;
  onImageImport: (grid: Cell[][], imageDimensions?: { width: number; height: number; gridRows: number; gridCols: number }) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  isExportPanelOpen: boolean;
  onExportPanelToggle: () => void;
  isImageDialogOpen: boolean;
  onImageDialogStateChange: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  onSaveMap,
  onClearMap,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  grid = [],
  cellSize,
  onZoomIn,
  onZoomOut,
  onImportMap,
  onImageImport,
  isMenuOpen,
  onMenuToggle,
  isExportPanelOpen,
  onExportPanelToggle,
  isImageDialogOpen,
  onImageDialogStateChange,
}) => {
  const isGridEmpty = grid.every(row => row.every(cell => cell.char === ' '));
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; gridRows: number; gridCols: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update parent component when image dialog state changes
  useEffect(() => {
    onImageDialogStateChange(showImageDialog);
  }, [showImageDialog, onImageDialogStateChange]);

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
      // For image files, show the import dialog
      try {
        const dimensions = await getImageDimensions(file);
        setSelectedImageFile(file);
        setImageDimensions(dimensions);
        setShowImageDialog(true);
      } catch (error) {
        alert('Failed to load image');
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

  const handleImageImport = async (options: any) => {
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
          <div className="zoom-controls">
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomOut} 
              disabled={cellSize <= MIN_ZOOM} 
              title="Zoom Out"
            >
              <ZoomOutIcon />
            </button>
            <span className="zoom-level">{cellSize}px</span>
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomIn} 
              disabled={cellSize >= MAX_ZOOM} 
              title="Zoom In"
            >
              <ZoomInIcon />
            </button>
          </div>
          <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
            <UndoIcon />
          </button>
          <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
            <RedoIcon />
          </button>
          <button className="icon-button clear-button" onClick={onClearMap} disabled={isGridEmpty} title="Clear Map">
            <ClearIcon />
          </button>
          <div className="desktop-only">
            <ExportDropdown
              onExport={onSaveMap}
              disabled={isGridEmpty}
              isOpen={isExportPanelOpen}
              onToggle={onExportPanelToggle}
            />
          </div>
          <div className="desktop-only">
            <button className={`icon-button import-button ${showImageDialog ? 'open' : ''}`} onClick={handleImportClick} title="Import Map">
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
            title="More Information"
          >
            <InfoIcon />
          </button>
          <button 
            className={`icon-button menu-button ${isMenuOpen ? 'active' : ''}`}
            onClick={onMenuToggle} 
            title="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      {/* Toolbar for mobile/tablet */}
      <div className="toolbar-actions">
        <div className="zoom-controls">
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomOut} 
              disabled={cellSize <= MIN_ZOOM} 
              title="Zoom Out"
            >
              <ZoomOutIcon />
            </button>
            <span className="zoom-level">{cellSize}px</span>
            <button 
              className="icon-button zoom-button" 
              onClick={onZoomIn} 
              disabled={cellSize >= MAX_ZOOM} 
              title="Zoom In"
            >
              <ZoomInIcon />
            </button>
          </div>
        <button className="icon-button" onClick={onUndo} disabled={!canUndo} title="Undo">
          <UndoIcon />
        </button>
        <button className="icon-button" onClick={onRedo} disabled={!canRedo} title="Redo">
          <RedoIcon />
        </button>
        <button className="icon-button clear-button" onClick={onClearMap} disabled={isGridEmpty} title="Clear Map">
          <ClearIcon />
        </button>
        <button className={`icon-button import-button ${showImageDialog ? 'open' : ''}`} onClick={handleImportClick} title="Import Map">
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
          title="More Information"
        >
          <InfoIcon />
        </button>
        <button 
          className={`icon-button menu-button ${isMenuOpen ? 'active' : ''}`}
          onClick={onMenuToggle} 
          title="Menu"
        >
          <MenuIcon />
        </button>
      </div>
      
      {/* Dialogs */}
      {showInfoDialog && (
        <InfoDialog onClose={() => setShowInfoDialog(false)} />
      )}
      
      <ImageImportDialog
        isOpen={showImageDialog}
        onClose={() => {
          setShowImageDialog(false);
          setSelectedImageFile(null);
          setImageDimensions(null);
        }}
        onImport={handleImageImport}
        fileName={selectedImageFile?.name || ''}
        imageDimensions={imageDimensions || undefined}
      />
    </>
  );
};

export default Header; 