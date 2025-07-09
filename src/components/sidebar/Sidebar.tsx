import React from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import type { SelectionTool as Tool, SelectionMode } from '../../store/selectionStore';
import { 
  PencilIcon, SingleBoxIcon, MultipleBoxIcon, 
  AreaIcon, RectangleIcon, CellsIcon,
  RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon,
  NewFileIcon
} from '../icons/Icons';
import './Sidebar.css';

interface SidebarProps {
  onRotate: (direction: 'left' | 'right') => void;
  onMirror: (direction: 'horizontal' | 'vertical') => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onRotate, onMirror, onReset }) => {
  const {
    activeTool,
    selectionMode,
    setActiveTool,
    setSelectionMode
  } = useSelectionStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* New Grid Section */}
        <div className="sidebar-section">
          <div className="sidebar-buttons">
            <button 
              onClick={onReset} 
              className="sidebar-btn"
              title="New grid"
            >
              <NewFileIcon />
            </button>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Mode Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Tools</div>
          <div className="sidebar-buttons">
            <label className="sidebar-radio-btn">
              <input
                type="radio"
                name="sidebarSelectionMode"
                value="draw"
                checked={selectionMode === 'draw'}
                onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
                className="sr-only"
              />
              <div className="sidebar-icon" title="Draw using symbols and colors">
                <PencilIcon />
              </div>
            </label>
            
            <label className="sidebar-radio-btn">
              <input
                type="radio"
                name="sidebarSelectionMode"
                value="single"
                checked={selectionMode === 'single'}
                onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
                className="sr-only"
              />
              <div className="sidebar-icon" title="Select an area to manipulate">
                <SingleBoxIcon />
              </div>
            </label>
            
            <label className="sidebar-radio-btn">
              <input
                type="radio"
                name="sidebarSelectionMode"
                value="multiple"
                checked={selectionMode === 'multiple'}
                onChange={(e) => setSelectionMode(e.target.value as SelectionMode)}
                className="sr-only"
              />
              <div className="sidebar-icon" title="Select multiple areas to manipulate">
                <MultipleBoxIcon />
              </div>
            </label>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="sidebar-separator"></div>

        {/* Shape Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Shape</div>
          <div className="sidebar-buttons">
            <label className="sidebar-radio-btn">
              <input
                type="radio"
                name="sidebarSelectionTool"
                value="select-cells"
                checked={activeTool === 'select-cells'}
                onChange={(e) => setActiveTool(e.target.value as Tool)}
                className="sr-only"
              />
              <div className="sidebar-icon" title="Drag across individual cells">
                <CellsIcon />
              </div>
            </label>
            
            <label className="sidebar-radio-btn">
              <input
                type="radio"
                name="sidebarSelectionTool"
                value="select-area"
                checked={activeTool === 'select-area'}
                onChange={(e) => setActiveTool(e.target.value as Tool)}
                className="sr-only"
              />
              <div className="sidebar-icon" title="Drag for a rectangular area">
                <AreaIcon />
              </div>
            </label>
            
            <label className="sidebar-radio-btn">
              <input
                type="radio"
                name="sidebarSelectionTool"
                value="select-rectangle"
                checked={activeTool === 'select-rectangle'}
                onChange={(e) => setActiveTool(e.target.value as Tool)}
                className="sr-only"
              />
              <div className="sidebar-icon" title="Drag for a rectangle">
                <RectangleIcon />
              </div>
            </label>
          </div>
        </div>

        {/* Visual Separator and Transform Section - only show when in selection mode */}
        {(selectionMode === 'single' || selectionMode === 'multiple') && (
          <>
            <div className="sidebar-separator"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title">Edit</div>
              <div className="sidebar-buttons">
                <button 
                  onClick={() => onRotate('left')} 
                  className="sidebar-btn"
                  title="Rotate Left"
                >
                  <RotateLeftIcon />
                </button>
                <button 
                  onClick={() => onRotate('right')} 
                  className="sidebar-btn"
                  title="Rotate Right"
                >
                  <RotateRightIcon />
                </button>
                <button 
                  onClick={() => onMirror('horizontal')} 
                  className="sidebar-btn"
                  title="Flip Horizontal"
                >
                  <FlipHorizontalIcon />
                </button>
                <button 
                  onClick={() => onMirror('vertical')} 
                  className="sidebar-btn"
                  title="Flip Vertical"
                >
                  <FlipVerticalIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 