import React from 'react';

type CharacterPickerProps = {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
};

const presetChars = ['#', '.', '@', '+', '-', '|', '~', ' '];

const CharacterPicker: React.FC<CharacterPickerProps> = ({ selectedChar, setSelectedChar }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ marginRight: 8 }}>Pick character:</span>
      {presetChars.map((char) => (
        <button
          key={char}
          onClick={() => setSelectedChar(char)}
          style={{
            fontFamily: 'monospace',
            fontSize: 18,
            marginRight: 4,
            background: selectedChar === char ? '#888' : '#222',
            color: '#fff',
            border: '1px solid #444',
            width: 32,
            height: 32,
            cursor: 'pointer',
          }}
        >
          {char === ' ' ? <>&nbsp;</> : char}
        </button>
      ))}
      <input
        type="text"
        maxLength={1}
        value={selectedChar}
        onChange={e => setSelectedChar(e.target.value)}
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