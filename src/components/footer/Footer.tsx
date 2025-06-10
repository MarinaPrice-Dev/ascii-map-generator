import React from 'react';
import CharacterPicker from '../CharacterPicker';
import ColorPicker from '../ColorPicker';
import './Footer.css';

interface FooterProps {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
  selectedFg: string;
  setSelectedFg: (color: string) => void;
  selectedBg: string;
  setSelectedBg: (color: string) => void;
  fgPresets: string[];
  bgPresets: string[];
}

const Footer: React.FC<FooterProps> = ({
  selectedChar,
  setSelectedChar,
  selectedFg,
  setSelectedFg,
  selectedBg,
  setSelectedBg,
  fgPresets,
  bgPresets,
}) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="color-pickers">
          <ColorPicker
            label="Text"
            value={selectedFg}
            onChange={setSelectedFg}
            presets={fgPresets}
          />
          <ColorPicker
            label="Background"
            value={selectedBg}
            onChange={setSelectedBg}
            presets={bgPresets}
          />
        </div>
        <div className="character-picker-container">
          <CharacterPicker selectedChar={selectedChar} setSelectedChar={setSelectedChar} />
        </div>
      </div>
    </footer>
  );
};

export default Footer; 