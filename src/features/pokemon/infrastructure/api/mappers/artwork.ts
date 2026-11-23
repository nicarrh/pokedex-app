const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const artworkUrl = (id: number): string => `${ARTWORK_URL}/${id}.png`;
