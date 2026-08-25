import { redirect } from "next/navigation";

import { PageContainer } from "@/components/ui/PageContainer";
import { Pagination } from "@/components/ui/Pagination";
import {
  PokemonGrid,
  getPokemonPage,
  pokemonParams,
  pokemonRoutes,
} from "@/features/pokemon";
import type { Param } from "@/lib/params";

export const metadata = {
  title: "Pokédex",
  description: "Browse every Pokémon from the PokéAPI.",
};

export default async function PokedexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: Param }>;
}) {
  const { items, page, totalPages } = await getPokemonPage(
    pokemonParams.page((await searchParams).page),
  );

  // Below the range is canonicalised in `middleware.ts`; above it needs
  // `count`, so it happens here.
  if (page > totalPages) redirect(pokemonRoutes.list(totalPages));

  return (
    <PageContainer>
      <header className="flex flex-col gap-2">
        <span className="label-lg">Field guide</span>
        <h2 className="display-title text-display-section">
          Every Pokémon on record
        </h2>
        <p className="max-w-xl text-ink-soft">
          Pick one to read its entry, stats and evolution line.
        </p>
      </header>

      <PokemonGrid pokemon={items} page={page} />

      <Pagination
        label="Pokédex pagination"
        page={page}
        totalPages={totalPages}
        previousHref={page > 1 ? pokemonRoutes.list(page - 1) : null}
        nextHref={page < totalPages ? pokemonRoutes.list(page + 1) : null}
      />
    </PageContainer>
  );
}
