import React from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import type { SelectionTool as Tool, SelectionMode } from '../../store/selectionStore';
import { PencilIcon, SingleBoxIcon, MultipleBoxIcon, AreaIcon, RectangleIcon, CellsIcon } from '../icons/Icons';
import './SelectionTool.css';

const SelectionTool: React.FC = () => {
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
      description: 'Draw on the grid with selected character and colors',
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
      description: 'Click for individual cells',
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
        <h4>Shape Tool</h4>
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
        <h4>Help</h4>
        <div className="instructions">
          <div className="instruction-item">
            <strong>Draw Mode:</strong> Use tools to draw on the grid with selected character and colors
          </div>
          <div className="instruction-item">
            <strong>Select Mode:</strong> Use tools to select cells for future operations
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionTool; 