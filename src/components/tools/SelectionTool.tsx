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
    getSelectedCellsCount,
    isDrawMode
  } = useSelectionStore();

  const selectedCount = getSelectedCellsCount();

  const modeOptions: { value: SelectionMode; label: string; description: string; icon: React.FC }[] = [
    {
      value: 'draw',
      label: 'Draw',
      description: 'Draw on the grid with symbols and colors',
      icon: PencilIcon
    },
    {
      value: 'single',
      label: 'Select',
      description: 'Select an area to manipulate',
      icon: SingleBoxIcon
    },
    {
      value: 'multiple',
      label: 'Multi-Select',
      description: 'Select multiple areas to manipulate',
      icon: MultipleBoxIcon
    }
  ];

  const toolOptions: { value: Tool; label: string; description: string; icon: React.FC }[] = [
    {
      value: 'select-area',
      label: 'Area',
      description: 'Drag for a rectangular area',
      icon: AreaIcon
    },
    {
      value: 'select-rectangle',
      label: 'Rectangle',
      description: 'Drag for a rectangle',
      icon: RectangleIcon
    },
    {
      value: 'select-cells',
      label: 'Cells',
      description: 'Drag across individual cells',
      icon: CellsIcon
    },
  ];

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
          {modeOptions.map((mode) => (
            <label key={mode.value} className="mode-option">
              <input
                type="radio"
                name="selectionMode"
                value={mode.value}
                checked={selectionMode === mode.value}
                onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
                className="sr-only"
              />
              <div className="mode-icon"><mode.icon /></div>
              <div className="mode-option-content">
                <span className="mode-label">{mode.label}</span>
                <span className="mode-description">{mode.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="selection-tool-section">
        <h4>Shape</h4>
        <div className="tool-options">
          {toolOptions.map((tool) => (
            <label key={tool.value} className="tool-option">
              <input
                type="radio"
                name="selectionTool"
                value={tool.value}
                checked={activeTool === tool.value}
                onChange={(e) => setActiveTool(e.target.value as Tool)}
                className="sr-only"
              />
              <div className="tool-icon"><tool.icon /></div>
              <div className="tool-option-content">
                <span className="tool-label">{tool.label}</span>
                <span className="tool-description">{tool.description}</span>
              </div>
            </label>
          ))}
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

      <div className="selection-tool-section">
        <h4>Tips</h4>
        <div className="instructions">
          <div className="instruction-item">
            <strong>Left-click:</strong> Draw or Select the cells on the grid
          </div>
          <div className="instruction-item">
            <strong>Right-click:</strong> Erase or unselect the cells on the grid
          </div>
          <div className="instruction-item">
            <strong>Selections:</strong> When in select mode, you can replace the current symbol or color with a new one by selecting from the footer
          </div>
          <div className="instruction-item">
            <strong>Shift + Left-click:</strong> Select the cells on the grid
          </div>
          <div className="instruction-item">
            <strong>Shift + Right-click:</strong> Unselect the cells on the grid
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionTool; 