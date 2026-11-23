import { StaticScreenProps } from '@react-navigation/native';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  capitalize,
  colors,
  ErrorState,
  formatPokemonNumber,
  OfflineBanner,
  spacing,
} from '@/shared';

import type { PokemonAbility } from '../../domain/pokemon.model';
import { InfoRow } from '../components/InfoRow';
import { StatBar } from '../components/StatBar';
import { TypeBadge } from '../components/TypeBadge';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { typeStyles } from '../type-styles';

type Props = StaticScreenProps<{ pokemonId: number; pokemonName: string }>;

const formatDecimal = (value: number) => String(value).replace('.', ',');

const formatAbility = ({ name, isHidden }: PokemonAbility) =>
  `${capitalize(name.replace(/-/g, ' '))}${isHidden ? ' (oculta)' : ''}`;

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
  const typeNames = pokemon.types.map(type => typeStyles[type].label.toLowerCase()).join(' y ');
  const heroColor = pokemon.types[0] ? typeStyles[pokemon.types[0]].color : colors.primary;

  return (
    <View style={styles.screen}>
      {pokemon.isOffline ? <OfflineBanner /> : null}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: heroColor }]}>
          <Image source={{ uri: pokemon.imageUrl }} style={styles.image} accessible={false} />
        </View>
        <View
          style={styles.header}
          accessible
          accessibilityRole="header"
          accessibilityLabel={`${name}, número ${pokemon.id}, tipo ${typeNames}`}
        >
          <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.types}>
            {pokemon.types.map(type => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Datos
          </Text>
          <InfoRow label="Peso" value={`${formatDecimal(pokemon.weightKg)} kg`} />
          <InfoRow label="Altura" value={`${formatDecimal(pokemon.heightM)} m`} />
          <InfoRow
            label="Habilidades"
            value={pokemon.abilities.map(ability => formatAbility(ability)).join(', ')}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Estadísticas
          </Text>
          {pokemon.stats.map(stat => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
          {pokemon.baseExperience !== null ? (
            <Text style={styles.experience}>Experiencia base: {pokemon.baseExperience}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: spacing.lg },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  image: { width: 240, height: 240 },
  header: { alignItems: 'center', marginTop: spacing.md },
  number: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
  types: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  section: { marginTop: spacing.lg, marginHorizontal: spacing.md, gap: spacing.xs },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  experience: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
  name: { fontSize: 28, fontWeight: '700', color: colors.text },
});
