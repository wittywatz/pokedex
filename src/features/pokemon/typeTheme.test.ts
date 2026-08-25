import { describe, expect, it } from "vitest";

import { TYPE_COLORS, getTypeColor } from "./typeTheme";

describe("getTypeColor", () => {
  it("returns the accent for a known type", () => {
    expect(getTypeColor("electric")).toBe(TYPE_COLORS.electric);
  });

  it("falls back for a type the API adds later", () => {
    expect(getTypeColor("cosmic")).toBe(getTypeColor(undefined));
  });

  it("falls back for a Pokemon with no types at all", () => {
    expect(getTypeColor(undefined)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("does not treat inherited object properties as types", () => {
    expect(getTypeColor("toString")).toBe(getTypeColor(undefined));
  });
});
