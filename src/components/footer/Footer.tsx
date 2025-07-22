import React, { useRef, useEffect, useState } from 'react';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
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

  return (
    <footer className={`footer ${isMenuOpen ? 'menu-open' : ''} ${isImageDialogOpen ? 'imageimportdialog-open' : ''}`}>
      <div className="footer-content">
        {/* Mobile View */}
        <div className="footer-mobile-view">
          <MobileView
            ref={mobileInputRef}
            selectedChar={selectedChar}
            setSelectedChar={setSelectedChar}
            selectedFg={selectedFg}
            setSelectedFg={setSelectedFg}
            selectedBg={selectedBg}
            setSelectedBg={setSelectedBg}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        
        {/* Desktop/Tablet View */}
        <div className="footer-desktop-view">
          <DesktopView
            ref={desktopInputRef}
            selectedChar={selectedChar}
            setSelectedChar={setSelectedChar}
            selectedFg={selectedFg}
            setSelectedFg={setSelectedFg}
            selectedBg={selectedBg}
            setSelectedBg={setSelectedBg}
          />
        </div>
      </div>
    </footer>
  );
}; 