import { forwardRef } from 'react';
import CharacterPicker from './CharacterPicker';
import ColorPalette from './ColorPalette';

interface MobileViewProps {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
  selectedFg: string;
  setSelectedFg: (color: string) => void;
  selectedBg: string;
  setSelectedBg: (color: string) => void;
  activeTab: 'symbols' | 'foreground' | 'background';
  setActiveTab: (tab: 'symbols' | 'foreground' | 'background') => void;
}

export const MobileView = forwardRef<HTMLInputElement, MobileViewProps>(({
  selectedChar,
  setSelectedChar,
  selectedFg,
  setSelectedFg,
  selectedBg,
  setSelectedBg,
  activeTab,
  setActiveTab
}, ref) => {

  return (
    <div className="footer-mobile">
      <div className="selected-header">
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

      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${activeTab === 'symbols' ? 'active' : ''}`}
          onClick={() => setActiveTab('symbols')}
        >
          Symbols
        </button>
        <button
          className={`mobile-tab ${activeTab === 'foreground' ? 'active' : ''}`}
          onClick={() => setActiveTab('foreground')}
        >
          Foreground
        </button>
        <button
          className={`mobile-tab ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTab('background')}
        >
          Background
        </button>
      </div>
      
      <div className="mobile-tab-content">
        {activeTab === 'symbols' && (
          <div className="mobile-section">
            <CharacterPicker 
              selectedChar={selectedChar}
              setSelectedChar={setSelectedChar}
            />
          </div>
        )}
        
        {activeTab === 'foreground' && (
          <div className="mobile-section">
            <ColorPalette 
              value={selectedFg}
              onChange={setSelectedFg}
              mode="foreground"
            />
          </div>
        )}
        
        {activeTab === 'background' && (
          <div className="mobile-section">
            <ColorPalette 
              value={selectedBg}
              onChange={setSelectedBg}
              mode="background"
            />
          </div>
        )}
      </div>
    </div>
  );
}); 