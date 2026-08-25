import Link from "next/link";

import { cn } from "@/lib/cn";

/** Callers pass ready-made hrefs; a null href renders a disabled control. */

export type PaginationProps = React.ComponentProps<"nav"> & {
  page: number;
  totalPages: number;
  previousHref: string | null;
  nextHref: string | null;
  label: string;
};

const baseStyles =
  "inline-flex min-h-11 items-center rounded-lg border px-3 font-mono text-xs uppercase tracking-label sm:px-4";

function Direction({
  label,
  short,
  arrow,
}: {
  label: string;
  short: string;
  arrow: "left" | "right";
}) {
  const glyph = arrow === "left" ? "←" : "→";

  return (
    <>
      {arrow === "left" && <span aria-hidden>{glyph} </span>}
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{label}</span>
      {arrow === "right" && <span aria-hidden> {glyph}</span>}
    </>
  );
}

function Step({
  href,
  label,
  short,
  arrow,
}: {
  href: string | null;
  label: string;
  short: string;
  arrow: "left" | "right";
}) {
  const content = <Direction label={label} short={short} arrow={arrow} />;

  if (href === null) {
    return (
      <span
        aria-disabled="true"
        className={`${baseStyles} border-rule bg-inert text-inert-ink`}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseStyles} focus-ring border-rule bg-surface text-ink transition hover:border-rule-strong hover:shadow-sm`}
    >
      {content}
    </Link>
  );
}

export function Pagination({
  page,
  totalPages,
  previousHref,
  nextHref,
  label,
  className,
  ...props
}: PaginationProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={cn("pagination-bar", className)}
    >
      <Step href={previousHref} label="Previous" short="Prev" arrow="left" />

      <p className="label whitespace-nowrap">
        <span className="hidden sm:inline">Page </span>
        <span className="font-semibold text-ink">{page}</span>
        <span className="hidden sm:inline"> of </span>
        <span className="sm:hidden"> / </span>
        {totalPages}
      </p>

      <Step href={nextHref} label="Next" short="Next" arrow="right" />
    </nav>
  );
}
