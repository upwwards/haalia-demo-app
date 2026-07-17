import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  applyThemeAttribute,
  emberThemes,
  normalizeThemeId,
  readStoredTheme,
} from '../themes/themes.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(readStoredTheme);

  useEffect(() => {
    const normalized = applyThemeAttribute(activeTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
    }
  }, [activeTheme]);

  const setTheme = useCallback((themeId) => {
    setActiveTheme(normalizeThemeId(themeId));
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
