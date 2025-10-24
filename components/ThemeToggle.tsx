import React, { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

type Theme = 'light' | 'dark';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-dark-text/80 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-dark-bg transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <SunIcon className={`w-6 h-6 absolute transition-all duration-300 ease-in-out ${theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} />
      <MoonIcon className={`w-6 h-6 absolute transition-all duration-300 ease-in-out ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`} />
    </button>
  );
};