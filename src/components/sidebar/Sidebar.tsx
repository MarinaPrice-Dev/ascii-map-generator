import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelectionStore } from '../../store/selectionStore';
import type { SelectionTool as Tool, SelectionMode } from '../../store/selectionStore';
import { 
  PencilIcon, SingleBoxIcon, MultipleBoxIcon, 
  AreaIcon, RectangleIcon, CellsIcon,
  RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon,
  NewFileIcon, CopyIcon, PasteIcon, CutIcon, ClearIcon
} from '../icons/Icons';

import { useToast } from '../toast/ToastContainer';
import './Sidebar.css';

import type { Cell } from '../../types/cell';

interface SidebarProps {
  onRotate: (direction: 'left' | 'right') => void;
  onMirror: (direction: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  grid: Cell[][];
  selectedCells: Set<string>;
  pasteMode: boolean;
  onPasteModeToggle: () => void;
  updateGrid: (newGrid: Cell[][]) => void;
  beginAction: () => void;
  onCopy: () => void;
  onCut: () => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onRotate, onMirror, onReset, pasteMode, onPasteModeToggle, beginAction, onCopy, onCut, onClear }) => {
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
            <Tippy content="New grid" placement="right">
              <button 
                onClick={onReset} 
                className="sidebar-btn"
              >
                <NewFileIcon />
              </button>
            </Tippy>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Mode Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Tools</div>
          <div className="sidebar-buttons">
            <Tippy content="Draw using symbols and colors" placement="right">
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
            </Tippy>
            <Tippy content="Select an area to manipulate" placement="right">
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
            </Tippy>
            <Tippy content="Select multiple areas to manipulate" placement="right">
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
            </Tippy>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Shape Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Shape</div>
          <div className="sidebar-buttons">
            <Tippy content="Drag across individual cells" placement="right">
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
            </Tippy>
            <Tippy content="Drag for a rectangular area" placement="right">
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
            </Tippy>
            <Tippy content="Drag for a rectangle" placement="right">
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
            </Tippy>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Edit Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Edit</div>
          <div className="sidebar-buttons">
            <Tippy content="Copy selection" placement="right">
              <button 
                className="sidebar-btn"
                onClick={onCopy}
              >
                <CopyIcon />
              </button>
            </Tippy>
            <Tippy content={pasteMode ? "Exit paste mode" : "Paste from clipboard"} placement="right">
              <button 
                className={`sidebar-btn${pasteMode ? ' paste-mode-active' : ''}`}
                onClick={onPasteModeToggle}
              >
                <PasteIcon />
              </button>
            </Tippy>
            <Tippy content="Cut selection" placement="right">
              <button 
                className="sidebar-btn"
                onClick={onCut}
              >
                <CutIcon />
              </button>
            </Tippy>
          </div>
        </div>

        {/* Visual Separator and Transform Section - only show when in selection mode */}
        {(selectionMode === 'single' || selectionMode === 'multiple') && (
          <>
            <div className="sidebar-separator"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title">Alter</div>
              <div className="sidebar-buttons">
                <Tippy content="Rotate Left" placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onRotate('left');
                    }} 
                    className="sidebar-btn"
                  >
                    <RotateLeftIcon />
                  </button>
                </Tippy>
                <Tippy content="Rotate Right" placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onRotate('right');
                    }} 
                    className="sidebar-btn"
                  >
                    <RotateRightIcon />
                  </button>
                </Tippy>
                <Tippy content="Flip Horizontal" placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onMirror('horizontal');
                    }} 
                    className="sidebar-btn"
                  >
                    <FlipHorizontalIcon />
                  </button>
                </Tippy>
                <Tippy content="Flip Vertical" placement="right">
                  <button 
                    onClick={() => {
                      beginAction();
                      onMirror('vertical');
                    }} 
                    className="sidebar-btn"
                  >
                    <FlipVerticalIcon />
                  </button>
                </Tippy>
                <Tippy content="Clear" placement="right">
                  <button 
                    onClick={onClear} 
                    className="sidebar-btn"
                  >
                    <ClearIcon />
                  </button>
                </Tippy>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 