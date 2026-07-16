import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { emberThemes } from '../themes/themes.js';

const ThemeContext = createContext(null);
const storageKey = 'ember-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'ember-1';
  const stored = window.localStorage.getItem(storageKey);
  return emberThemes.some((theme) => theme.id === stored) ? stored : 'ember-1';
}

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    window.localStorage.setItem(storageKey, activeTheme);
  }, [activeTheme]);

  const setTheme = useCallback((themeId) => {
    if (emberThemes.some((theme) => theme.id === themeId)) {
      setActiveTheme(themeId);
    }
  }, []);

  const value = useMemo(
    () => ({
      activeTheme,
      availableThemes: emberThemes,
      setTheme,
    }),
    [activeTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext };
