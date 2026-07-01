import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelProfile } from '../types/profile';
const KEY = 'neveralone.profile.v1';
export async function saveLocalProfile(profile: TravelProfile) { await AsyncStorage.setItem(KEY, JSON.stringify(profile)); }
export async function loadLocalProfile(): Promise<TravelProfile | null> { const raw = await AsyncStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
