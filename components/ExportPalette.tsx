import React, { useState } from 'react';
import { Palette } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface ExportPaletteProps {
  palette: Palette;
}

type Format = 'css' | 'scss' | 'json';

export const ExportPalette: React.FC<ExportPaletteProps> = ({ palette }) => {
  const [copiedFormat, setCopiedFormat] = useState<Format | null>(null);

  const generateCode = (format: Format): string => {
    switch (format) {
      case 'css':
        return palette.map(c => `--color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n');
      case 'scss':
        return palette.map(c => `$color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n');
      case 'json':
        return JSON.stringify(palette, null, 2);
      default:
        return '';
    }
  };

  const handleCopy = (format: Format) => {
    const code = generateCode(format);
    navigator.clipboard.writeText(code).then(() => {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2500);
    });
  };
  
  const renderCopyButton = (format: Format, label: string) => (
      <button 
        onClick={() => handleCopy(format)}
        className="relative w-full text-left p-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-semibold">{label}</span>
        {copiedFormat === format && (
          <div className="absolute inset-0 bg-green-500/80 rounded-lg flex items-center justify-center text-white font-bold animate-scale-in">
            <CheckIcon className="w-5 h-5 mr-1" />
            Copied!
          </div>
        )}
      </button>
  );

  return (
    <div className="w-full max-w-4xl mt-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-xl font-bold mb-4 text-center">Export Palette</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderCopyButton('css', 'CSS Variables')}
        {renderCopyButton('scss', 'SCSS Variables')}
        {renderCopyButton('json', 'JSON')}
      </div>
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg max-h-48 overflow-auto">
        <pre className="text-sm whitespace-pre-wrap">
          <code className="font-mono">
            {generateCode(copiedFormat || 'css')}
          </code>
        </pre>
      </div>
    </div>
  );
};