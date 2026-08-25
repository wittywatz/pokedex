import { describe, expect, it } from "vitest";

import {
  buildPath,
  firstValue,
  parsePositiveInt,
  parsePositiveIntOr,
} from "./params";

describe("firstValue", () => {
  it("passes a single value through", () => {
    expect(firstValue("18")).toBe("18");
  });

  it("takes the first of a repeated param", () => {
    expect(firstValue(["18", "36"])).toBe("18");
  });

  it("returns undefined for a missing param", () => {
    expect(firstValue(undefined)).toBeUndefined();
    expect(firstValue([])).toBeUndefined();
  });
});

describe("parsePositiveInt", () => {
  it("parses a positive whole number", () => {
    expect(parsePositiveInt("18")).toBe(18);
  });

  it.each(["0", "-1", "1.5", "abc", "", " ", undefined, "Infinity", "1e3abc"])(
    "rejects %o",
    (input) => {
      expect(parsePositiveInt(input)).toBeNull();
    },
  );

  it("falls back rather than returning null when asked", () => {
    expect(parsePositiveIntOr("abc", 0)).toBe(0);
    expect(parsePositiveIntOr("18", 0)).toBe(18);
  });
});

describe("buildPath", () => {
  it("returns a bare path when there is no query", () => {
    expect(buildPath("/pokemon")).toBe("/pokemon");
  });

  it("omits absent values", () => {
    expect(buildPath("/pokemon", { offset: null })).toBe("/pokemon");
    expect(buildPath("/pokemon", { offset: undefined })).toBe("/pokemon");
    expect(buildPath("/pokemon", { q: "" })).toBe("/pokemon");
  });

  it("keeps a zero, which is a value rather than an absence", () => {
    expect(buildPath("/results", { score: 0 })).toBe("/results?score=0");
  });

  it("appends the values that are present", () => {
    expect(buildPath("/pokemon", { offset: 18 })).toBe("/pokemon?offset=18");
  });

  it("encodes values rather than concatenating them raw", () => {
    expect(buildPath("/search", { q: "pikachu & raichu" })).toBe(
      "/search?q=pikachu+%26+raichu",
    );
  });
});
