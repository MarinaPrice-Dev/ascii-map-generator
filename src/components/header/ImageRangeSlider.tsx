import React from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onApply: () => void;
}

const ImageRangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  min,
  max,
  onChange,
  onApply
}) => {
  return (
    <div className="option-group">
      <div className="range-header">
        <label>{label}: {value}</label>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseUp={onApply}
          onTouchEnd={onApply}
        />
      </div>
    </div>
  );
};

export default ImageRangeSlider; 