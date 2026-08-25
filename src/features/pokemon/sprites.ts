const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

/** Missing for some alternate forms, hence the fallback below. */
export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

/** Lower fidelity, but present for every form. */
export function getFallbackSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}
