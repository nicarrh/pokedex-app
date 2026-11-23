import type { PokemonType } from './pokemon-type.enum';

export interface PokemonSummary {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
}

export interface PokemonPage {
  readonly items: readonly PokemonSummary[];
  readonly nextOffset: number | null;
  readonly isOffline?: boolean;
}

export interface PokemonAbility {
  readonly name: string;
  readonly isHidden: boolean;
}

export interface PokemonStat {
  readonly name: string;
  readonly value: number;
}

export interface Pokemon {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
  readonly types: readonly PokemonType[];
  readonly abilities: readonly PokemonAbility[];
  readonly stats: readonly PokemonStat[];
  readonly weightKg: number;
  readonly heightM: number;
  // PokéAPI leaves it null for some forms.
  readonly baseExperience: number | null;
  readonly isOffline?: boolean;
}
