import Link from "next/link";

import { routes } from "@/routes";

export default function Home() {
  return (
    <div className="flex max-w-2xl flex-col items-start gap-5 py-20">
      <span className="label-lg">Powered by PokéAPI</span>
      <h2 className="display-title text-display-hero leading-title">
        A field guide to
        <br />
        every Pokémon
      </h2>
      <p className="text-lg text-ink-soft">
        Browse the register, then open any entry for its Pokédex text, base
        stats, abilities and evolution line.
      </p>
      <Link href={routes.pokemon.list()} className="button focus-ring">
        Open the Pokédex
      </Link>
    </div>
  );
}
