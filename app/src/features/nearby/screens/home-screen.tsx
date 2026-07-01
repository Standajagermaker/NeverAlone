import { Text, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/core/components/screen';
import { isSupabaseConfigured } from '@/core/config/env';
import { useAppTheme } from '@/core/theme/theme-provider';
import { ActivityChip } from '../components/activity-chip';
import { activities, formatRadius, radiusOptions } from '../services/nearby-options';

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors, radius, spacing, typography } = useAppTheme();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View>
          <Text style={[styles.logo, { color: colors.text, fontSize: typography.subtitle }]}>{t('appName')}</Text>
          <Text style={[styles.slogan, { color: colors.accent }]}>{t('slogan')}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: isSupabaseConfigured ? colors.success : colors.warning }]} />
      </View>

      <View style={[styles.hero, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg }]}>
        <Text style={[styles.title, { color: colors.text, fontSize: typography.title }]}>{t('heroTitle')}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.body }]}>{t('heroSubtitle')}</Text>
        <Pressable style={[styles.button, { backgroundColor: colors.primary, borderRadius: radius.pill, padding: spacing.md }]}>
          <Text style={[styles.buttonText, { color: colors.white }]}>{t('primaryAction')}</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('nearbyTitle')}</Text>
        <View style={styles.row}>{radiusOptions.map((item) => <Text key={item} style={[styles.radius, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}>{formatRadius(item)}</Text>)}</View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('activitiesTitle')}</Text>
        <View style={styles.chips}>{activities.map((activity) => <ActivityChip key={activity.id} activity={activity} />)}</View>
      </View>

      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('safetyTitle')}</Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>{t('safetyText')}</Text>
      </View>

      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('aiTitle')}</Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>{t('aiText')}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logo: { fontWeight: '900', letterSpacing: -0.5 },
  slogan: { fontWeight: '700', marginTop: 2 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  hero: { borderWidth: 1, gap: 18, marginBottom: 28 },
  title: { fontWeight: '900', lineHeight: 40, letterSpacing: -1.2 },
  subtitle: { lineHeight: 24 },
  button: { alignItems: 'center', marginTop: 4 },
  buttonText: { fontWeight: '800', fontSize: 16 },
  section: { marginBottom: 28, gap: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  radius: { borderWidth: 1, borderRadius: 999, overflow: 'hidden', paddingHorizontal: 14, paddingVertical: 10, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { borderWidth: 1, marginBottom: 14, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '900' },
  cardText: { lineHeight: 22 }
});
