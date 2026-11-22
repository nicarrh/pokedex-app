import React from 'react';
import { StaticScreenProps } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/shared';

type Props = StaticScreenProps<{ pokemonId: number; pokemonName: string }>;

export const PokemonDetailsScreen = ({ route }: Props) => {
  const { pokemonId, pokemonName } = route.params;

  return (
    <View style={styles.container}>
      <Text>{pokemonName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.md,
  },
});
