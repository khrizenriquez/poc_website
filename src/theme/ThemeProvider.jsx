import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { themeConfig } from '../config/theme';

const ThemeContext = createContext(null);
export function normalizeTheme(value) {
  return themeConfig.preferences.includes(value) ? value : themeConfig.defaultPreference;
}
function readPreference() {
  try {
    return normalizeTheme(window.localStorage.getItem(themeConfig.storageKey));
  } catch {
    return themeConfig.defaultPreference;
  }
}
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference);
  const [media] = useState(() => window.matchMedia?.(themeConfig.mediaQuery));
  const [systemDark, setSystemDark] = useState(() => media?.matches ?? false);
  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    const update = (event) => setSystemDark(event.matches);
    media?.addEventListener('change', update);
    // Reconcile changes between render and subscribing.
    setSystemDark(media?.matches ?? false);
    return () => media?.removeEventListener('change', update);
  }, [media]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key !== null && event.key !== themeConfig.storageKey) return;
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch {
        return;
      }
      setPreference(normalizeTheme(event.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeConfig.colors[theme]);
  }, [theme]);

  function changePreference(value) {
    const next = normalizeTheme(value);
    setPreference(next);
    try {
      window.localStorage.setItem(themeConfig.storageKey, next);
    } catch {
      // The selection still works in memory when browser storage is blocked/full.
    }
  }
  return (
    <ThemeContext.Provider value={{ preference, theme, changePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme requires ThemeProvider');
  return context;
}
