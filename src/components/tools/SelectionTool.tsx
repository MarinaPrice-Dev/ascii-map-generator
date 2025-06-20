import React from 'react';
import { useSelectionStore, type SelectionTool as SelectionToolType, type SelectionMode } from '../../store/selectionStore';
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

  const toolOptions: { value: SelectionToolType; label: string; description: string }[] = [
    {
      value: 'select-area',
      label: 'Select Area',
      description: 'Draw a rectangle to select all cells within the area'
    },
    {
      value: 'select-rectangle',
      label: 'Select Rectangle',
      description: 'Draw a rectangle to select only cells on the border'
    },
    {
      value: 'select-cells',
      label: 'Select Cells',
      description: 'Click to select individual cells'
    }
  ];

  const modeOptions: { value: SelectionMode; label: string; description: string }[] = [
    {
      value: 'draw',
      label: 'Draw Mode',
      description: 'Draw on the grid with selected character and colors'
    },
    {
      value: 'single',
      label: 'Single Selection',
      description: 'Each new selection replaces the previous one'
    },
    {
      value: 'multiple',
      label: 'Multiple Selection',
      description: 'New selections are added to existing ones'
    }
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
              />
              <div className="mode-option-content">
                <span className="mode-label">{mode.label}</span>
                <span className="mode-description">{mode.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="selection-tool-section">
        <h4>Selection Tool</h4>
        <div className="tool-options">
          {toolOptions.map((tool) => (
            <label key={tool.value} className="tool-option">
              <input
                type="radio"
                name="selectionTool"
                value={tool.value}
                checked={activeTool === tool.value}
                onChange={(e) => setActiveTool(e.target.value as SelectionToolType)}
              />
              <div className="tool-option-content">
                <span className="tool-label">{tool.label}</span>
                <span className="tool-description">{tool.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="selection-tool-section">
        <h4>Instructions</h4>
        <div className="instructions">
          <div className="instruction-item">
            <strong>Draw Mode:</strong> Use tools to draw on the grid with selected character and colors
          </div>
          <div className="instruction-item">
            <strong>Selection Mode:</strong> Use tools to select cells for future operations
          </div>
          <div className="instruction-item">
            <strong>Tools:</strong> Select Area (fill), Select Rectangle (border), Select Cells (individual)
          </div>
          <div className="instruction-item">
            <strong>Mac:</strong> One-finger click to select, Two-finger click to unselect
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionTool; 