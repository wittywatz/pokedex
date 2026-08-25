/** Trimmed to the fields we actually read, with PokeAPI's exact shapes. */

import type {
  EvolutionChainResponse,
  PokemonResponse,
  SpeciesResponse,
} from "../pokeapi";

const resource = (name: string, url: string) => ({ name, url });

export const pikachu: PokemonResponse = {
  id: 25,
  name: "pikachu",
  species: resource("pikachu", "https://pokeapi.co/api/v2/pokemon-species/25/"),
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [
    {
      slot: 1,
      type: resource("electric", "https://pokeapi.co/api/v2/type/13/"),
    },
  ],
  stats: [
    { base_stat: 35, stat: resource("hp", "") },
    { base_stat: 55, stat: resource("attack", "") },
    { base_stat: 40, stat: resource("defense", "") },
    { base_stat: 50, stat: resource("special-attack", "") },
    { base_stat: 50, stat: resource("special-defense", "") },
    { base_stat: 90, stat: resource("speed", "") },
  ],
  abilities: [
    { is_hidden: false, ability: resource("static", "") },
    { is_hidden: true, ability: resource("lightning-rod", "") },
  ],
};

export const pikachuSpecies: SpeciesResponse = {
  genera: [
    { genus: "Mouse Pokémon", language: resource("en", "") },
    { genus: "ねずみポケモン", language: resource("ja", "") },
  ],
  flavor_text_entries: [
    {
      flavor_text: "でんきを\nためる ほお。",
      language: resource("ja", ""),
      version: resource("red", ""),
    },
    {
      flavor_text: "When several of\nthese POKéMON\ngather, their\felectricity",
      language: resource("en", ""),
      version: resource("red", ""),
    },
  ],
  capture_rate: 190,
  generation: resource("generation-i", ""),
  habitat: resource("forest", "https://pokeapi.co/api/v2/pokemon-habitat/2/"),
  evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
};

export const pikachuChain: EvolutionChainResponse = {
  chain: {
    species: resource(
      "pichu",
      "https://pokeapi.co/api/v2/pokemon-species/172/",
    ),
    evolves_to: [
      {
        species: resource(
          "pikachu",
          "https://pokeapi.co/api/v2/pokemon-species/25/",
        ),
        evolves_to: [
          {
            species: resource(
              "raichu",
              "https://pokeapi.co/api/v2/pokemon-species/26/",
            ),
            evolves_to: [],
          },
        ],
      },
    ],
  },
};

/** Eevee: the branching case, eight children off one node. */
export const eeveeChain: EvolutionChainResponse = {
  chain: {
    species: resource(
      "eevee",
      "https://pokeapi.co/api/v2/pokemon-species/133/",
    ),
    evolves_to: [134, 135, 136].map((id) => ({
      species: resource(
        `eeveelution-${id}`,
        `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
      ),
      evolves_to: [],
    })),
  },
};
