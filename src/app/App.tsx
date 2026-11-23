import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, type KeyValueStorage } from '@/shared';

import { bootstrapStorage } from './bootstrap';
import { DependenciesProvider } from './composition-root';
import RootNavigation from './navigation/RootNavigation';

export default function App() {
  const [storage, setStorage] = useState<KeyValueStorage | null>(null);

  useEffect(() => {
    bootstrapStorage().then(setStorage);
  }, []);

  if (!storage) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator accessibilityLabel="Cargando" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <DependenciesProvider storage={storage}>
        <RootNavigation />
        <StatusBar style="auto" />
      </DependenciesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
