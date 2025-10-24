import React from 'react';
import { Palette } from '../types';
import { PaletteCard } from './PaletteCard';
import { SaveIcon } from './icons/SaveIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PaletteDisplayProps {
  palette: Palette;
  onSave: () => void;
  isSaved: boolean;
  onColorUpdate: (index: number, newHex: string) => void;
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, onSave, isSaved, onColorUpdate }) => {
  return (
    <div className="w-full max-w-4xl opacity-0 animate-fade-in-up">
      <div className="flex justify-center mb-4">
        <button
          onClick={onSave}
          disabled={isSaved}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-primary-dark dark:bg-brand-secondary dark:hover:bg-brand-secondary-dark disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
        >
          {isSaved ? (
            <>
              <CheckIcon className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <SaveIcon className="w-5 h-5" />
              Save Palette
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {palette.map((color, index) => (
          <PaletteCard
            key={`${color.hex}-${index}`}
            color={color}
            index={index}
            onColorUpdate={onColorUpdate}
          />
        ))}
      </div>
    </div>
  );
};