import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/shared';

// Highest possible base stat in the games; keeps bars comparable across Pokémon.
const MAX_STAT = 255;

const statLabels: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. esp.',
  'special-defense': 'Def. esp.',
  speed: 'Velocidad',
};

interface Props {
  name: string;
  value: number;
}

export function StatBar({ name, value }: Props) {
  const label = statLabels[name] ?? name;
  const percent = Math.min(value / MAX_STAT, 1) * 100;

  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 28 },
  label: { width: 84, fontSize: 14, color: colors.textMuted },
  value: { width: 36, fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right' },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
});
