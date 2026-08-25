import { describe, expect, it } from "vitest";

import { pokemonParams, pokemonRoutes } from "./routes";

describe("pokemonRoutes.list", () => {
  it("keeps the first page canonical, with no query", () => {
    expect(pokemonRoutes.list()).toBe("/pokemon");
    expect(pokemonRoutes.list(1)).toBe("/pokemon");
  });

  it("carries the page number for later pages", () => {
    expect(pokemonRoutes.list(2)).toBe("/pokemon?page=2");
  });
});

describe("pokemonRoutes.detail", () => {
  it("links by id", () => {
    expect(pokemonRoutes.detail(25)).toBe("/pokemon/25");
  });

  it("remembers the list page you came from", () => {
    expect(pokemonRoutes.detail(25, 2)).toBe("/pokemon/25?from=2");
  });

  it("omits `from` for the first page", () => {
    expect(pokemonRoutes.detail(25, 1)).toBe("/pokemon/25");
  });
});

describe("pokemonParams.page", () => {
  it("round-trips a page through a link and back", () => {
    const href = pokemonRoutes.list(3);
    const page =
      new URL(href, "https://example.com").searchParams.get("page") ??
      undefined;

    expect(pokemonParams.page(page)).toBe(3);
  });

  it("falls back to the first page for junk", () => {
    expect(pokemonParams.page("abc")).toBe(1);
    expect(pokemonParams.page("-5")).toBe(1);
    expect(pokemonParams.page("0")).toBe(1);
    expect(pokemonParams.page("2.5")).toBe(1);
    expect(pokemonParams.page(undefined)).toBe(1);
  });
});

describe("pokemonRoutes.canonicalList", () => {
  it("leaves an already-canonical URL alone", () => {
    expect(pokemonRoutes.canonicalList(undefined)).toBeNull();
    expect(pokemonRoutes.canonicalList("3")).toBeNull();
  });

  it("strips the param for every spelling of page one", () => {
    expect(pokemonRoutes.canonicalList("1")).toBe("/pokemon");
    expect(pokemonRoutes.canonicalList("0")).toBe("/pokemon");
    expect(pokemonRoutes.canonicalList("-5")).toBe("/pokemon");
    expect(pokemonRoutes.canonicalList("abc")).toBe("/pokemon");
    expect(pokemonRoutes.canonicalList("2.5")).toBe("/pokemon");
  });

  it("keeps a repeated param on its first value", () => {
    expect(pokemonRoutes.canonicalList(["3", "9"])).toBeNull();
  });
});

describe("pokemonParams.id", () => {
  it("rejects ids that are not usable Pokedex numbers", () => {
    expect(pokemonParams.id("25")).toBe(25);
    expect(pokemonParams.id("abc")).toBeNull();
    expect(pokemonParams.id("0")).toBeNull();
    expect(pokemonParams.id("-1")).toBeNull();
  });
});
