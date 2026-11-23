import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/shared';

import type { PokemonType } from '../../domain/pokemon-type.enum';
import { typeStyles } from '../type-styles';

export function TypeBadge({ type }: { type: PokemonType }) {
  const { label, color } = typeStyles[type];

  return (
    <View style={[styles.badge, { backgroundColor: color }]} accessible accessibilityLabel={label}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  text: { color: colors.onPrimary, fontSize: 14, fontWeight: '600' },
});
