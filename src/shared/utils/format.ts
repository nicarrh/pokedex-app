export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const formatPokemonNumber = (id: number) => `#${String(id).padStart(3, '0')}`;
