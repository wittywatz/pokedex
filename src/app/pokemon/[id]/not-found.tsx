import { ButtonLink } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { routes } from "@/routes";

export default function NotFound() {
  return (
    <StatusMessage
      eyebrow="No entry"
      title="Not in the Pokédex"
      description="That number has no recorded Pokémon. Pick another from the list."
      action={
        <ButtonLink href={routes.pokemon.list()}>Back to Pokédex</ButtonLink>
      }
    />
  );
}
