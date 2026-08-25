import type { PokemonDetail } from "../types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-rule pt-3">
      <dt className="label">{label}</dt>
      <dd className="text-base font-medium text-ink">{value}</dd>
    </div>
  );
}

export function ProfilePanel({ pokemon }: { pokemon: PokemonDetail }) {
  return (
    <section className="panel">
      <h3 className="label-lg">Profile</h3>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        <Field label="Height" value={`${pokemon.height.toFixed(1)} m`} />
        <Field label="Weight" value={`${pokemon.weight.toFixed(1)} kg`} />
        <Field
          label="Base exp"
          value={pokemon.baseExperience?.toString() ?? "—"}
        />
        <Field label="Capture rate" value={`${pokemon.captureRate} / 255`} />
        <Field label="Generation" value={pokemon.generation} />
        <Field label="Habitat" value={pokemon.habitat ?? "Unrecorded"} />
      </dl>

      <h3 className="mt-8 label-lg">Abilities</h3>

      <ul className="mt-4 flex flex-wrap gap-2">
        {pokemon.abilities.map((ability) => (
          <li
            key={ability.name}
            className="rounded-lg border border-rule px-3 py-1.5 text-sm font-medium text-ink"
          >
            {ability.name}
            {ability.isHidden && <span className="ml-2 label">Hidden</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
