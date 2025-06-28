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
      // Space
      ' ',
      // Punctuation
      '#', '@', '.', '"', "'", '*', '!', '$', '%', '&', '(', ')', '+', ',', '-', '/',
      ':', ';', '<', '=', '>', '?', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~',
      // Currency
      '£', '€', '¥', '¢',
      // Legal
      '§', '©', '®', '™'
    ]
  },
  boxDrawing: {
    name: 'Box Drawing',
    chars: [
      // Light lines
      '─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼',
      // Double lines
      '═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬',
      // Heavy lines
      '━', '┃', '┏', '┓', '┗', '┛', '┣', '┫', '┳', '┻', '╋',
      // Mixed lines
      '╭', '╮', '╰', '╯', '╱', '╲', '╳', '╴', '╵', '╶', '╷'    ]
  },
  blockElements: {
    name: 'Block Elements',
    chars: [
      // Full blocks
      '█', '▇', '▆', '▅', '▄', '▃', '▂', '▁', '▀',
      // Shaded blocks
      '▓', '▒', '░',
      // Upper blocks
      '▔', '▕', '▖', '▗', '▘', '▙', '▚', '▛', '▜', '▝', '▞', '▟',
      // Lower blocks
      '▌', '▍', '▎', '▏', '▐',
      // Other blocks
      '▉', '▊', '▋'
    ]
  },
  geometricShapes: {
    name: 'Geometric',
    chars: [
      // Circles
      '○', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗', '◘', '◙',
      // Squares
      '□', '■', '▢', '▣', '▤', '▥', '▦', '▧', '▨', '▩',
      // Diamonds
      '◇', '◆', '◊', '◈',
      // Triangles
      '△', '▲', '▽', '▼', '◁', '◀', '▷', '▶', '◂', '◃', '▸', '▹',
      // Other shapes
      '◯', '◉', '◎'
    ]
  },
  stars: {
    name: 'Stars',
    chars: [
      '☆', '★', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰',
      '✱', '✲', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺',
      '✻', '✼', '✽', '✾', '✿', '❀', '❁', '❂', '❃', '❄',
      '❅', '❆', '❇', '❈', '❉', '❊', '❋'
    ]
  },
  arrows: {
    name: 'Arrows',
    chars: [
      // Simple arrows
      '←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙',
      // Double arrows
      '⇐', '⇑', '⇒', '⇓', '⇔', '⇕', '⇖', '⇗', '⇘', '⇙',
      // Heavy arrows
      '⇦', '⇧', '⇨', '⇩',
      // Other arrows
      '➔', '➘', '➙', '➚', '➛', '➜', '➝', '➞', '➟', '➠', '➡', '➢', '➣', '➤', '➥', '➦', '➧', '➨', '➩', '➪', '➫', '➬', '➭', '➮', '➯', '➱'
    ]
  },
  math: {
    name: 'Math',
    chars: [
      // Basic operators
      '+', '-', '×', '÷', '=', '≠', '≈', '≤', '≥', '±', '∞',
      // Greek letters (common ones)
      'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'ω',
      'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Θ', 'Λ', 'Π', 'Σ', 'Φ', 'Ω',
      // Other useful symbols
      '∑', '∏', '√', '∫', '∆', '∇', '∂', '∅', '∈', '∉', '∋', '∌',
      '∧', '∨', '∩', '∪', '∴', '∵', '∼', '∽', '≅', '≃', '≄', '≅',
      '⊂', '⊃', '⊆', '⊇', '⊊', '⊋', '⊕', '⊗', '⊙', '⊖'
    ]
  },
  cards: {
    name: 'Cards',
    chars: [
      '♠', '♣', '♥', '♦', '♤', '♧', '♡', '♢',
      '🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮'
    ]
  },
  misc: {
    name: 'Misc',
    chars: [
      '☺', '☻', '•', '◦', '‣', '⁃', '⁌', '⁍', '·', '⋅',
      '☀', '☁', '☂', '☃', '☄', '☎', '☏', '☐', '☑', '☒', '☓', '☖', '☗', '☘', '☙', '☚', '☛', '☜', '☞', '☟', '☠', '☡', '☢', '☣', '☤', '☥', '☦', '☧', '☨', '☩', '☪', '☫', '☬', '☭', '☮', '☯', '☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷', '☸', '☹', '☼', '☽', '☾', '☿', '♀', '♂', '♁', '⚢', '⚣', '⚤', '⚥', '⚦', '⚧', '⚨', '⚩', '⚬', '⚭', '⚮', '⚯', '⚰', '⚱', '⚲', '⚳', '⚴', '⚵', '⚶', '⚷', '⚸', '⚹', '⚺', '⚻', '⚼', '⚿', '⛀', '⛁', '⛂', '⛃', '⛆', '⛇', '⛈', '⛉', '⛊', '⛋', '⛌', '⛍', '⛏', '⛐', '⛑', '⛒', '⛓', '⛕', '⛖', '⛗', '⛘', '⛙', '⛚', '⛛', '⛜', '⛝', '⛞', '⛟', '⛠', '⛡', '⛢', '⛣', '⛤', '⛥', '⛦', '⛧', '⛨', '⛩', '⛫', '⛬', '⛭', '⛮', '⛯', '⛰', '⛱', '⛴', '⛶', '⛷', '⛸', '⛻', '⛼', '⛾', '⛿'
    ]
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
      if (e.ctrlKey || e.metaKey) return;
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