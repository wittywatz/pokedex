/** View models: what components render, independent of PokeAPI's shapes. */

export type PokemonPage = {
  items: PokemonSummary[];
  /** The page asked for, which may sit past the end of the register. */
  page: number;
  totalPages: number;
};

export type PokemonSummary = {
  id: number;
  name: string;
  spriteUrl: string;
};

/** The types we hold a colour for; PokeAPI may return others. */
export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type PokemonStat = {
  name: string;
  label: string;
  /** Abbreviation for narrow screens, where the full label crowds the bar. */
  shortLabel: string;
  value: number;
};

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

export type EvolutionStage = PokemonSummary & {
  /** True for the Pokemon whose page we are currently on. */
  isCurrent: boolean;
};

export type PokemonDetail = {
  id: number;
  name: string;
  artworkUrl: string;
  /** Raw type names from the API, ordered by slot. */
  types: string[];
  genus: string;
  flavorText: string;
  stats: PokemonStat[];
  statTotal: number;
  abilities: PokemonAbility[];
  /** Metres. */
  height: number;
  /** Kilograms. */
  weight: number;
  baseExperience: number | null;
  captureRate: number;
  generation: string;
  habitat: string | null;
  evolutionLine: EvolutionStage[];
};
