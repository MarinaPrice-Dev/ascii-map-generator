import React from 'react';
import CharacterPicker from './CharacterPicker';

interface FooterProps {
  selectedChar: string;
  setSelectedChar: (char: string) => void;
  selectedFg: string;
  setSelectedFg: (color: string) => void;
  selectedBg: string;
  setSelectedBg: (color: string) => void;
  fgPresets: string[];
  bgPresets: string[];
}

const Footer: React.FC<FooterProps> = ({
  selectedChar,
  setSelectedChar,
  selectedFg,
  setSelectedFg,
  selectedBg,
  setSelectedBg,
  fgPresets,
  bgPresets,
}) => {
  return (
    <footer style={{ height: 150, borderTop: '1px solid var(--border)', background: 'var(--footer-bg)', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 14 }}>Text</span>
            <input type="color" value={selectedFg} onChange={e => setSelectedFg(e.target.value)} />
            {fgPresets.map(color => (
              <button key={color} style={{ background: color, width: 20, height: 20, border: selectedFg === color ? '2px solid #888' : '1px solid #444', marginLeft: 2, cursor: 'pointer' }} onClick={() => setSelectedFg(color)} />
            ))}
          </label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 14 }}>Background</span>
            <input type="color" value={selectedBg} onChange={e => setSelectedBg(e.target.value)} />
            {bgPresets.map(color => (
              <button key={color} style={{ background: color, width: 20, height: 20, border: selectedBg === color ? '2px solid #888' : '1px solid #444', marginLeft: 2, cursor: 'pointer' }} onClick={() => setSelectedBg(color)} />
            ))}
          </label>
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <CharacterPicker selectedChar={selectedChar} setSelectedChar={setSelectedChar} />
      </div>
    </footer>
  );
};

export default Footer; 