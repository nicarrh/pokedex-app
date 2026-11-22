import { PokemonDetailsScreen, PokemonListScreen } from '@/features/pokemon';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const RootStack = createNativeStackNavigator({
  screens: {
    PokemonList: {
      screen: PokemonListScreen,
      options: {
        headerShown: false,
      },
    },
    PokemonDetails: {
      screen: PokemonDetailsScreen,
      options: {
        headerTitle: () => '',
        headerBackButtonDisplayMode: 'minimal',
      },
    },
  },
});

const RootNavigation = createStaticNavigation(RootStack);

export default RootNavigation;
