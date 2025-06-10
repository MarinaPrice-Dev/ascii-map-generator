import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, presets }) => {
  return (
    <label className="color-picker">
      <span className="color-picker-label">{label}</span>
      <input 
        type="color" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        aria-label={`Select ${label} color`}
      />
      {presets.map(color => (
        <button
          key={color}
          className={`color-preset ${value === color ? 'selected' : ''}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
          aria-label={`Select ${color} as ${label} color`}
        />
      ))}
    </label>
  );
};

export default ColorPicker; 