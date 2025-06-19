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
    getSelectedCellsCount
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
      <div className="selection-tool-header">
        <h3>Selection Tools</h3>
        <div className="selection-info">
          <span className="selected-count">{selectedCount} cells selected</span>
          {selectedCount > 0 && (
            <button 
              className="clear-selection-btn"
              onClick={clearSelection}
              title="Clear all selections"
            >
              Clear
            </button>
          )}
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
        <h4>Selection Mode</h4>
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
        <h4>Instructions</h4>
        <div className="instructions">
          <div className="instruction-item">
            <strong>Windows:</strong> Left-click to select, Right-click to unselect
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