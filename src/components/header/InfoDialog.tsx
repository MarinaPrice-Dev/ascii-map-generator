import React from 'react';
import './InfoDialog.css';

interface InfoDialogProps {
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ onClose }) => (
  <div className="info-dialog-overlay">
    <div className="info-dialog">
      <h2>About ASCII Studio</h2>
      <div className="info-dialog-body">
        <p>ASCII Studio is a powerful tool for creating ASCII art maps with customizable characters and colors.</p>
        <h3>Features</h3>
        <ul>
          <li><strong>Grid Editor:</strong> Create and edit ASCII art on a customizable grid.</li>
          <li><strong>Character Customization:</strong> Use a variety of characters, including alt characters, to design your maps.</li>
          <li><strong>Color Support:</strong> Customize the foreground and background colors of each cell.</li>
          <li><strong>Export Functionality:</strong> Export your creations for use in other applications.</li>
          <li><strong>Responsive:</strong> Fully supports tablets and mobile.</li>
        </ul>
        <h3>Keyboard Shortcuts (coming up soon)</h3>
        <ul>
          <li><strong>Ctrl + Z:</strong> Undo the last action.</li>
          <li><strong>Ctrl + Y:</strong> Redo the last undone action.</li>
          <li><strong>Ctrl + S:</strong> Save the current map.</li>
          <li><strong>Ctrl + C:</strong> Clear the current map.</li>
        </ul>
        <h3>Example ASCII Maps (todo)</h3>
        <p>Here are some examples of what you can create with ASCII Studio:</p>
        <h3>Latest Updates</h3>
        <h5>2025-06-12</h5>
        <ul>
            <li><strong>Styling:</strong> Improved styling of the App.</li>
            <li><strong>Information:</strong> Added information dialog.</li>
        </ul>
        <h5>2025-06-11</h5>
        <ul>
          <li><strong>Character Customization:</strong> Use a variety of characters, including alt characters, to design your maps.</li>
          <li><strong>Responsive:</strong> Better support for tablets and mobile.</li>
          <li><strong>Colour Palletes:</strong> Improved selection of colours.</li>
          <li><strong>Symbol Selector:</strong> Select from a variety of symbols.</li>
          <li><strong>Touch Support:</strong> Improved grid editing on touch devices.</li>
        </ul>
        <h5>2025-06-10</h5>
        <ul>
          <li><strong>Grid Editor:</strong> Create and edit ASCII art on a customizable grid.</li>
          <li><strong>Undo and Redo:</strong> Undo and redo all actions.</li>
          <li><strong>Export:</strong> Basic .txt export functionality.</li>
          <li><strong>Color Support:</strong> Customize the foreground and background colors of each cell.</li>
        </ul>
      </div>
      <div className="info-dialog-footer">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

export default InfoDialog; 