import React, { useEffect, useRef } from 'react';

type CharacterPickerProps = {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
};

const presetChars = ['#', '.', '@', '+', '-', '|', '~', ' '];

const CharacterPicker: React.FC<CharacterPickerProps> = ({ selectedChar, setSelectedChar }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Focus input when Alt is pressed
      if (e.key === 'Alt') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
        return;
      }

      // Ignore if user is typing in the input field
      if (e.target instanceof HTMLInputElement) return;
      
      // Only handle single character keys
      if (e.key.length === 1) {
        e.preventDefault();
        setSelectedChar(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setSelectedChar]);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ marginRight: 8 }}>Pick character:</span>
      {presetChars.map((char) => (
        <button
          key={char}
          onClick={() => setSelectedChar(char)}
          style={{
            fontSize: 16,
            marginRight: 4,
            background: selectedChar === char ? '#888' : '#222',
            color: '#fff',
            border: '1px solid #444',
            height: 32,
            cursor: 'pointer',
          }}
        >
          {char === ' ' ? <>&nbsp;</> : char}
        </button>
      ))}
      <input
        ref={inputRef}
        type="text"
        maxLength={1}
        value={selectedChar}
        onChange={e => setSelectedChar(e.target.value)}
        onFocus={handleFocus}
        style={{
          width: 32,
          height: 32,
          fontFamily: 'monospace',
          fontSize: 18,
          marginLeft: 8,
          textAlign: 'center',
        }}
      />
    </div>
  );
};

export default CharacterPicker; 