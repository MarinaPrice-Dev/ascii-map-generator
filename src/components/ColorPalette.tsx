import React from 'react';
import './ColorPalette.css';

type ColorPaletteProps = {
  value: string;
  onChange: (color: string) => void;
  mode: 'foreground' | 'background';
};

// Color categories with different shades
const colorCategories = {
  grayscale: {
    name: 'Grayscale',
    colors: [
      '#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCC', '#BBBBBB',
      '#AAAAAA', '#999999', '#888888', '#777777', '#666666',
      '#555555', '#444444', '#333333', '#222222', '#000000'
    ]
  },
  reds: {
    name: 'Reds',
    colors: [
      '#FFE5E5', '#FFCCCC', '#FFB3B3', '#FF9999', '#FF8080',
      '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000',
      '#E60000', '#CC0000', '#990000', '#660000', '#330000'
    ]
  },
  browns: {
    name: 'Browns',
    colors: [
      '#FFF2E5', '#FFE6CC', '#FFD9B3', '#FFCC99', '#FFBF80',
      '#FFB366', '#FFA64D', '#FF9933', '#FF8C1A', '#FF8000',
      '#E65C00', '#CC5200', '#993D00', '#662900', '#331400'
    ]
  },
  yellows: {
    name: 'Yellows',
    colors: [
      '#FFFFE5', '#FFFFCC', '#FFFFB3', '#FFFF99', '#FFFF80',
      '#FFFF66', '#FFFF4D', '#FFFF33', '#FFFF1A', '#FFFF00',
      '#E6E600', '#CCCC00', '#999900', '#666600', '#333300'
    ]
  },
  greens: {
    name: 'Greens',
    colors: [
      '#E5FFE5', '#CCFFCC', '#B3FFB3', '#99FF99', '#80FF80',
      '#66FF66', '#4DFF4D', '#33FF33', '#1AFF1A', '#00FF00',
      '#00E600', '#00CC00', '#009900', '#006600', '#003300'
    ]
  },
  cyans: {
    name: 'Cyans',
    colors: [
      '#E5FFFF', '#CCFFFF', '#B3FFFF', '#99FFFF', '#80FFFF',
      '#66FFFF', '#4DFFFF', '#33FFFF', '#1AFFFF', '#00FFFF',
      '#00E6E6', '#00CCCC', '#009999', '#006666', '#003333'
    ]
  },
  blues: {
    name: 'Blues',
    colors: [
      '#E5E5FF', '#CCCCFF', '#B3B3FF', '#9999FF', '#8080FF',
      '#6666FF', '#4D4DFF', '#3333FF', '#1A1AFF', '#0000FF',
      '#0000E6', '#0000CC', '#000099', '#000066', '#000033'
    ]
  },
  magentas: {
    name: 'Magentas',
    colors: [
      '#FFE5FF', '#FFCCFF', '#FFB3FF', '#FF99FF', '#FF80FF',
      '#FF66FF', '#FF4DFF', '#FF33FF', '#FF1AFF', '#FF00FF',
      '#E600E6', '#CC00CC', '#990099', '#660066', '#330033'
    ]
  }
};

const ColorPalette: React.FC<ColorPaletteProps> = ({ value, onChange }) => {
  return (
    <div className="color-palette">
      <div className="color-categories">
        {Object.entries(colorCategories).map(([key, category]) => (
          <div key={key} className="color-category">
            <div className="color-grid">
              {category.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onChange(color)}
                  className={`color-swatch ${value === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette; 