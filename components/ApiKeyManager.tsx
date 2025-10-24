import React, { useEffect, useState } from 'react';

export const ApiKeyManager: React.FC = () => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = typeof window !== 'undefined' ? window.localStorage.getItem('GEMINI_API_KEY') : '';
    if (existing) setKey(existing);
  }, []);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (key.trim()) {
        window.localStorage.setItem('GEMINI_API_KEY', key.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } else {
        window.localStorage.removeItem('GEMINI_API_KEY');
      }
    }
  };

  return (
    <form onSubmit={onSave} className="flex items-center gap-2">
      <input
        type="password"
        placeholder="Gemini API key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-black/20 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-secondary"
      />
      <button
        type="submit"
        className="px-3 py-2 rounded-md text-sm font-semibold bg-brand-primary text-white dark:bg-brand-secondary hover:opacity-90"
        aria-label="Save API key"
      >
        {saved ? 'Saved' : 'Save'}
      </button>
    </form>
  );
};

