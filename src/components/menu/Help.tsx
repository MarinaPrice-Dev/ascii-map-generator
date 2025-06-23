import React from 'react';
import './Help.css';

const Help: React.FC = () => {
  return (
      <div className="selection-tool">
        <div className="selection-tool-section">
          <h4>Creating Your ASCII Art</h4>
          <div className="instructions">
            <div className="instruction-item">
              <strong>Character Selection</strong>
               Choose a character from the footer palette, or select more quickly by typing the character. There is support for [alt] + [number] to select special characters.
            </div>
            <div className="instruction-item">
              <strong>Drawing and Selection</strong>
              The Tools menu has a few special modes that can be useful for quickly drawing, selecting and manuipulating large areas.
            </div>
            <div className="instruction-item">
              <strong>Select mode</strong> 
              When in select mode, you can replace the current symbol or color with a new one by selecting from the footer
            </div>
            <div className="instruction-item">
              <strong>Zoom</strong>
              Use the zoom controls to work on fine details.
            </div>
          </div>
        </div>
        <div className="selection-tool-section">
          <h4>Tips</h4>
          <div className="instructions">
            <div className="instruction-item">
              <strong>Left-click</strong> Draw or Select the cells on the grid
            </div>
            <div className="instruction-item">
              <strong>Right-click</strong> Erase or unselect the cells on the grid
            </div>
            <div className="instruction-item">
              <strong>Selections</strong> When in select mode, you can replace the current symbol or color with a new one by selecting from the footer
            </div>
          </div>
        </div>
        <div className="selection-tool-section">
          <h4>Exporting Your Map</h4>
          <div className="instructions">
            <div className="instruction-item">
              <strong>Text (.txt)</strong> Plain ASCII text file. Simple export without colors.
            </div>
            <div className="instruction-item">
              <strong>JSON (.json)</strong> Structured data with colors and metadata.
            </div>
            <div className="instruction-item">
              <strong>ANSI (.ans)</strong> ANSI art format with colors.
            </div>
            <div className="instruction-item">
              <strong>ROT (.rot.txt)</strong> Designed to work with the Rot.js library. Using display.drawText() will display your ascii art including colors.
            </div>
            <div className="instruction-item">
              <strong>PNG (.png)</strong> PNG image of your image.
            </div>
          </div>
        </div>
      </div>
  );
};

export default Help; 