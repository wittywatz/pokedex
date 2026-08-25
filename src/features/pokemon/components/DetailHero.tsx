import { PokemonArtwork } from "./PokemonArtwork";
import { TypeBadge } from "./TypeBadge";
import { formatName, formatPokedexNumber } from "../format";
import type { PokemonDetail } from "../types";

export function DetailHero({ pokemon }: { pokemon: PokemonDetail }) {
  return (
    <section className="accent-bg relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12">
      {/* The Pokedex number, oversized and half-submerged: the page's landmark. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -bottom-10 select-none font-display text-numeral font-black leading-none text-white/10 sm:-right-6 sm:text-numeral-lg"
      >
        {String(pokemon.id).padStart(3, "0")}
      </span>

      <div className="relative flex flex-col-reverse items-center gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <span className="font-mono text-xs uppercase tracking-heading text-white/70">
            {formatPokedexNumber(pokemon.id)}
          </span>
          <h2 className="font-display text-display-name font-black uppercase leading-display tracking-tight text-white">
            {formatName(pokemon.name)}
          </h2>
          <p className="text-lg text-white/80">{pokemon.genus}</p>
          <ul className="flex gap-2">
            {pokemon.types.map((type) => (
              <li key={type}>
                <TypeBadge type={type} />
              </li>
            ))}
          </ul>
        </div>

        <PokemonArtwork
          pokemonId={pokemon.id}
          alt={formatName(pokemon.name)}
          width={340}
          height={340}
          priority
          className="animate-rise h-52 w-52 shrink-0 object-contain drop-shadow-2xl sm:h-72 sm:w-72"
        />
      </div>
    </section>
  );
}
