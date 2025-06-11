import React, { useEffect } from 'react';
import './CharacterPicker.css';

type CharacterPickerProps = {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
};

// Character categories
const characterCategories = {
  symbols: {
    name: 'Symbols',
    chars: [
      // Punctuation
      '#', '@', '.', '"', "'", '*', '!', '$', '%', '&', '(', ')', '+', ',', '-', '/',
      ':', ';', '<', '=', '>', '?', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~',
      // Currency
      '£', '€', '¥', '¢',
      // Legal
      '§', '©', '®', '™',
      // Space
      ' '
    ]
  },
  borders: {
    name: 'Borders',
    chars: ['─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬']
  },
  blocks: {
    name: 'Blocks',
    chars: ['▀', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▉', '▊', '▋', '▌', '▍', '▎', '▏', '▐', '░', '▒', '▓']
  },
  arrows: {
    name: 'Arrows',
    chars: ['←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '⇐', '⇑', '⇒', '⇓', '⇔', '⇕']
  },
  math: {
    name: 'Math',
    chars: ['+', '-', '×', '÷', '=', '≠', '≈', '≤', '≥', '±', '∞', '∑', '∏', '√', '∫', '∆', '∇']
  },
  misc: {
    name: 'Misc',
    chars: ['•', '○', '●', '◎', '◇', '◆', '□', '■', '△', '▲', '▽', '▼', '☆', '★', '☺', '☻', '☼', '☽', '☾', '♠', '♣', '♥', '♦']
  },
  common: {
    name: 'Common',
    chars: [
      // Numbers
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      // Uppercase
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      // Lowercase
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]
  },
};

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
    <div className="character-categories">
      {Object.entries(characterCategories).map(([key, category]) => (
        <div key={key} className="character-category">
          <div className="category-name">{category.name}</div>
          <div className="character-grid">
            {category.chars.map((char) => (
              <button
                key={char}
                onClick={() => setSelectedChar(char)}
                className={`character-swatch ${selectedChar === char ? 'selected' : ''}`}
              >
                {char === ' ' ? <>&nbsp;</> : char}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterPicker; 