import { MAX_STAT } from "../constants";
import type { PokemonStat } from "../types";

const SEGMENTS = 20;

/** Reads the type accent from the --accent property set by the page. */
function StatRow({ stat }: { stat: PokemonStat }) {
  const filled = Math.max(1, Math.round((stat.value / MAX_STAT) * SEGMENTS));

  return (
    <div className="stat-row">
      <span className="font-mono text-label uppercase tracking-label text-white/50">
        <span className="sm:hidden">{stat.shortLabel}</span>
        <span className="hidden sm:inline">{stat.label}</span>
      </span>
      <span
        className="flex gap-px sm:gap-tick"
        role="img"
        aria-label={`${stat.label} ${stat.value} of ${MAX_STAT}`}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`h-4 flex-1 rounded-tick ${
              index < filled ? "accent-bg" : "bg-white/10"
            }`}
          />
        ))}
      </span>
      <span className="text-right font-mono text-sm tabular-nums text-white">
        {stat.value}
      </span>
    </div>
  );
}

export function StatReadout({
  stats,
  total,
}: {
  stats: PokemonStat[];
  total: number;
}) {
  return (
    <section className="rounded-2xl bg-panel p-6 sm:p-8">
      <h3 className="font-mono text-label uppercase tracking-heading text-white/40">
        Base stats
      </h3>

      <div className="mt-5 flex flex-col gap-3">
        {stats.map((stat) => (
          <StatRow key={stat.name} stat={stat} />
        ))}
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-white/10 pt-4">
        <span className="font-mono text-label uppercase tracking-heading text-white/40">
          Total
        </span>
        <span className="font-mono text-xl tabular-nums text-white">
          {total}
        </span>
      </div>
    </section>
  );
}
