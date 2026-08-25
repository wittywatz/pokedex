export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/** "lightning-rod" -> "Lightning Rod". */
export function formatName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Cartridge-era line breaks and form feeds, collapsed so text reflows. */
export function formatFlavorText(text: string): string {
  return text
    .replace(/[\n\f\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** "generation-i" -> "I". */
export function formatGeneration(generation: string): string {
  return generation.replace("generation-", "").toUpperCase();
}
