import { Text, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/core/theme/theme-provider';
import type { Activity } from '../types/nearby';

export function ActivityChip({ activity }: { activity: Activity }) {
  const { colors, radius, spacing, typography } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
      <Text style={styles.emoji}>{activity.emoji}</Text>
      <Text style={[styles.label, { color: colors.text, fontSize: typography.caption }]}>{activity.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  emoji: { fontSize: 16 },
  label: { fontWeight: '700' }
});
