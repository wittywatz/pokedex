import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { THEME_TOKENS, cn } from "./cn";

describe("cn", () => {
  it("joins the classes it is given", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy entries so conditionals read inline", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("accepts the shapes clsx does", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });

  it("returns an empty string when there is nothing to join", () => {
    expect(cn()).toBe("");
    expect(cn(false, undefined)).toBe("");
  });
});

describe("cn conflict resolution", () => {
  it("lets a caller's class win over the component's", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("bg-ink", "bg-danger")).toBe("bg-danger");
    expect(cn("max-w-6xl", "max-w-5xl")).toBe("max-w-5xl");
  });

  it("resolves conflicts between our own theme tokens", () => {
    expect(cn("text-display-section", "text-display-hero")).toBe(
      "text-display-hero",
    );
    expect(cn("leading-display", "leading-title")).toBe("leading-title");
    expect(cn("gap-tick", "gap-3")).toBe("gap-3");
    expect(cn("rounded-lg", "rounded-tick")).toBe("rounded-tick");
  });

  it("keeps a font-size token and a colour together", () => {
    // The regression this config exists for: unregistered, `text-label` is
    // read as a colour and dropped.
    expect(cn("text-label", "text-ink")).toBe("text-label text-ink");
    expect(cn("text-numeral", "text-white/10")).toBe(
      "text-numeral text-white/10",
    );
  });
});

describe("THEME_TOKENS", () => {
  /** Namespaces in globals.css that tailwind-merge needs to know about. */
  const NAMESPACES = {
    color: "color",
    text: "text",
    leading: "leading",
    tracking: "tracking",
    radius: "radius",
    spacing: "spacing",
  } as const;

  const css = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const themeBlock = css.slice(css.indexOf("@theme"), css.indexOf("@layer"));

  for (const [key, namespace] of Object.entries(NAMESPACES)) {
    it(`registers every --${namespace}-* token`, () => {
      const declared = [
        ...themeBlock.matchAll(new RegExp(`--${namespace}-([a-z0-9-]+):`, "g")),
      ].map((match) => match[1]);
      const registered = THEME_TOKENS[key as keyof typeof THEME_TOKENS];

      expect([...declared].sort()).toEqual([...registered].sort());
    });
  }
});
