import { StaticScreenProps } from '@react-navigation/native';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { capitalize, colors, ErrorState, formatPokemonNumber, spacing } from '@/shared';

import { TypeBadge } from '../components/TypeBadge';
import { usePokemonDetail } from '../hooks/usePokemonDetail';

type Props = StaticScreenProps<{ pokemonId: number; pokemonName: string }>;

export const PokemonDetailsScreen = ({ route }: Props) => {
  const { pokemonId } = route.params;
  const { state, retry } = usePokemonDetail(pokemonId);

  if (state.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator accessibilityLabel="Cargando" color={colors.primary} />
      </View>
    );
  }

  if (state.status === 'error') {
    return <ErrorState {...state.error} onRetry={state.error.canRetry ? retry : undefined} />;
  }

  const { pokemon } = state;
  const name = capitalize(pokemon.name);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: pokemon.imageUrl }} style={styles.image} accessible={false} />
      <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
      <Text style={styles.name} accessibilityRole="header">
        {name}
      </Text>
      <View style={styles.types}>
        {pokemon.types.map(type => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', padding: spacing.md },
  image: { width: 240, height: 240 },
  number: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
  types: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  name: { fontSize: 28, fontWeight: '700', color: colors.text },
});
