import Link from "next/link";

import { cn } from "@/lib/cn";

/** Both accept every prop their underlying element does. */

type Variant = "default" | "danger";

const VARIANTS: Record<Variant, string> = {
  default: "bg-ink hover:bg-ink-soft",
  danger: "bg-danger hover:bg-danger-ink",
};

const base =
  "button focus-ring inline-flex min-h-11 items-center justify-center";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: Variant;
};

export function Button({
  variant = "default",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(base, VARIANTS[variant], className)}
    />
  );
}

export type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
};

export function ButtonLink({
  variant = "default",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link {...props} className={cn(base, VARIANTS[variant], className)} />;
}
