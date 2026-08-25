import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ApiError, SchemaError, fetchJson, fetchJsonOrNull } from "./http";

const schema = z.object({ id: z.number(), name: z.string() });

function stubFetch(body: unknown, init: { status?: number } = {}) {
  const status = init.status ?? 200;
  const response = {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 404 ? "Not Found" : "OK",
    json: async () => body,
  };

  return vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchJson", () => {
  it("returns the parsed body when it matches", async () => {
    stubFetch({ id: 25, name: "pikachu" });

    await expect(fetchJson("/x", schema)).resolves.toEqual({
      id: 25,
      name: "pikachu",
    });
  });

  it("strips fields we did not declare", async () => {
    stubFetch({ id: 25, name: "pikachu", moves: Array(109).fill("...") });

    await expect(fetchJson("/x", schema)).resolves.toEqual({
      id: 25,
      name: "pikachu",
    });
  });

  it("throws ApiError carrying the status", async () => {
    stubFetch(null, { status: 500 });

    await expect(fetchJson("/x", schema)).rejects.toBeInstanceOf(ApiError);
  });

  it("throws SchemaError naming the offending field", async () => {
    stubFetch({ id: "twenty-five", name: "pikachu" });

    await expect(fetchJson("/x", schema)).rejects.toThrow(/id:/);
    await expect(fetchJson("/x", schema)).rejects.toBeInstanceOf(SchemaError);
  });

  it("passes the revalidate window through to fetch", async () => {
    stubFetch({ id: 25, name: "pikachu" });
    await fetchJson("/x", schema, { revalidate: 86_400 });

    expect(fetch).toHaveBeenCalledWith("/x", {
      next: { revalidate: 86_400 },
    });
  });
});

describe("fetchJsonOrNull", () => {
  it("turns a 404 into null so the caller can render not-found", async () => {
    stubFetch(null, { status: 404 });

    await expect(fetchJsonOrNull("/x", schema)).resolves.toBeNull();
  });

  it("still throws on other failures", async () => {
    stubFetch(null, { status: 500 });

    await expect(fetchJsonOrNull("/x", schema)).rejects.toBeInstanceOf(
      ApiError,
    );
  });

  it("still throws when the shape is wrong", async () => {
    stubFetch({ id: "nope", name: "pikachu" });

    await expect(fetchJsonOrNull("/x", schema)).rejects.toBeInstanceOf(
      SchemaError,
    );
  });
});
