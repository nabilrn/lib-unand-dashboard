import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLocale, getDictionary, interpolate, isLocaleCode, LocaleCode, localeOptions } from './locales';

const LS_KEY = 'library_dashboard_locale_v1';

interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  dir: 'ltr' | 'rtl';
  localeOptions: typeof localeOptions;
  dictionary: ReturnType<typeof getDictionary>;
  t: (path: string, values?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function readInitialLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (isLocaleCode(saved)) return saved;
  } catch {
    return defaultLocale;
  }
  return defaultLocale;
}

function readPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(readInitialLocale);
  const option = localeOptions.find((item) => item.code === locale) ?? localeOptions[0];
  const dictionary = getDictionary(locale);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, locale);
    } catch {
      // localStorage is optional for static display environments.
    }
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.documentElement.dir = option.dir;
    document.title = dictionary.app.title;
  }, [dictionary.app.title, locale, option.dir]);

  const value = useMemo<LocaleContextValue>(() => {
    const t = (path: string, values?: Record<string, string | number>) => {
      const localized = readPath(dictionary, path);
      const fallback = readPath(getDictionary(defaultLocale), path);
      const template = typeof localized === 'string'
        ? localized
        : typeof fallback === 'string'
          ? fallback
          : path;
      return interpolate(template, values);
    };

    return {
      locale,
      setLocale: setLocaleState,
      dir: option.dir,
      localeOptions,
      dictionary,
      t,
    };
  }, [dictionary, locale, option.dir]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
