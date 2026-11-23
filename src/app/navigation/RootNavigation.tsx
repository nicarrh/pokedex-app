import { PokemonDetailsScreen, PokemonListScreen } from '@/features/pokemon';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    // Declaration merging requires an interface; React Navigation reads the route types from it.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    PokemonDetails: createNativeStackScreen({
      screen: PokemonDetailsScreen,
      options: ({ route }) => ({
        title: route.params.pokemonName,
        headerBackButtonDisplayMode: 'minimal',
      }),
    }),
  },
});

const RootNavigation = createStaticNavigation(RootStack);

export default RootNavigation;
