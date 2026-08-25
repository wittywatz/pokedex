import "server-only";

import { fetchJson, fetchJsonOrNull } from "@/lib/http";

import { PAGE_SIZE } from "./constants";
import {
  evolutionChainSchema,
  pokemonListSchema,
  pokemonSchema,
  speciesSchema,
} from "./pokeapi";
import {
  offsetForPage,
  toDetail,
  toSummary,
  totalPagesForCount,
} from "./transform";
import type { PokemonDetail, PokemonPage } from "./types";

const API_BASE = "https://pokeapi.co/api/v2";

/** A day - the Pokedex does not change. */
const CACHE = { revalidate: 86_400 };

/** The one place a page number becomes the API's offset. */
export async function getPokemonPage(page: number): Promise<PokemonPage> {
  const data = await fetchJson(
    `${API_BASE}/pokemon?offset=${offsetForPage(page)}&limit=${PAGE_SIZE}`,
    pokemonListSchema,
    CACHE,
  );

  return {
    items: data.results.map(toSummary),
    page,
    totalPages: totalPagesForCount(data.count),
  };
}

/** Null rather than throwing, so the route can render not-found. */
export async function getPokemonDetail(
  id: number,
): Promise<PokemonDetail | null> {
  const pokemon = await fetchJsonOrNull(
    `${API_BASE}/pokemon/${id}`,
    pokemonSchema,
    CACHE,
  );

  if (!pokemon) return null;

  const species = await fetchJson(pokemon.species.url, speciesSchema, CACHE);
  const chain = await fetchJson(
    species.evolution_chain.url,
    evolutionChainSchema,
    CACHE,
  );

  return toDetail(pokemon, species, chain);
}
