import React from 'react';
import './ColorPalette.css';

type ColorPaletteProps = {
  value: string;
  onChange: (color: string) => void;
  mode: 'foreground' | 'background';
};

// Color categories with different shades - 3 light, 8 medium, 4 dark per category
const colorCategories = {
  grayscale: {
    name: 'Grayscale',
    colors: [
      '#FFFFFF', '#F5F5F5', '#E8E8E8', // Light (3)
      '#D4D4D4', '#C0C0C0', '#ACACAC', '#989898', '#848484', '#707070', '#5C5C5C', '#484848', // Medium (8)
      '#343434', '#222222', '#1A1A1A', '#000000' // Dark (4)
    ]
  },
  reds: {
    name: 'Reds',
    colors: [
      '#FFE5E5', '#FFCCCC', '#FFB3B3', // Light (3)
      '#FF9999', '#FF8080', '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000', '#E60000', // Medium (8)
      '#CC0000', '#990000', '#660000', '#330000' // Dark (4)
    ]
  },
  oranges: {
    name: 'Oranges',
    colors: [
      '#FFF2E5', '#FFE6CC', '#FFD9B3', // Light (3)
      '#FFCC99', '#FFBF80', '#FFB366', '#FFA64D', '#FF9933', '#FF8C1A', '#FF8000', '#E65C00', // Medium (8)
      '#CC5200', '#993D00', '#662900', '#331400' // Dark (4)
    ]
  },
  yellows: {
    name: 'Yellows',
    colors: [
      '#FFFFE5', '#FFFFCC', '#FFFFB3', // Light (3)
      '#FFFF99', '#FFFF80', '#FFFF66', '#FFFF4D', '#FFFF33', '#FFFF1A', '#FFFF00', '#E6E600', // Medium (8)
      '#CCCC00', '#999900', '#666600', '#333300' // Dark (4)
    ]
  },
  lime: {
    name: 'Lime',
    colors: [
      '#F0FFE5', '#E6FFCC', '#DCFFB3', // Light (3)
      '#D2FF99', '#C8FF80', '#BEFF66', '#B4FF4D', '#AAFF33', '#A0FF1A', '#96FF00', '#87E600', // Medium (8)
      '#78CC00', '#599900', '#3A6600', '#1B3300' // Dark (4)
    ]
  },
  greens: {
    name: 'Greens',
    colors: [
      '#E5FFE5', '#CCFFCC', '#B3FFB3', // Light (3)
      '#99FF99', '#80FF80', '#66FF66', '#4DFF4D', '#33FF33', '#1AFF1A', '#00FF00', '#00E600', // Medium (8)
      '#00CC00', '#009900', '#006600', '#003300' // Dark (4)
    ]
  },
  cyans: {
    name: 'Cyans',
    colors: [
      '#E5FFFF', '#CCFFFF', '#B3FFFF', // Light (3)
      '#99FFFF', '#80FFFF', '#66FFFF', '#4DFFFF', '#33FFFF', '#1AFFFF', '#00FFFF', '#00E6E6', // Medium (8)
      '#00CCCC', '#009999', '#006666', '#003333' // Dark (4)
    ]
  },
  blues: {
    name: 'Blues',
    colors: [
      '#E5E5FF', '#CCCCFF', '#B3B3FF', // Light (3)
      '#9999FF', '#8080FF', '#6666FF', '#4D4DFF', '#3333FF', '#1A1AFF', '#0000FF', '#0000E6', // Medium (8)
      '#0000CC', '#000099', '#000066', '#000033' // Dark (4)
    ]
  },
  purples: {
    name: 'Purples',
    colors: [
      '#F0E5FF', '#E6CCFF', '#DCB3FF', // Light (3)
      '#D299FF', '#C880FF', '#BE66FF', '#B44DFF', '#AA33FF', '#A01AFF', '#9600FF', '#8700E6', // Medium (8)
      '#7800CC', '#590099', '#3A0066', '#1B0033' // Dark (4)
    ]
  },
  magentas: {
    name: 'Magentas',
    colors: [
      '#FFE5FF', '#FFCCFF', '#FFB3FF', // Light (3)
      '#FF99FF', '#FF80FF', '#FF66FF', '#FF4DFF', '#FF33FF', '#FF1AFF', '#FF00FF', '#E600E6', // Medium (8)
      '#CC00CC', '#990099', '#660066', '#330033' // Dark (4)
    ]
  },
  pinks: {
    name: 'Pinks',
    colors: [
      '#FFE5F0', '#FFCCE6', '#FFB3DC', // Light (3)
      '#FF99D2', '#FF80C8', '#FF66BE', '#FF4DB4', '#FF33AA', '#FF1AA0', '#FF0096', '#E60087', // Medium (8)
      '#CC0078', '#990059', '#66003A', '#33001B' // Dark (4)
    ]
  },
  browns: {
    name: 'Browns',
    colors: [
      '#F5E6D4', '#EBD4B8', '#E1C29C', // Light (3)
      '#D7B080', '#CD9E64', '#C38C48', '#B97A2C', '#AF6810', '#A55600', '#9B4400', '#8B3D00', // Medium (8)
      '#7B3600', '#5B2800', '#3B1A00', '#1B0C00' // Dark (4)
    ]
  },
  warmGrays: {
    name: 'Warm Grays',
    colors: [
      '#F5F3F0', '#E8E4E0', '#DBD5D0', // Light (3)
      '#CEC6C0', '#C1B7B0', '#B4A8A0', '#A79990', '#9A8A80', '#8D7B70', '#806C60', '#735D50', // Medium (8)
      '#664E40', '#593F30', '#4C3020', '#3F2110' // Dark (4)
    ]
  },
  coolGrays: {
    name: 'Cool Grays',
    colors: [
      '#F0F2F5', '#E0E4E8', '#D0D6DB', // Light (3)
      '#C0C8CE', '#B0BAC1', '#A0ACB4', '#909EA7', '#80909A', '#70828D', '#607480', '#506673', // Medium (8)
      '#405866', '#304A59', '#203C4C', '#102E3F' // Dark (4)
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