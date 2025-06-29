import React from 'react';
import './InfoDialog.css';

interface InfoDialogProps {
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ onClose }) => (
  <div className="info-dialog-overlay">
    <div className="info-dialog">
      <div className="info-dialog-header">
        <h2>About ASCII Studio</h2>
        <button className="menu-close" onClick={onClose}>×</button>
      </div>
      <div className="info-dialog-body">
        <p>ASCII Studio is a powerful tool for creating ASCII art with customizable characters and colors.</p>
        <h3>Getting Started</h3>
        <p>Just click on any square in the grid to start drawing your very own art. You can easily change any of the symbols and colors by selecting from the footer.</p>
        <p>You can also import images from your computer and convert them to ASCII art. This is a great way to get started with ASCII Studio!</p>
        <p>For more advanced features, click the Menu button in the top right corner of the screen. This will open the tools menu. From here, you can select any of the shapes tools to start creating more customisable art. Use the "Selection Tool" to select and manipulate areas of the grid.</p>
        <p>You can export your art in a variety of formats, including .html, .txt, .json, .ansi, .rot.txt, and .png. The json format is best for saving your work and re-importing to continue it as it includes all the information needed to recreate your art.</p>
        <h3>Features</h3>
        <ul className="feature">
          <li>
          <svg className="feature-icon" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
            <strong>Image Import:</strong> Import images from your computer and convert them to ASCII art.
          </li>
          <li>
          <svg className="feature-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M3 3v18h18V3H3zm2 2h14v14H5V5zm2 2v10h10V7H7zm2 2h6v6H9V9z"/>
            </svg>
            <strong>Drag and Fill:</strong> Click, hold and drag to fill an area with the chosen character, foreground color, and background color.
          </li>
            <li>
          <svg className="feature-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z"/>
              <path fill="currentColor" d="M7 7h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 15h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
          <strong>Selection Tool:</strong> Use the selection tool to select and manipulate areas of the grid. Available in the Tools menu.
          </li>
          <li>
          <svg className="feature-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <strong>Color Support:</strong> Customize the foreground and background colors of each cell. Use the selection tool to select areas and change the color or symbol instantly.</li>
          <li>
          <svg className="feature-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <strong>Export and Import:</strong> Export and import your creations for use in other applications.</li>
          <li>
          <svg className="feature-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path fill="currentColor" d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
            </svg>
            <strong>Responsive:</strong> Provides limited feature support for tablets and mobile.</li>
        </ul>
        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li><strong>Ctrl + Z:</strong> Undo the last action.</li>
          <li><strong>Ctrl + Y:</strong> Redo the last undone action.</li>
          <li><strong>Ctrl + S:</strong> Save the current map.</li>
          <li><strong>Ctrl + M:</strong> Open the menu, the rest of the shortcuts are listed here!</li>
        </ul>
        <h3>Example ASCII Maps (coming soon)</h3>
        <p>Here are some examples of what you can create with ASCII Studio:</p>
        <h3>Latest Updates</h3>
        <h5>2025-06-29</h5>
        <ul>
            <li><strong>Grid Resizing:</strong> Resize the grid to your desired size.</li>
            <li><strong>Html Exports:</strong> .html export is now available, allows for easy sharing of your art.</li>
            <li><strong>Improved ASCII grid display:</strong> Displays better for use with monospace fonts.</li>
            <li><strong>More colors and symbols:</strong> Added more colors and symbols to the palette.</li>
            <li><strong>Bug fixes</strong></li>
        </ul>
        <h5>2025-06-23</h5>
        <ul>
            <li><strong>Preview:</strong> Preview the cell you are drawing.</li>
            <li><strong>Grid Borders:</strong> Toggle grid borders on and off.</li>
            <li><strong>Image Import:</strong> Import images from your computer and convert them to ASCII art.</li>
            <li><strong>Image Export:</strong> Export your ASCII art as a PNG image.</li>
            <li><strong>Bug fixes</strong></li>
        </ul>
        <h5>2025-06-21</h5>
        <ul>
            <li><strong>Selection Tool:</strong> Added a selection tool to the menu. Select and manipulate areas of the grid.</li>
            <li><strong>Shape and Transform:</strong> Added powerful shape and transform tools to menu. Rotate and mirror shapes.</li>
            <li><strong>Shortcuts:</strong> Add several keyboard shortcuts, list available in the menu.</li>
            <li><strong>Bug fixes</strong></li>
        </ul>
        <h5>2025-06-17</h5>
        <ul>
            <li><strong>Export Formats:</strong> Added support for .txt, .json, .ansi, and .rot.txt.</li>
            <li><strong>Importing:</strong> Added support for .txt, .json, .ansi, and .rot.txt.</li>
            <li><strong>Bug fixes</strong></li>
        </ul>
        <h5>2025-06-13</h5>
        <ul>
            <li><strong>Zoom 10px to 30px:</strong> Zoom in and out of the map. Not avalaible in mobile.</li>
            <li><strong>UI for Drag and Fill:</strong> Displays a blue rectangle when dragging to fill an area.</li>
            <li><strong>Save State:</strong> Save state to local storage.</li>
            <li><strong>Bug fixes</strong></li>
        </ul>
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
    </div>
  </div>
);

export default InfoDialog; 