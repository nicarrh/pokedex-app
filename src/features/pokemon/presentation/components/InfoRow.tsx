import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/shared';

interface Props {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: Props) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, minHeight: 28 },
  label: { fontSize: 14, color: colors.textMuted },
  value: { flexShrink: 1, fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right' },
});
