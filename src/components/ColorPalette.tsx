import React from 'react';
import './ColorPalette.css';

interface ColorPaletteProps {
  value: string;
  onChange: (color: string) => void;
  mode: 'foreground' | 'background';
}

// Color categories with descriptive names
const colorCategories = {
  basic: {
    colors: [
      '#000000', '#FFFFFF', '#808080', // Black, White, Gray
      '#FF0000', '#00FF00', '#0000FF', // Red, Green, Blue
      '#FFFF00', '#00FFFF', '#FF00FF', // Yellow, Cyan, Magenta
    ]
  },
  pastels: {
    colors: [
      '#FFB6C1', '#FFC0CB', '#FFDAB9', // Light Pink, Pink, Peach
      '#E6E6FA', '#F0F8FF', '#F5F5DC', // Lavender, Alice Blue, Beige
      '#98FB98', '#AFEEEE', '#FFE4E1', // Pale Green, Pale Turquoise, Misty Rose
    ]
  },
  dark: {
    colors: [
      '#1A1A1A', '#2F4F4F', '#483D8B', // Dark Gray, Dark Slate, Dark Slate Blue
      '#4B0082', '#800000', '#8B0000', // Indigo, Maroon, Dark Red
      '#556B2F', '#006400', '#8B4513', // Dark Olive, Dark Green, Saddle Brown
    ]
  },
  vibrant: {
    colors: [
      '#FF4500', '#FF8C00', '#FFD700', // Orange Red, Dark Orange, Gold
      '#32CD32', '#00CED1', '#4169E1', // Lime Green, Dark Turquoise, Royal Blue
      '#FF1493', '#9932CC', '#FF69B4', // Deep Pink, Dark Orchid, Hot Pink
    ]
  }
};

const ColorPalette: React.FC<ColorPaletteProps> = ({ value, onChange, mode }) => {
  return (      
    <div className="color-categories">
      {Object.entries(colorCategories).map(([key, category]) => (
        <div key={key} className="color-grid">
          {category.colors.map(color => (
            <button
              key={color}
              className={`color-swatch ${value === color ? 'selected' : ''}`}
              style={{ 
                background: color,
                border: `2px solid ${value === color ? '#fff' : 'transparent'}`
              }}
              onClick={() => onChange(color)}
              aria-label={`Select ${color} as ${mode} color`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ColorPalette; 