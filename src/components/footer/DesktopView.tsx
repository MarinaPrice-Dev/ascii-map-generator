import { forwardRef } from 'react';
import CharacterPicker from './CharacterPicker';
import ColorPalette from './ColorPalette';

interface DesktopViewProps {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
  selectedFg: string;
  setSelectedFg: (color: string) => void;
  selectedBg: string;
  setSelectedBg: (color: string) => void;
}

export const DesktopView = forwardRef<HTMLInputElement, DesktopViewProps>(({
  selectedChar,
  setSelectedChar,
  selectedFg,
  setSelectedFg,
  selectedBg,
  setSelectedBg
}, ref) => {

  return (
    <div className="footer-sections w-full h-[460px] grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr] md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1">
      <div className="footer-section color-section min-h-[150px] md:row-span-2 md:min-h-0 lg:row-span-1">
        <div className="section-header">
          <div className="section-label">Selected:</div>
          <input
            ref={ref}
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
  );
}); 