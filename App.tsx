import React, { useState, useCallback } from 'react';
import { Palette } from './types';
import { generatePalette } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ThemeToggle } from './components/ThemeToggle';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { PromptSuggestions } from './components/PromptSuggestions';
import { ImageUploader } from './components/ImageUploader';
import { PaletteDisplay } from './components/PaletteDisplay';
import { ContrastChecker } from './components/ContrastChecker';
import { ThemePreview } from './components/ThemePreview';
import { ExportPalette } from './components/ExportPalette';
import { Favorites } from './components/Favorites';

function App() {
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPalettes, setSavedPalettes] = useLocalStorage<Palette[]>('saved-palettes', []);

  const handleGeneratePalette = useCallback(async (theme: string) => {
    if (!theme.trim()) return;
    setIsLoading(true);
    setError(null);
    setPalette(null);

    try {
      const newPalette = await generatePalette(theme);
      setPalette(newPalette);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGeneratePalette(prompt);
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    handleGeneratePalette(suggestion);
  };

  const handlePaletteGenerated = (newPalette: Palette) => {
    setPalette(newPalette);
    setError(null);
  };

  const isPaletteSaved = palette && savedPalettes.some(p => JSON.stringify(p.map(c => c.hex)) === JSON.stringify(palette.map(c => c.hex)));

  const handleSavePalette = () => {
    if (palette && !isPaletteSaved) {
      setSavedPalettes(prev => [palette, ...prev]);
    }
  };
  
  const handleSelectFavorite = (selectedPalette: Palette) => {
    setPalette(selectedPalette);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearFavorites = () => {
    setSavedPalettes([]);
  };

  const handleColorUpdate = (index: number, newHex: string) => {
    if (!palette) return;
    const newPalette = [...palette];
    newPalette[index] = { ...newPalette[index], hex: newHex };
    setPalette(newPalette);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary dark:text-brand-secondary">PaletteCraft AI</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-lg text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 animate-fade-in">
            Generate beautiful color palettes with AI
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Describe a theme, upload an image, or get inspired.
          </p>
        </div>

        <div className="w-full max-w-lg mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Misty Forest Morning'"
              className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-secondary transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary-dark dark:bg-brand-secondary dark:hover:bg-brand-secondary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
              disabled={isLoading}
              aria-label="Generate palette"
            >
              <SparklesIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        {!palette && !isLoading && <PromptSuggestions onSelect={handleSelectSuggestion} />}
        
        <div className="my-4 text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '300ms' }}>OR</div>
        
        <ImageUploader onPaletteGenerated={handlePaletteGenerated} setIsLoading={setIsLoading} setError={setError} />

        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary dark:border-brand-secondary"></div>
            <p className="mt-4 text-lg">Generating your palette...</p>
          </div>
        )}

        {error && (
          <div className="mt-12 text-center text-red-500 bg-red-100 dark:bg-red-900/50 border border-red-500 rounded-lg p-4">
            <p className="font-bold">Oops! Something went wrong.</p>
            <p>{error}</p>
          </div>
        )}
        
        {palette && (
          <div className="w-full flex flex-col items-center mt-12">
            <PaletteDisplay palette={palette} onSave={handleSavePalette} isSaved={!!isPaletteSaved} onColorUpdate={handleColorUpdate} />
            <ContrastChecker palette={palette} />
            <ThemePreview palette={palette} />
            <ExportPalette palette={palette} />
          </div>
        )}

        {savedPalettes.length > 0 && (
          <Favorites favorites={savedPalettes} onSelect={handleSelectFavorite} onClear={handleClearFavorites} />
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        <p>Powered by Gemini. Built by an AI enthusiast.</p>
      </footer>
    </div>
  );
}

export default App;