import React, { useEffect } from 'react';
import './CharacterPicker.css';

type CharacterPickerProps = {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
};

const presetChars = ['#', '.', '@', '+', '-', '|', '~', ' '];

const CharacterPicker: React.FC<CharacterPickerProps> = ({ selectedChar, setSelectedChar }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key.length === 1) {
        e.preventDefault();
        setSelectedChar(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setSelectedChar]);

  return (
    <div className="character-grid">
      {presetChars.map((char) => (
        <button
          key={char}
          onClick={() => setSelectedChar(char)}
          className={`character-swatch ${selectedChar === char ? 'selected' : ''}`}
        >
          {char === ' ' ? <>&nbsp;</> : char}
        </button>
      ))}
    </div>
  );
};

export default CharacterPicker; 