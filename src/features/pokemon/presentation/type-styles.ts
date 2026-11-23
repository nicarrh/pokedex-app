import { PokemonType } from '../domain/pokemon-type.enum';

// Backgrounds are dark enough for white text to reach WCAG AA (4.5:1).
export const typeStyles: Record<PokemonType, { label: string; color: string }> = {
  [PokemonType.Normal]: { label: 'Normal', color: '#6b6b4e' },
  [PokemonType.Fire]: { label: 'Fuego', color: '#c2410c' },
  [PokemonType.Water]: { label: 'Agua', color: '#1d4ed8' },
  [PokemonType.Electric]: { label: 'Eléctrico', color: '#a16207' },
  [PokemonType.Grass]: { label: 'Planta', color: '#15803d' },
  [PokemonType.Ice]: { label: 'Hielo', color: '#0e7490' },
  [PokemonType.Fighting]: { label: 'Lucha', color: '#b91c1c' },
  [PokemonType.Poison]: { label: 'Veneno', color: '#7e22ce' },
  [PokemonType.Ground]: { label: 'Tierra', color: '#92400e' },
  [PokemonType.Flying]: { label: 'Volador', color: '#4f46e5' },
  [PokemonType.Psychic]: { label: 'Psíquico', color: '#be185d' },
  [PokemonType.Bug]: { label: 'Bicho', color: '#4d7c0f' },
  [PokemonType.Rock]: { label: 'Roca', color: '#78716c' },
  [PokemonType.Ghost]: { label: 'Fantasma', color: '#581c87' },
  [PokemonType.Dragon]: { label: 'Dragón', color: '#4338ca' },
  [PokemonType.Dark]: { label: 'Siniestro', color: '#374151' },
  [PokemonType.Steel]: { label: 'Acero', color: '#475569' },
  [PokemonType.Fairy]: { label: 'Hada', color: '#be123c' },
};
