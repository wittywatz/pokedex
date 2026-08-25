"use client";

import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusMessage
      tone="danger"
      eyebrow="Entry unavailable"
      title="Could not load this Pokémon"
      description={error.message}
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
