import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme/ThemeProvider';
export function Screen({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  const { theme } = useTheme();
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><ScrollView contentContainerStyle={[styles.content, style]}>{children}</ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 20, gap: 16 } });
