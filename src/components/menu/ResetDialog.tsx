import React from 'react';
import './ResetDialog.css';

interface ResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDialog: React.FC<ResetDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="reset-dialog-overlay" onClick={onClose}>
      <div className="reset-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="reset-dialog-header">
          <h3>Master Grid Reset</h3>
          <button className="reset-dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="reset-dialog-content">
          <p>Are you sure you want to reset the grid to defaults?</p>
          <p className="reset-warning">
            This will:
          </p>
          <ul>
            <li>Delete all undo/redo history</li>
            <li>Set cell size back to 20px</li>
            <li>Clear all grid content</li>
            <li>Reset to initial grid dimensions</li>
          </ul>
          <p className="reset-warning">This action cannot be undone.</p>
        </div>
        
        <div className="reset-dialog-actions">
          <button className="reset-dialog-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="reset-dialog-button confirm" onClick={handleConfirm}>
            Reset Grid
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetDialog; 