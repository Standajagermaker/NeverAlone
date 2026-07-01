import Constants from 'expo-constants';

type Env = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  appVersion: string;
};

export const env: Env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  appVersion: Constants.expoConfig?.version ?? '0.1.0'
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
