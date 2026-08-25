import { PokemonCard } from "./PokemonCard";
import type { PokemonSummary } from "../types";

export function PokemonGrid({
  pokemon,
  page,
}: {
  pokemon: PokemonSummary[];
  page: number;
}) {
  return (
    <ul className="card-grid">
      {pokemon.map((entry) => (
        <li key={entry.id}>
          <PokemonCard pokemon={entry} fromPage={page} />
        </li>
      ))}
    </ul>
  );
}
