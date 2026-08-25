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
      eyebrow="List unavailable"
      title="Could not load the Pokédex"
      description={error.message}
      action={
        <Button variant="danger" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
