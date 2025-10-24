import React, { useState, useEffect, useRef } from 'react';
import { Color } from '../types';
import { getContrastRatio } from '../utils/colorUtils';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PaletteCardProps {
  color: Color;
  index: number;
  onColorUpdate: (index: number, newHex: string) => void;
}

export const PaletteCard: React.FC<PaletteCardProps> = ({ color, index, onColorUpdate }) => {
  const [textColor, setTextColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Determine the best text color (black or white) for contrast
    const whiteContrast = getContrastRatio(color.hex, '#ffffff');
    const blackContrast = getContrastRatio(color.hex, '#000000');
    setTextColor(whiteContrast > blackContrast ? '#ffffff' : '#000000');
  }, [color.hex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCardClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorUpdate(index, e.target.value);
  };

  return (
    <div
      className="relative h-48 rounded-lg shadow-md flex flex-col justify-end p-4 text-white overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer opacity-0 animate-fade-in-up"
      style={{ backgroundColor: color.hex, color: textColor, animationDelay: `${index * 75}ms` }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Change color for ${color.name}`}
    >
      <input
        type="color"
        ref={colorInputRef}
        value={color.hex}
        onChange={handleColorInputChange}
        className="absolute top-0 left-0 w-0 h-0 opacity-0"
        aria-hidden="true"
      />
      <div className="z-10">
        <p className="font-bold text-lg leading-tight">{color.name}</p>
        <p className="font-mono text-sm opacity-80">{color.hex}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Copy hex code ${color.hex}`}
      >
        {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
      </button>
    </div>
  );
};