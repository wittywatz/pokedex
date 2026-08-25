/** How Next hands search params through. */
export type Param = string | string[] | undefined;

/** A repeated param (`?a=1&a=2`) arrives as an array; take the first. */
export function firstValue(param: Param): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export function parsePositiveInt(param: Param): number | null {
  const parsed = Number(firstValue(param));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parsePositiveIntOr(param: Param, fallback: number): number {
  return parsePositiveInt(param) ?? fallback;
}

type QueryValue = string | number | null | undefined;

/** Zero is a value, not an absence; pass `undefined` to omit a key. */
export function buildPath(
  pathname: string,
  query: Record<string, QueryValue> = {},
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") continue;
    params.set(key, String(value));
  }

  const search = params.toString();

  return search ? `${pathname}?${search}` : pathname;
}
