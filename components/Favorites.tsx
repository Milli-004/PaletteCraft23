
import React from 'react';
import { Palette } from '../types';

interface FavoritesProps {
  favorites: Palette[];
  onSelect: (palette: Palette) => void;
  onClear: () => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, onSelect, onClear }) => {
  if (favorites.length === 0) {
    return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Favorites</h2>
            <p>You have no favorite palettes yet.</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Favorites</h2>
        <button
          onClick={onClear}
          className="text-sm font-medium text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((palette, index) => (
          <div
            key={index}
            onClick={() => onSelect(palette)}
            className="cursor-pointer p-2 bg-white/50 dark:bg-black/20 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div className="flex h-10 rounded-md overflow-hidden">
              {palette.map((color) => (
                <div
                  key={color.hex}
                  className="w-full h-full"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
