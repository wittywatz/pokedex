import { MAX_STAT, PAGE_SIZE } from "./constants";
import { getSpriteUrl } from "./sprites";
import { formatFlavorText, formatGeneration, formatName } from "./format";
import type {
  ChainLink,
  EvolutionChainResponse,
  NamedResource,
  PokemonResponse,
  SpeciesResponse,
} from "./pokeapi";
import type {
  EvolutionStage,
  PokemonAbility,
  PokemonDetail,
  PokemonStat,
  PokemonSummary,
} from "./types";

const STAT_LABELS: Record<string, { label: string; short: string }> = {
  hp: { label: "HP", short: "HP" },
  attack: { label: "Attack", short: "ATK" },
  defense: { label: "Defense", short: "DEF" },
  "special-attack": { label: "Sp. Atk", short: "SP.A" },
  "special-defense": { label: "Sp. Def", short: "SP.D" },
  speed: { label: "Speed", short: "SPD" },
};

export function getIdFromUrl(url: string): number {
  const id = Number(url.split("/").filter(Boolean).at(-1));

  if (!Number.isInteger(id)) {
    throw new Error(`Could not read a Pokemon id from "${url}"`);
  }

  return id;
}

/**
 * Ours, not the API's `next`/`previous` URLs, so which pages exist is decided
 * in one place.
 */
export function offsetForPage(page: number): number {
  return (page - 1) * PAGE_SIZE;
}

/** A partial last page counts; an empty register is one page. */
export function totalPagesForCount(count: number): number {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

export function toSummary(resource: NamedResource): PokemonSummary {
  const id = getIdFromUrl(resource.url);

  return { id, name: resource.name, spriteUrl: getSpriteUrl(id) };
}

function isEnglish(entry: { language: NamedResource }): boolean {
  return entry.language.name === "en";
}

function toStats(response: PokemonResponse): PokemonStat[] {
  return response.stats.map((entry) => {
    const known = Object.hasOwn(STAT_LABELS, entry.stat.name)
      ? STAT_LABELS[entry.stat.name]
      : undefined;
    const label = known?.label ?? formatName(entry.stat.name);

    return {
      name: entry.stat.name,
      label,
      shortLabel: known?.short ?? label,
      value: Math.min(entry.base_stat, MAX_STAT),
    };
  });
}

function toAbilities(response: PokemonResponse): PokemonAbility[] {
  return response.abilities.map((entry) => ({
    name: formatName(entry.ability.name),
    isHidden: entry.is_hidden,
  }));
}

/** Chains branch (Eevee has eight children); depth-first into one line. */
function flattenChain(link: ChainLink): NamedResource[] {
  return [link.species, ...link.evolves_to.flatMap(flattenChain)];
}

function toEvolutionLine(
  chain: EvolutionChainResponse,
  currentId: number,
): EvolutionStage[] {
  return flattenChain(chain.chain).map((species) => {
    const summary = toSummary(species);

    return { ...summary, isCurrent: summary.id === currentId };
  });
}

export function toDetail(
  pokemon: PokemonResponse,
  species: SpeciesResponse,
  chain: EvolutionChainResponse,
): PokemonDetail {
  const stats = toStats(pokemon);

  return {
    id: pokemon.id,
    name: pokemon.name,
    artworkUrl: getSpriteUrl(pokemon.id),
    types: [...pokemon.types]
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    genus: species.genera.find(isEnglish)?.genus ?? "Unknown Pokémon",
    flavorText: formatFlavorText(
      species.flavor_text_entries.find(isEnglish)?.flavor_text ?? "",
    ),
    stats,
    statTotal: stats.reduce((total, stat) => total + stat.value, 0),
    abilities: toAbilities(pokemon),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    baseExperience: pokemon.base_experience,
    captureRate: species.capture_rate,
    generation: formatGeneration(species.generation.name),
    habitat: species.habitat ? formatName(species.habitat.name) : null,
    evolutionLine: toEvolutionLine(chain, pokemon.id),
  };
}
