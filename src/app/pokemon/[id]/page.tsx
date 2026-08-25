import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/ui/PageContainer";

import {
  DetailHero,
  EvolutionLine,
  ProfilePanel,
  StatReadout,
  formatName,
  getPokemonDetail,
  getTypeColor,
  pokemonParams,
  pokemonRoutes,
} from "@/features/pokemon";
import type { Param } from "@/lib/params";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: Param }>;
};

/** Both the page and its metadata need the same lookup; fetch dedupes it. */
async function loadPokemon(params: Props["params"]) {
  const id = pokemonParams.id((await params).id);

  return id === null ? null : getPokemonDetail(id);
}

export async function generateMetadata({ params }: Props) {
  const pokemon = await loadPokemon(params);

  if (!pokemon) return { title: "Pokémon not found" };

  return {
    title: `${formatName(pokemon.name)} · Pokédex`,
    description: pokemon.flavorText,
  };
}

export default async function PokemonDetailPage({
  params,
  searchParams,
}: Props) {
  const pokemon = await loadPokemon(params);

  if (!pokemon) notFound();

  const backHref = pokemonRoutes.list(
    pokemonParams.page((await searchParams).from),
  );

  return (
    /* One accent per page, set here and inherited by every accent-* class. */
    <PageContainer
      as="article"
      width="narrow"
      style={
        { "--accent": getTypeColor(pokemon.types[0]) } as React.CSSProperties
      }
    >
      <Link
        href={backHref}
        className="tap-target label focus-ring w-fit transition hover:text-ink"
      >
        &larr; Back to Pokédex
      </Link>

      <DetailHero pokemon={pokemon} />

      {pokemon.flavorText && (
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">
          {pokemon.flavorText}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <StatReadout stats={pokemon.stats} total={pokemon.statTotal} />
        <ProfilePanel pokemon={pokemon} />
      </div>

      <EvolutionLine stages={pokemon.evolutionLine} />
    </PageContainer>
  );
}
