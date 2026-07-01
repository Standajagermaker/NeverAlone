import { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';
export function Card({ children }: PropsWithChildren) { const { theme } = useTheme(); return <View style={[styles.card,{backgroundColor:theme.colors.surface,borderColor:theme.colors.border}]}>{children}</View>; }
const styles=StyleSheet.create({card:{borderRadius:24,padding:18,borderWidth:1,gap:12}});
