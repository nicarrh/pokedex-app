import { render, screen } from '@testing-library/react-native';

import { PokemonListSkeleton } from './PokemonListSkeleton';

describe('PokemonListSkeleton', () => {
  it('announces a single loading indicator', async () => {
    await render(<PokemonListSkeleton />);

    expect(screen.getByRole('progressbar', { name: 'Cargando Pokémon' })).toBeTruthy();
  });
});
