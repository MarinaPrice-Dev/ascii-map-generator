import React, { useRef, useEffect } from 'react';
import CharacterPicker from './CharacterPicker';
import ColorPalette from './ColorPalette';
import './Footer.css';

interface FooterProps {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
  selectedFg: string;
  setSelectedFg: (color: string) => void;
  selectedBg: string;
  setSelectedBg: (color: string) => void;
  isMenuOpen?: boolean;
  isImageDialogOpen?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  selectedChar,
  setSelectedChar,
  selectedFg,
  setSelectedFg,
  selectedBg,
  setSelectedBg,
  isMenuOpen = false,
  isImageDialogOpen = false
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
    <footer className={`footer ${isMenuOpen ? 'menu-open' : ''} ${isImageDialogOpen ? 'imageimportdialog-open' : ''}`}>
      <div className="footer-content">
        <div className="footer-sections w-full h-[460px] grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr] md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1">
        <div className="footer-section color-section min-h-[150px] md:row-span-2 md:min-h-0 lg:row-span-1">
            <div className="section-header">
              <div className="section-label">Selected:</div>
              <input
                ref={inputRef}
                type="text"
                maxLength={1}
                value={selectedChar}
                onKeyDown={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                onChange={e => setSelectedChar(e.target.value)}
                className="character-input"
                style={{ 
                  color: selectedFg,
                  backgroundColor: selectedBg
                }}
              />
            </div>
            <CharacterPicker 
              selectedChar={selectedChar}
              setSelectedChar={setSelectedChar}
            />
          </div>
          
          <div className="footer-section color-section min-h-[150px] md:col-start-2 md:min-h-0 lg:col-auto">
            <div className="section-label">Foreground</div>
            <ColorPalette 
              value={selectedFg}
              onChange={setSelectedFg}
              mode="foreground"
            />
          </div>

          <div className="footer-section color-section min-h-[150px] md:col-start-2 md:min-h-0 lg:col-auto">
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