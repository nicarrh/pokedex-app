import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, ErrorState, OfflineBanner, spacing } from '@/shared';

import { PokemonCard } from '../components/PokemonCard';
import { usePokemonList } from '../hooks/usePokemonList';

export function PokemonListScreen() {
  const { status, items, error, isOffline, loadingMore, refreshing, loadMore, refresh, retry } =
    usePokemonList();

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" accessibilityLabel="Cargando Pokémon" />
      </View>
    );
  }

  if (status === 'error' && error) {
    return (
      <SafeAreaView style={styles.screen}>
        <ErrorState
          title={error.title}
          message={error.message}
          onRetry={error.canRetry ? retry : undefined}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {isOffline ? <OfflineBanner /> : null}
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay Pokémon para mostrar.</Text>}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footer} /> : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingVertical: spacing.md },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.lg },
  footer: { paddingVertical: spacing.md },
});
