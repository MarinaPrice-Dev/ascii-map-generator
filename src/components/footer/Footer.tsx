import React, { useRef, useEffect } from 'react';
import CharacterPicker from '../CharacterPicker';
import ColorPalette from '../ColorPalette';
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

export const Footer: React.FC<FooterProps> = ({
  selectedChar,
  setSelectedChar,
  selectedFg,
  setSelectedFg,
  selectedBg,
  setSelectedBg,
  fgPresets,
  bgPresets
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
        <div className="footer-section color-section">
            <div className="section-header">
              <div className="section-label">Character</div>
              <input
                ref={inputRef}
                type="text"
                maxLength={1}
                value={selectedChar}
                onChange={e => setSelectedChar(e.target.value)}
                className="character-input"
              />
            </div>
            <CharacterPicker 
              selectedChar={selectedChar}
              setSelectedChar={setSelectedChar}
            />
          </div>
          
          <div className="footer-section color-section">
            <div className="section-label">Foreground</div>
            <ColorPalette 
              value={selectedFg}
              onChange={setSelectedFg}
              mode="foreground"
            />
          </div>

          <div className="footer-section color-section">
            <div className="section-label">Background</div>
            <ColorPalette 
              value={selectedBg}
              onChange={setSelectedBg}
              mode="background"
            />
          </div>


        </div>
      </div>
    </footer>
  );
}; 