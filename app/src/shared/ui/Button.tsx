import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';
export function Button({ title, onPress, variant='primary' }: { title: string; onPress?: () => void; variant?: 'primary'|'secondary' }) {
 const { theme } = useTheme(); const primary=variant==='primary';
 return <Pressable onPress={onPress} style={[styles.btn,{backgroundColor: primary ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border}]}><Text style={[styles.text,{color: primary ? '#fff' : theme.colors.text}]}>{title}</Text></Pressable>;
}
const styles=StyleSheet.create({btn:{borderRadius:999,paddingVertical:14,paddingHorizontal:18,borderWidth:1,alignItems:'center'},text:{fontSize:16,fontWeight:'700'}});
