import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, minTouchSize, spacing } from './theme';

interface Props {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          style={styles.button}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Reintentar"
        >
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  message: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  button: {
    minHeight: minTouchSize,
    minWidth: minTouchSize,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: colors.onPrimary, fontWeight: '600' },
});
