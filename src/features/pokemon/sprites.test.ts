import { describe, expect, it } from "vitest";

import { getFallbackSpriteUrl, getSpriteUrl } from "./sprites";

describe("sprite URLs", () => {
  it("builds the official artwork URL from the id", () => {
    expect(getSpriteUrl(25)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    );
  });

  it("builds the pixel sprite URL, which exists for every form", () => {
    expect(getFallbackSpriteUrl(10322)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10322.png",
    );
  });

  it("keeps both on the host allowed by next.config", () => {
    for (const url of [getSpriteUrl(1), getFallbackSpriteUrl(1)]) {
      expect(new URL(url).hostname).toBe("raw.githubusercontent.com");
      expect(new URL(url).pathname.startsWith("/PokeAPI/sprites/")).toBe(true);
    }
  });
});
