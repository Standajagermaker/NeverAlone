import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/shared/ui/Screen';
import { Title, Body, Muted } from '@/shared/ui/Text';
import { Card } from '@/shared/ui/Card';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { isSupabaseConfigured } from '@/shared/services/supabase';
export function SettingsScreen() { const { t, i18n }=useTranslation(); const { theme, mode, setMode }=useTheme(); return <Screen><Title>{t('settings.title')}</Title><Card><Body>{t('settings.theme')}</Body><View style={styles.row}>{(['system','light','dark'] as const).map(m=><Pressable key={m} onPress={()=>setMode(m)} style={[styles.chip,{backgroundColor:mode===m?theme.colors.primary:theme.colors.primarySoft}]}><Body style={{color:mode===m?'#fff':theme.colors.text}}>{m}</Body></Pressable>)}</View></Card><Card><Body>{t('settings.language')}</Body><View style={styles.row}>{['cs','en'].map(l=><Pressable key={l} onPress={()=>i18n.changeLanguage(l)} style={[styles.chip,{backgroundColor:i18n.language===l?theme.colors.primary:theme.colors.primarySoft}]}><Body style={{color:i18n.language===l?'#fff':theme.colors.text}}>{l.toUpperCase()}</Body></Pressable>)}</View></Card><Card><Body>Supabase</Body><Muted>{isSupabaseConfigured ? 'Connected' : 'Waiting for env variables'}</Muted></Card></Screen> }
const styles=StyleSheet.create({row:{flexDirection:'row',gap:8,flexWrap:'wrap'},chip:{borderRadius:999,paddingVertical:10,paddingHorizontal:14}});
