import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DependenciesProvider } from './composition-root';
import RootNavigation from './navigation/RootNavigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <DependenciesProvider>
        <RootNavigation />
        <StatusBar style="auto" />
      </DependenciesProvider>
    </SafeAreaProvider>
  );
}
