import type { PokemonType } from "./types";

/** Deepened from the candy-bright originals so white text clears contrast. */
export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: "#7C7A6E",
  fire: "#C6432B",
  water: "#2A6BC4",
  electric: "#B58900",
  grass: "#3C8C3C",
  ice: "#3E92A3",
  fighting: "#9C3B2E",
  poison: "#7B3F8C",
  ground: "#8C6A33",
  flying: "#6B7BC4",
  psychic: "#C4437A",
  bug: "#6E8C1F",
  rock: "#8A7A46",
  ghost: "#5B4A8C",
  dragon: "#4A4AB8",
  dark: "#4A4038",
  steel: "#5E7480",
  fairy: "#B84A7A",
};

const FALLBACK = "#4B5563";

/** `hasOwn`, not `in`: a type named "toString" matches an inherited member. */
function isKnownType(type: string): type is PokemonType {
  return Object.hasOwn(TYPE_COLORS, type);
}

export function getTypeColor(type: string | undefined): string {
  return type && isKnownType(type) ? TYPE_COLORS[type] : FALLBACK;
}
