import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, minTouchSize, Skeleton, spacing } from '@/shared';

const ROWS = 8;

export function PokemonListSkeleton() {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.list, { opacity }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando Pokémon"
    >
      {Array.from({ length: ROWS }, (_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton width={72} height={72} radius={36} />
          <View style={styles.lines}>
            <Skeleton width={40} height={12} />
            <Skeleton width={120} height={18} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.md },
  card: {
    minHeight: minTouchSize,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  lines: { gap: spacing.sm },
});
