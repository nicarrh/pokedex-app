import { StyleSheet, View, type DimensionValue } from 'react-native';

import { colors } from './theme';

interface Props {
  width: DimensionValue;
  height: number;
  radius?: number;
}

export function Skeleton({ width, height, radius = 6 }: Props) {
  return <View style={[styles.block, { width, height, borderRadius: radius }]} />;
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.border },
});
