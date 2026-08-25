/** Declared only as far as we read them; unknown fields are stripped. */

import { z } from "zod";

const namedResource = z.object({
  name: z.string(),
  url: z.string(),
});

export const pokemonListSchema = z.object({
  count: z.number(),
  results: z.array(namedResource),
});

export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  /** Forms above id 10000 have no species; building the URL from `id` 404s. */
  species: namedResource,
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  types: z.array(z.object({ slot: z.number(), type: namedResource })),
  stats: z.array(z.object({ base_stat: z.number(), stat: namedResource })),
  abilities: z.array(
    z.object({ is_hidden: z.boolean(), ability: namedResource }),
  ),
});

export const speciesSchema = z.object({
  genera: z.array(z.object({ genus: z.string(), language: namedResource })),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: namedResource,
      version: namedResource,
    }),
  ),
  capture_rate: z.number(),
  generation: namedResource,
  habitat: namedResource.nullable(),
  evolution_chain: z.object({ url: z.string() }),
});

/** Chains nest arbitrarily deep, so the schema has to recurse. */
export type ChainLink = {
  species: z.infer<typeof namedResource>;
  evolves_to: ChainLink[];
};

const chainLinkSchema: z.ZodType<ChainLink> = z.lazy(() =>
  z.object({
    species: namedResource,
    evolves_to: z.array(chainLinkSchema),
  }),
);

export const evolutionChainSchema = z.object({ chain: chainLinkSchema });

export type NamedResource = z.infer<typeof namedResource>;
export type PokemonListResponse = z.infer<typeof pokemonListSchema>;
export type PokemonResponse = z.infer<typeof pokemonSchema>;
export type SpeciesResponse = z.infer<typeof speciesSchema>;
export type EvolutionChainResponse = z.infer<typeof evolutionChainSchema>;
