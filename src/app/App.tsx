import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PokemonListScreen } from '@/features/pokemon';

import { DependenciesProvider } from './composition-root';

export default function App() {
  return (
    <SafeAreaProvider>
      <DependenciesProvider>
        <PokemonListScreen />
        <StatusBar style="auto" />
      </DependenciesProvider>
    </SafeAreaProvider>
  );
}
