import Link from "next/link";

import { PokemonArtwork } from "./PokemonArtwork";
import { formatName, formatPokedexNumber } from "../format";
import { pokemonRoutes } from "../routes";
import type { PokemonSummary } from "../types";

export function PokemonCard({
  pokemon,
  fromPage,
}: {
  pokemon: PokemonSummary;
  fromPage: number;
}) {
  return (
    <Link
      href={pokemonRoutes.detail(pokemon.id, fromPage)}
      className="tile focus-ring group p-5"
    >
      <PokemonArtwork
        pokemonId={pokemon.id}
        alt={formatName(pokemon.name)}
        width={128}
        height={128}
        className="h-24 w-24 object-contain transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="label">{formatPokedexNumber(pokemon.id)}</span>
      <span className="text-sm font-semibold text-ink">
        {formatName(pokemon.name)}
      </span>
    </Link>
  );
}
