import React from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import type { SelectionTool as Tool, SelectionMode } from '../../store/selectionStore';
import { 
  PencilIcon, SingleBoxIcon, MultipleBoxIcon, 
  AreaIcon, RectangleIcon, CellsIcon,
  RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon
} from '../icons/Icons';
import './SelectionTool.css';

interface SelectionToolProps {
  onRotate: (direction: 'left' | 'right') => void;
  onMirror: (direction: 'horizontal' | 'vertical') => void;
}

const SelectionTool: React.FC<SelectionToolProps> = ({ onRotate, onMirror }) => {
  const {
    activeTool,
    selectionMode,
    setActiveTool,
    setSelectionMode,
    clearSelection,
    getSelectedCellsCount
  } = useSelectionStore();

  const selectedCount = getSelectedCellsCount();





  return (
    <div className="selection-tool">
      {selectedCount > 0 && (
        <div className="selection-tool-section">
          <div className="clear-selection-section">
            <button 
              className="clear-selection-btn"
              onClick={clearSelection}
              title="Clear all selections"
            >
              Clear All Selections
            </button>
          </div>
        </div>
      )}

    <div className="selection-tool-section">
        <h4>Mode</h4>
        <div className="mode-options">
          <label className="mode-option">
            <input
              type="radio"
              name="selectionMode"
              value="draw"
              checked={selectionMode === 'draw'}
              onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
              className="sr-only"
            />
            <div className="mode-icon"><PencilIcon /></div>
            <div className="mode-option-content">
              <span className="mode-label">Draw</span>
              <span className="mode-description">Draw using symbols and colors</span>
            </div>
          </label>
          
          <label className="mode-option">
            <input
              type="radio"
              name="selectionMode"
              value="single"
              checked={selectionMode === 'single'}
              onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
              className="sr-only"
            />
            <div className="mode-icon"><SingleBoxIcon /></div>
            <div className="mode-option-content">
              <span className="mode-label">Select</span>
              <span className="mode-description">Select an area to manipulate</span>
            </div>
          </label>
          
          <label className="mode-option">
            <input
              type="radio"
              name="selectionMode"
              value="multiple"
              checked={selectionMode === 'multiple'}
              onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
              className="sr-only"
            />
            <div className="mode-icon"><MultipleBoxIcon /></div>
            <div className="mode-option-content">
              <span className="mode-label">Multi-Select</span>
              <span className="mode-description">Select multiple areas to manipulate</span>
            </div>
          </label>
        </div>
      </div>

      <div className="selection-tool-section">
        <h4>Shape</h4>
        <div className="tool-options">
          <label className="tool-option">
            <input
              type="radio"
              name="selectionTool"
              value="select-area"
              checked={activeTool === 'select-area'}
              onChange={(e) => setActiveTool(e.target.value as Tool)}
              className="sr-only"
            />
            <div className="tool-icon"><AreaIcon /></div>
            <div className="tool-option-content">
              <span className="tool-label">Area</span>
              <span className="tool-description">Drag for a rectangular area</span>
            </div>
          </label>
          
          <label className="tool-option">
            <input
              type="radio"
              name="selectionTool"
              value="select-rectangle"
              checked={activeTool === 'select-rectangle'}
              onChange={(e) => setActiveTool(e.target.value as Tool)}
              className="sr-only"
            />
            <div className="tool-icon"><RectangleIcon /></div>
            <div className="tool-option-content">
              <span className="tool-label">Rectangle</span>
              <span className="tool-description">Drag for a rectangle</span>
            </div>
          </label>
          
          <label className="tool-option">
            <input
              type="radio"
              name="selectionTool"
              value="select-cells"
              checked={activeTool === 'select-cells'}
              onChange={(e) => setActiveTool(e.target.value as Tool)}
              className="sr-only"
            />
            <div className="tool-icon"><CellsIcon /></div>
            <div className="tool-option-content">
              <span className="tool-label">Pen</span>
              <span className="tool-description">Drag across individual cells</span>
            </div>
          </label>
        </div>
      </div>

      <div className="selection-tool-section">
        <h4>Transform</h4>
        <div className="transform-options">
          <button onClick={() => onRotate('left')} title="Rotate Left" className="transform-button">
            <RotateLeftIcon />
          </button>
          <button onClick={() => onRotate('right')} title="Rotate Right" className="transform-button">
            <RotateRightIcon />
          </button>
          <button onClick={() => onMirror('horizontal')} title="Flip Horizontal" className="transform-button">
            <FlipHorizontalIcon />
          </button>
          <button onClick={() => onMirror('vertical')} title="Flip Vertical" className="transform-button">
            <FlipVerticalIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionTool; 