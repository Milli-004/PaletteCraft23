
import React from 'react';
import { Palette } from '../types';

interface ThemePreviewProps {
  palette: Palette;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ palette }) => {
  if (palette.length < 5) return null;

  // A simple heuristic to assign roles.
  const [primary, secondary, background, text, accent] = palette;

  return (
    <div className="w-full max-w-4xl mt-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <h3 className="text-xl font-bold mb-4 text-center">Theme Preview</h3>
      <div
        className="rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        style={{ backgroundColor: background.hex, color: text.hex }}
      >
        <h4 className="text-2xl font-bold mb-2" style={{ color: primary.hex }}>
          Example Header
        </h4>
        <p className="mb-4" style={{ color: text.hex }}>
          This is some example paragraph text to demonstrate the color palette. 
          The quick brown fox jumps over the lazy dog.
        </p>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 rounded-md font-semibold"
            style={{ backgroundColor: primary.hex, color: background.hex }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 rounded-md font-semibold"
            style={{ backgroundColor: secondary.hex, color: text.hex }}
          >
            Secondary Button
          </button>
           <a href="#" className="self-center font-semibold" style={{ color: accent.hex }}>
            Accent Link
          </a>
        </div>
      </div>
    </div>
  );
};
