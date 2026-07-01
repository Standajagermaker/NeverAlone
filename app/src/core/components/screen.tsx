import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/core/theme/theme-provider';

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function Screen({ children, scroll = false }: Props) {
  const { colors, spacing } = useAppTheme();
  const content = <View style={[styles.content, { padding: spacing.lg }]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {scroll ? <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 }
});
