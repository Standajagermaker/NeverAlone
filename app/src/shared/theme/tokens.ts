export const lightTheme = {
  colors: { background: '#F7F4EF', surface: '#FFFFFF', text: '#0B1220', muted: '#667085', border: '#E4E7EC', primary: '#FF6B35', primarySoft: '#FFF0EA', success: '#12B76A', danger: '#F04438' },
  spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
  radius: { md: 16, lg: 24, pill: 999 },
};
export const darkTheme = {
  ...lightTheme,
  colors: { background: '#0B1220', surface: '#111B2E', text: '#F9FAFB', muted: '#98A2B3', border: '#22304A', primary: '#FF8A5B', primarySoft: '#2A1A14', success: '#32D583', danger: '#FF6B6B' },
};
export type AppTheme = typeof lightTheme;
