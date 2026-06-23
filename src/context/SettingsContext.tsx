import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface SettingsContextValue {
  quote: string;
  setQuote: (q: string) => void;
  resetQuote: () => void;
}

const DEFAULT_QUOTE = 'Knowledge is a treasure, but practice is the key to it';
const LS_KEY = 'library_dashboard_quote_v1';

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [quote, setQuoteState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_QUOTE;
    } catch {
      return DEFAULT_QUOTE;
    }
  });

  // Persist to localStorage when quote changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(quote));
    } catch {/* ignore */}
  }, [quote]);

  const setQuote = useCallback((q: string) => {
    setQuoteState(q.trim() === '' ? DEFAULT_QUOTE : q);
  }, []);

  const resetQuote = useCallback(() => setQuoteState(DEFAULT_QUOTE), []);

  const value: SettingsContextValue = { quote, setQuote, resetQuote };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

export { DEFAULT_QUOTE };
