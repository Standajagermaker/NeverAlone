import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/shared/ui/Screen';
import { Title, Body, Muted } from '@/shared/ui/Text';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { activities } from '@/features/profile/types/profile';
export function HomeScreen() { const { t } = useTranslation(); return <Screen><Muted>{t('brand.slogan')}</Muted><Title>{t('home.headline')}</Title><Body>{t('home.sub')}</Body><Button title={t('home.cta')} /><Card><Body>{t('home.ai')}</Body></Card><View style={styles.grid}>{activities.map(a=><View key={a.id} style={styles.pill}><Body>{a.emoji} {a.label}</Body></View>)}</View></Screen>; }
const styles=StyleSheet.create({grid:{flexDirection:'row',flexWrap:'wrap',gap:8},pill:{paddingVertical:8,paddingHorizontal:12,borderRadius:999,backgroundColor:'rgba(255,107,53,0.12)'}});
