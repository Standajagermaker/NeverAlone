import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/shared/ui/Screen';
import { Title, Body, Muted } from '@/shared/ui/Text';
import { Card } from '@/shared/ui/Card';
import { useTheme } from '@/shared/theme/ThemeProvider';
const radii = ['500m','2km','5km','10km'];
export function NearbyScreen() { const { t }=useTranslation(); const { theme }=useTheme(); const [radius,setRadius]=useState('2km'); return <Screen><Title>{t('nearby.title')}</Title><Card><Body>{t('nearby.radius')}</Body><View style={styles.row}>{radii.map(r=><Pressable key={r} onPress={()=>setRadius(r)} style={[styles.chip,{backgroundColor:r===radius?theme.colors.primary:theme.colors.primarySoft}]}><Body style={{color:r===radius?'#fff':theme.colors.text}}>{r}</Body></Pressable>)}</View></Card><Card><Body>Barcelona tonight</Body><Muted>3 travelers nearby • Coffee, Dinner, Nightlife</Muted></Card><Card><Body>Safety</Body><Muted>{t('nearby.safety')}</Muted></Card></Screen> }
const styles=StyleSheet.create({row:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{borderRadius:999,paddingVertical:10,paddingHorizontal:14}});
