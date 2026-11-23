export interface PokeApiListDto {
  next: string | null;
  results: { name: string; url: string }[];
}
