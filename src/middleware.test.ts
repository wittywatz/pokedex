import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { middleware } from "./middleware";

const ORIGIN = "https://pokedex.test";

const request = (path: string) =>
  new NextRequest(new URL(path, ORIGIN), { method: "GET" });

describe("middleware", () => {
  it("redirects every spelling of page one to the bare path", () => {
    for (const param of ["0", "-5", "abc", "2.5", "1", ""]) {
      const response = middleware(request(`/pokemon?page=${param}`));

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${ORIGIN}/pokemon`);
    }
  });

  it("passes a canonical URL through untouched", () => {
    for (const path of ["/pokemon", "/pokemon?page=3"]) {
      const response = middleware(request(path));

      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    }
  });
});
