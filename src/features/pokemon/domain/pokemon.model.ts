export interface PokemonSummary {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
}

export interface PokemonPage {
  readonly items: readonly PokemonSummary[];
  readonly nextOffset: number | null;
}
