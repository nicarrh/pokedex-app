import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { capitalize, colors, formatPokemonNumber, minTouchSize, spacing } from '@/shared';

import type { PokemonSummary } from '../../domain/pokemon.model';
import { useNavigation } from '@react-navigation/native';

function PokemonCardComponent({ pokemon }: { pokemon: PokemonSummary }) {
  const navigation = useNavigation();
  const name = capitalize(pokemon.name);

  const handleNavigateToDetailScreen = () => {
    navigation.navigate('PokemonDetails', {
      pokemonId: pokemon.id,
      pokemonName: name,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToDetailScreen}
      accessibilityRole="button"
      accessibilityLabel={`${name}, número ${pokemon.id}`}
      accessibilityHint="Abre el detalle"
    >
      <View style={styles.card}>
        <Image source={{ uri: pokemon.imageUrl }} style={styles.image} accessible={false} />
        <View>
          <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const PokemonCard = memo(PokemonCardComponent);

const styles = StyleSheet.create({
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
  image: { width: 72, height: 72 },
  number: { fontSize: 12, color: colors.textMuted },
  name: { fontSize: 18, fontWeight: '600', color: colors.text },
});
