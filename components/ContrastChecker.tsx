
import React from 'react';
import { Palette } from '../types';
import { getContrastRatio, getContrastRating } from '../utils/colorUtils';

interface ContrastCheckerProps {
  palette: Palette;
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({ palette }) => {
  return (
    <div className="w-full max-w-4xl mt-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-xl font-bold mb-4 text-center">Contrast Grid</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300 dark:border-gray-600"></th>
              {palette.map((color, index) => (
                <th key={index} className="p-2 border border-gray-300 dark:border-gray-600">
                  <div className="w-8 h-8 mx-auto rounded-full" style={{ backgroundColor: color.hex }}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {palette.map((rowColor, rowIndex) => (
              <tr key={rowIndex}>
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  <div className="w-8 h-8 mx-auto rounded-full" style={{ backgroundColor: rowColor.hex }}></div>
                </th>
                {palette.map((colColor, colIndex) => {
                  if (rowIndex === colIndex) {
                    return (
                      <td key={colIndex} className="p-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">-</td>
                    );
                  }
                  const ratio = getContrastRatio(rowColor.hex, colColor.hex);
                  const { rating, color } = getContrastRating(ratio);
                  return (
                    <td key={colIndex} className="p-2 border border-gray-300 dark:border-gray-600">
                      <div className="flex flex-col items-center">
                        <span>{ratio.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 mt-1 text-xs font-bold text-white rounded-full ${color}`}>
                          {rating}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
