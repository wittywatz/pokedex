import { describe, expect, it } from "vitest";

import {
  formatFlavorText,
  formatGeneration,
  formatName,
  formatPokedexNumber,
} from "./format";

describe("formatPokedexNumber", () => {
  it("pads to three digits", () => {
    expect(formatPokedexNumber(1)).toBe("#001");
    expect(formatPokedexNumber(25)).toBe("#025");
    expect(formatPokedexNumber(151)).toBe("#151");
  });

  it("does not truncate numbers beyond three digits", () => {
    expect(formatPokedexNumber(1025)).toBe("#1025");
  });
});

describe("formatName", () => {
  it("capitalises a plain name", () => {
    expect(formatName("pikachu")).toBe("Pikachu");
  });

  it("splits hyphenated names into words", () => {
    expect(formatName("lightning-rod")).toBe("Lightning Rod");
    expect(formatName("mr-mime")).toBe("Mr Mime");
  });
});

describe("formatFlavorText", () => {
  it("collapses the control characters baked in by the cartridges", () => {
    const raw = "When several of\nthese POKéMON\ngather, their\felectricity";

    expect(formatFlavorText(raw)).toBe(
      "When several of these POKéMON gather, their electricity",
    );
  });

  it("trims and collapses runs of whitespace", () => {
    expect(formatFlavorText("  a\r\n\n  b  ")).toBe("a b");
  });

  it("handles an empty entry", () => {
    expect(formatFlavorText("")).toBe("");
  });
});

describe("formatGeneration", () => {
  it("reduces the API's slug to the numeral", () => {
    expect(formatGeneration("generation-i")).toBe("I");
    expect(formatGeneration("generation-viii")).toBe("VIII");
  });
});
