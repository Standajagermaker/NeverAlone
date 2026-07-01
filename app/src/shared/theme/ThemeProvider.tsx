import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './tokens';

type ThemeMode = 'system' | 'light' | 'dark';
type ThemeContextValue = { theme: typeof lightTheme; mode: ThemeMode; setMode: (mode: ThemeMode) => void; isDark: boolean };
const ThemeContext = createContext<ThemeContextValue | null>(null);
export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const isDark = mode === 'dark' || (mode === 'system' && system === 'dark');
  const value = useMemo(() => ({ theme: isDark ? darkTheme : lightTheme, mode, setMode, isDark }), [isDark, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
