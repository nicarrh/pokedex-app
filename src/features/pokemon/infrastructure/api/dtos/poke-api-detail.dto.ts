export interface PokeApiDetailDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { type: { name: string } }[];
  abilities: { is_hidden: boolean; ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}
