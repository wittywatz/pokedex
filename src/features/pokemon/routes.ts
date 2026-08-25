import {
  buildPath,
  firstValue,
  parsePositiveInt,
  parsePositiveIntOr,
} from "@/lib/params";

import type { Param } from "@/lib/params";

const BASE = "/pokemon";

/** Page 1 is canonical, so it carries no query. */
const listPath = (page = 1) =>
  buildPath(BASE, { page: page > 1 ? page : undefined });

export const pokemonParams = {
  /** No upper clamp: that needs the total, which only the response carries. */
  page: (param: Param) => parsePositiveIntOr(param, 1),

  id: (param: Param) => parsePositiveInt(param),
};

export const pokemonRoutes = {
  list: listPath,

  /** `from` lets the detail page send you back to the page you came from. */
  detail: (id: number, from = 1) =>
    buildPath(`${BASE}/${id}`, { from: from > 1 ? from : undefined }),

  /** Where a raw `page` param should have led, or null if it already did. */
  canonicalList: (param: Param): string | null => {
    const page = pokemonParams.page(param);
    const canonical = page > 1 ? String(page) : undefined;

    return firstValue(param) === canonical ? null : listPath(page);
  },
};
