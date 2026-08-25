import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Untold, tailwind-merge reads `text-label` as a colour and drops it when a
 * caller also passes `text-ink`. `cn.test.ts` fails if a `@theme` token added
 * in `globals.css` is missing here.
 */
export const THEME_TOKENS = {
  color: [
    "paper",
    "surface",
    "panel",
    "ink",
    "ink-soft",
    "muted",
    "rule",
    "rule-strong",
    "inert",
    "inert-ink",
    "danger",
    "danger-ink",
    "danger-surface",
    "danger-rule",
  ],
  text: [
    "label",
    "numeral",
    "numeral-lg",
    "display-hero",
    "display-section",
    "display-name",
  ],
  leading: ["display", "title"],
  tracking: ["label", "heading"],
  radius: ["tick"],
  spacing: ["tick"],
} as const;

const twMerge = extendTailwindMerge({
  extend: { theme: THEME_TOKENS as unknown as Record<string, string[]> },
});

/** A caller's class beats the component's own: `cn("p-4", "p-8")` is `p-8`. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
