import { capitalize, formatPokemonNumber } from './format';

describe('format', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });

  it('pads the pokemon number to three digits', () => {
    expect(formatPokemonNumber(1)).toBe('#001');
    expect(formatPokemonNumber(1025)).toBe('#1025');
  });
});
