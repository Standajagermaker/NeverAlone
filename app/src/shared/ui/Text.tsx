import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';
export function Title(props: TextProps) { const { theme } = useTheme(); return <RNText {...props} style={[styles.title,{color:theme.colors.text},props.style]} />; }
export function Body(props: TextProps) { const { theme } = useTheme(); return <RNText {...props} style={[styles.body,{color:theme.colors.text},props.style]} />; }
export function Muted(props: TextProps) { const { theme } = useTheme(); return <RNText {...props} style={[styles.body,{color:theme.colors.muted},props.style]} />; }
const styles = StyleSheet.create({ title:{fontSize:34,fontWeight:'800',letterSpacing:-1}, body:{fontSize:16,lineHeight:24} });
