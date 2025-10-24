import React from 'react';

interface PromptSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  'Misty Forest Morning',
  'Cyberpunk Cityscape',
  'Autumn Bonfire',
  'Tropical Beach Sunset',
  'Vintage Bookstore',
  'Cosmic Galaxy',
];

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-lg text-center mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Or try one of these:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            onClick={() => onSelect(text)}
            className="px-4 py-1.5 bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-600/50 rounded-full text-sm hover:bg-brand-primary/10 hover:border-brand-primary dark:hover:bg-brand-secondary/10 dark:hover:border-brand-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};