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
          <li><strong>Future Enhancements:</strong> Stay tuned for more features and improvements!</li>
        </ul>
      </div>
      <div className="info-dialog-footer">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

export default InfoDialog; 