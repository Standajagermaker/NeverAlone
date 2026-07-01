import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { colors, radius, spacing, typography } from './tokens';

const theme = { colors, radius, spacing, typography };

type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const value = useMemo(() => theme, []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
