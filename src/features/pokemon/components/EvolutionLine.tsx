import Link from "next/link";

import { PokemonArtwork } from "./PokemonArtwork";
import { formatName, formatPokedexNumber } from "../format";
import { pokemonRoutes } from "../routes";
import type { EvolutionStage } from "../types";

function StageBody({ stage }: { stage: EvolutionStage }) {
  return (
    <>
      <PokemonArtwork
        pokemonId={stage.id}
        alt={formatName(stage.name)}
        width={112}
        height={112}
        className="h-20 w-20 object-contain sm:h-24 sm:w-24"
      />
      <span className="label">{formatPokedexNumber(stage.id)}</span>
      <span className="text-sm font-semibold text-ink">
        {formatName(stage.name)}
      </span>
    </>
  );
}

function Stage({ stage }: { stage: EvolutionStage }) {
  if (stage.isCurrent) {
    return (
      <div
        aria-current="page"
        className="tile accent-border min-w-34 gap-1 border-2 px-4 py-4 hover:translate-y-0 hover:shadow-none"
      >
        <StageBody stage={stage} />
      </div>
    );
  }

  return (
    <Link
      href={pokemonRoutes.detail(stage.id)}
      className="tile focus-ring min-w-34 gap-1 px-4 py-4"
    >
      <StageBody stage={stage} />
    </Link>
  );
}

export function EvolutionLine({ stages }: { stages: EvolutionStage[] }) {
  if (stages.length < 2) return null;

  return (
    <section>
      <h3 className="label-lg">Evolution line</h3>

      <ol className="mt-5 flex items-center gap-3 overflow-x-auto pb-2">
        {stages.map((stage, index) => (
          <li key={stage.id} className="flex shrink-0 items-center gap-3">
            {index > 0 && (
              <span aria-hidden className="font-mono text-rule-strong">
                &rarr;
              </span>
            )}
            <Stage stage={stage} />
          </li>
        ))}
      </ol>
    </section>
  );
}
