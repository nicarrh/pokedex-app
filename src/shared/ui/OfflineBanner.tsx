import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from './theme';

export function OfflineBanner() {
  return (
    <View
      style={styles.banner}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>Sin conexión. Mostrando datos guardados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.warning,
  },
  text: { fontSize: 14, color: colors.onWarning, textAlign: 'center' },
});
