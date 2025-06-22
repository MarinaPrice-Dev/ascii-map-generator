import React, { useState } from 'react';
import SelectionTool from '../tools/SelectionTool';
import Shortcuts from './Shortcuts';
import Help from './Help';
import ResetDialog from './ResetDialog';
import './Menu.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRotate: (direction: 'left' | 'right') => void;
  onMirror: (direction: 'horizontal' | 'vertical') => void;
  onReset: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onRotate, onMirror, onReset }) => {
  const [activeSection, setActiveSection] = useState<string>('tools');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetClick = () => {
    setIsResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    onReset();
    setIsResetDialogOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'tools':
        return <SelectionTool onRotate={onRotate} onMirror={onMirror} />;
      case 'shortcuts':
        return <Shortcuts />;
      case 'help':
        return <Help />;
      default:
        return <div className="menu-placeholder">Section coming soon...</div>;
    }
  };

  return (
    <>
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="menu-navigation">
          <button 
            className={`nav-button ${activeSection === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveSection('tools')}
          >
            Tools
          </button>
          <button 
            className={`nav-button ${activeSection === 'shortcuts' ? 'active' : ''}`}
            onClick={() => setActiveSection('shortcuts')}
          >
            Shortcuts
          </button>
          <button 
            className={`nav-button ${activeSection === 'help' ? 'active' : ''}`}
            onClick={() => setActiveSection('help')}
          >
            Help
          </button>
          <button 
            className="nav-button close-button"
            onClick={onClose}
            title="Close menu"
          >
            ✕
          </button>
        </div>
        
        <div className="menu-content">
          {renderSection()}
        </div>
        
        <div className="menu-footer">
          <h3>Send feedback</h3>
          <div className="contact-links">
            <a href="mailto:contact@asciistudio.app" className="contact-link email-link" title="contact@asciistudio.app">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a href="https://www.reddit.com/r/asciistudio/" target="_blank" rel="noopener noreferrer" className="contact-link reddit-link" title="r/asciistudio">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
          </div>
          <button 
            className="contact-link reset-link" 
            onClick={handleResetClick}
            title="Reset grid to defaults"
          >
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
          </button>
        </div>
      </div>
      
      <ResetDialog 
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetConfirm}
      />
    </>
  );
};

export default Menu; 