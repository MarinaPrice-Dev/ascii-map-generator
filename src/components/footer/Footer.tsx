import React, { useRef, useEffect, useState } from 'react';
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

type TabType = 'symbols' | 'foreground' | 'background';

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
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('symbols');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault();
        // Try mobile input first, then desktop input
        if (mobileInputRef.current) {
          mobileInputRef.current.focus();
          mobileInputRef.current.select();
        } else if (desktopInputRef.current) {
          desktopInputRef.current.focus();
          desktopInputRef.current.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mobile Tabbed View
  const MobileView = () => (
    <div className="footer-mobile">

      <div className="selected-header">
        <div className="section-label">Selected:</div>
        <input
          ref={mobileInputRef}
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

  // Desktop/Tablet View (unchanged)
  const DesktopView = () => (
    <div className="footer-sections w-full h-[460px] grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr] md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1">
      <div className="footer-section color-section min-h-[150px] md:row-span-2 md:min-h-0 lg:row-span-1">
        <div className="section-header">
          <div className="section-label">Selected:</div>
          <input
            ref={desktopInputRef}
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

  return (
    <footer className={`footer ${isMenuOpen ? 'menu-open' : ''} ${isImageDialogOpen ? 'imageimportdialog-open' : ''}`}>
      <div className="footer-content">
        {/* Mobile View */}
        <div className="footer-mobile-view">
          <MobileView />
        </div>
        
        {/* Desktop/Tablet View */}
        <div className="footer-desktop-view">
          <DesktopView />
        </div>
      </div>
    </footer>
  );
}; 