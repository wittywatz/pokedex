import { describe, expect, it } from "vitest";

import {
  eeveeChain,
  pikachu,
  pikachuChain,
  pikachuSpecies,
} from "./__fixtures__/pikachu";
import { PAGE_SIZE } from "./constants";
import { getSpriteUrl } from "./sprites";
import {
  getIdFromUrl,
  offsetForPage,
  toDetail,
  toSummary,
  totalPagesForCount,
} from "./transform";

describe("getIdFromUrl", () => {
  it("reads the id off a detail URL, trailing slash or not", () => {
    expect(getIdFromUrl("https://pokeapi.co/api/v2/pokemon/152/")).toBe(152);
    expect(getIdFromUrl("https://pokeapi.co/api/v2/pokemon/152")).toBe(152);
  });

  it("throws rather than yielding NaN when the URL is not one", () => {
    expect(() => getIdFromUrl("https://pokeapi.co/api/v2/pokemon/")).toThrow(
      /Could not read a Pokemon id/,
    );
  });
});

describe("offsetForPage", () => {
  it("starts the first page at the top of the register", () => {
    expect(offsetForPage(1)).toBe(0);
  });

  it("advances a whole page at a time", () => {
    expect(offsetForPage(2)).toBe(PAGE_SIZE);
    expect(offsetForPage(3)).toBe(PAGE_SIZE * 2);
  });
});

describe("totalPagesForCount", () => {
  it("rounds a partial last page up", () => {
    expect(totalPagesForCount(PAGE_SIZE * 3)).toBe(3);
    expect(totalPagesForCount(PAGE_SIZE * 3 + 1)).toBe(4);
  });

  it("reports one page when the register is empty", () => {
    // Otherwise the controls read "page 1 of 0".
    expect(totalPagesForCount(0)).toBe(1);
  });
});

describe("toSummary", () => {
  it("derives id and sprite from the list resource alone", () => {
    expect(
      toSummary({
        name: "chikorita",
        url: "https://pokeapi.co/api/v2/pokemon/152/",
      }),
    ).toEqual({
      id: 152,
      name: "chikorita",
      spriteUrl: getSpriteUrl(152),
    });
  });
});

describe("toDetail", () => {
  const detail = toDetail(pikachu, pikachuSpecies, pikachuChain);

  it("converts decimetres and hectograms to metres and kilograms", () => {
    expect(detail.height).toBe(0.4);
    expect(detail.weight).toBe(6);
  });

  it("picks the English genus and flavour text, not the first entry", () => {
    expect(detail.genus).toBe("Mouse Pokémon");
    expect(detail.flavorText).toBe(
      "When several of these POKéMON gather, their electricity",
    );
  });

  it("labels stats and totals them", () => {
    expect(detail.stats.map((stat) => stat.label)).toEqual([
      "HP",
      "Attack",
      "Defense",
      "Sp. Atk",
      "Sp. Def",
      "Speed",
    ]);
    expect(detail.statTotal).toBe(320);
  });

  it("carries an abbreviation for narrow screens", () => {
    expect(detail.stats.map((stat) => stat.shortLabel)).toEqual([
      "HP",
      "ATK",
      "DEF",
      "SP.A",
      "SP.D",
      "SPD",
    ]);
  });

  it("falls back to the full label for a stat it does not know", () => {
    const odd = toDetail(
      {
        ...pikachu,
        stats: [{ base_stat: 10, stat: { name: "luck", url: "" } }],
      },
      pikachuSpecies,
      pikachuChain,
    );

    expect(odd.stats[0]).toMatchObject({ label: "Luck", shortLabel: "Luck" });
  });

  it("flags hidden abilities and formats their names", () => {
    expect(detail.abilities).toEqual([
      { name: "Static", isHidden: false },
      { name: "Lightning Rod", isHidden: true },
    ]);
  });

  it("marks the current Pokemon in its evolution line", () => {
    expect(detail.evolutionLine.map((stage) => stage.id)).toEqual([
      172, 25, 26,
    ]);
    expect(
      detail.evolutionLine.filter((stage) => stage.isCurrent),
    ).toHaveLength(1);
    expect(detail.evolutionLine[1].isCurrent).toBe(true);
  });

  it("flattens a branching chain into one ordered line", () => {
    const eevee = toDetail(
      { ...pikachu, id: 133, name: "eevee" },
      pikachuSpecies,
      eeveeChain,
    );

    expect(eevee.evolutionLine.map((stage) => stage.id)).toEqual([
      133, 134, 135, 136,
    ]);
  });

  it("reads the species from the response, not from the Pokemon id", () => {
    // Alternate forms above #10000 have no species of their own; building the
    // species URL from the id 404s.
    expect(pikachu.species.url).toContain("/pokemon-species/25/");
  });

  it("formats habitat and generation for display", () => {
    expect(detail.habitat).toBe("Forest");
    expect(detail.generation).toBe("I");
  });

  it("reports no habitat rather than crashing when the API omits it", () => {
    const homeless = toDetail(
      pikachu,
      { ...pikachuSpecies, habitat: null },
      pikachuChain,
    );

    expect(homeless.habitat).toBeNull();
  });

  it("falls back when there is no English genus or flavour text", () => {
    const sparse = toDetail(
      pikachu,
      { ...pikachuSpecies, genera: [], flavor_text_entries: [] },
      pikachuChain,
    );

    expect(sparse.genus).toBe("Unknown Pokémon");
    expect(sparse.flavorText).toBe("");
  });

  it("orders types by slot without mutating the response", () => {
    const reversed = {
      ...pikachu,
      types: [
        { slot: 2, type: { name: "poison", url: "" } },
        { slot: 1, type: { name: "grass", url: "" } },
      ],
    };

    expect(toDetail(reversed, pikachuSpecies, pikachuChain).types).toEqual([
      "grass",
      "poison",
    ]);
    expect(reversed.types[0].slot).toBe(2);
  });

  it("clamps a stat above the shared scale so bars cannot overflow", () => {
    const monster = {
      ...pikachu,
      stats: [{ base_stat: 400, stat: { name: "hp", url: "" } }],
    };

    expect(toDetail(monster, pikachuSpecies, pikachuChain).stats[0].value).toBe(
      255,
    );
  });
});
