import { cn } from "@/lib/cn";

/** The shape every dead end takes: errors, not-found, empty states. */

type Tone = "neutral" | "danger";

export type StatusMessageProps = React.ComponentProps<"div"> & {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: Tone;
  action?: React.ReactNode;
};

export function StatusMessage({
  eyebrow,
  title,
  description,
  tone = "neutral",
  action,
  className,
  ...props
}: StatusMessageProps) {
  return (
    <div
      {...props}
      className={cn(
        "mx-auto flex max-w-md flex-col items-start gap-4 py-24",
        className,
      )}
    >
      <span className={cn("label-lg", tone === "danger" && "text-danger")}>
        {eyebrow}
      </span>
      <h2 className="display-title text-display-section">{title}</h2>
      {description && <p className="text-ink-soft">{description}</p>}
      {action}
    </div>
  );
}
