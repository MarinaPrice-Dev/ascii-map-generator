import React from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import type { SelectionTool as Tool, SelectionMode } from '../../store/selectionStore';
import { 
  PencilIcon, EraserIcon, SingleBoxIcon, MultipleBoxIcon, 
  AreaIcon, RectangleIcon, CellsIcon,
  RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon,
  NewFileIcon, CopyIcon, PasteIcon, CutIcon, ClearIcon
} from '../icons/Icons';
import Tooltip from '../ui/Tooltip';

import { useToast } from '../toast/ToastContainer';
import './Sidebar.css';



interface SidebarProps {
  onRotate: (direction: 'left' | 'right') => void;
  onMirror: (direction: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  selectedCells: Set<string>;
  pasteMode: boolean;
  onPasteModeToggle: () => void;
  beginAction: () => void;
  onCopy: () => void;
  onCut: () => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onRotate, onMirror, onReset, selectedCells, pasteMode, onPasteModeToggle, beginAction, onCopy, onCut, onClear }) => {
  const { showToast } = useToast();
  const {
    activeTool,
    selectionMode,
    setActiveTool,
    setSelectionMode
  } = useSelectionStore();



  // Selection mode handlers with toast notifications
  const handleSelectionModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    if (mode === 'single' || mode === 'multiple') {
      showToast('Selection: Click and drag to select an area. Edit or Alter to manipulate your selection. Press [Esc] to remove any selections.');
    }
  };



  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* New Grid Section */}
        <div className="sidebar-section">
          <div className="sidebar-buttons">
            <Tooltip content="New grid" placement="right">
              <button 
                onClick={onReset} 
                className="sidebar-btn"
              >
                <NewFileIcon />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Mode Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Tools</div>
          <div className="sidebar-buttons">
            <Tooltip content="Draw using symbols and colors" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionMode"
                  value="draw"
                  checked={selectionMode === 'draw'}
                  onChange={(e) => handleSelectionModeChange(e.target.value as SelectionMode)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <PencilIcon />
                </div>
              </label>
            </Tooltip>
            <Tooltip content="Erase cells" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionMode"
                  value="eraser"
                  checked={selectionMode === 'eraser'}
                  onChange={(e) => handleSelectionModeChange(e.target.value as SelectionMode)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <EraserIcon />
                </div>
              </label>
            </Tooltip>
            <Tooltip content="Select an area to manipulate" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionMode"
                  value="single"
                  checked={selectionMode === 'single'}
                  onChange={(e) => handleSelectionModeChange(e.target.value as SelectionMode)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <SingleBoxIcon />
                </div>
              </label>
            </Tooltip>
            <Tooltip content="Select multiple areas to manipulate" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionMode"
                  value="multiple"
                  checked={selectionMode === 'multiple'}
                  onChange={(e) => handleSelectionModeChange(e.target.value as SelectionMode)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <MultipleBoxIcon />
                </div>
              </label>
            </Tooltip>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Shape Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Shape</div>
          <div className="sidebar-buttons">
            <Tooltip content="Drag across individual cells" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionTool"
                  value="select-cells"
                  checked={activeTool === 'select-cells'}
                  onChange={(e) => setActiveTool(e.target.value as Tool)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <CellsIcon />
                </div>
              </label>
            </Tooltip>
            <Tooltip content="Drag for a rectangular area" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionTool"
                  value="select-area"
                  checked={activeTool === 'select-area'}
                  onChange={(e) => setActiveTool(e.target.value as Tool)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <AreaIcon />
                </div>
              </label>
            </Tooltip>
            <Tooltip content="Drag for a rectangle" placement="right">
              <label className="sidebar-radio-btn">
                <input
                  type="radio"
                  name="sidebarSelectionTool"
                  value="select-rectangle"
                  checked={activeTool === 'select-rectangle'}
                  onChange={(e) => setActiveTool(e.target.value as Tool)}
                  className="sr-only"
                />
                <div className="sidebar-icon">
                  <RectangleIcon />
                </div>
              </label>
            </Tooltip>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Edit Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Edit</div>
          <div className="sidebar-buttons">
            <Tooltip content="Copy selection" placement="right">
              <button 
                className="sidebar-btn"
                onClick={onCopy}
              >
                <CopyIcon />
              </button>
            </Tooltip>
            <Tooltip content={pasteMode ? "Exit paste mode" : "Paste from clipboard"} placement="right">
              <button 
                className={`sidebar-btn${pasteMode ? ' paste-mode-active' : ''}`}
                onClick={onPasteModeToggle}
              >
                <PasteIcon />
              </button>
            </Tooltip>
            <Tooltip content="Cut selection" placement="right">
              <button 
                className="sidebar-btn"
                onClick={onCut}
              >
                <CutIcon />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Visual Separator and Transform Section - only show when in selection mode */}
        {(selectionMode === 'single' || selectionMode === 'multiple') && (
          <>
            <div className="sidebar-separator"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title">Alter</div>
              <div className="sidebar-buttons">
                <Tooltip content={selectedCells.size > 0 ? "Rotate Left" : "Select cells to rotate"} placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onRotate('left');
                    }} 
                    className="sidebar-btn"
                    disabled={selectedCells.size === 0}
                  >
                    <RotateLeftIcon />
                  </button>
                </Tooltip>
                <Tooltip content={selectedCells.size > 0 ? "Rotate Right" : "Select cells to rotate"} placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onRotate('right');
                    }} 
                    className="sidebar-btn"
                    disabled={selectedCells.size === 0}
                  >
                    <RotateRightIcon />
                  </button>
                </Tooltip>
                <Tooltip content="Flip Horizontal" placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onMirror('horizontal');
                    }} 
                    className="sidebar-btn"
                  >
                    <FlipHorizontalIcon />
                  </button>
                </Tooltip>
                <Tooltip content="Flip Vertical" placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onMirror('vertical');
                    }} 
                    className="sidebar-btn"
                  >
                    <FlipVerticalIcon />
                  </button>
                </Tooltip>
                <Tooltip content="Clear" placement="right">
                  <button 
                    onClick={onClear} 
                    className="sidebar-btn"
                  >
                    <ClearIcon />
                  </button>
                </Tooltip>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 