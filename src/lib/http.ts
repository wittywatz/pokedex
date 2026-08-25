import type { z } from "zod";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    statusText: string,
  ) {
    super(`Request to ${url} failed with ${status} ${statusText}`);
    this.name = "ApiError";
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

/** Separate from ApiError: this one means the upstream contract moved. */
export class SchemaError extends Error {
  constructor(
    readonly url: string,
    readonly issues: z.core.$ZodIssue[],
  ) {
    const summary = issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");

    super(`Response from ${url} did not match the expected shape - ${summary}`);
    this.name = "SchemaError";
  }
}

export type FetchOptions = {
  /** Seconds. */
  revalidate?: number;
};

export async function fetchJson<Schema extends z.ZodType>(
  url: string,
  schema: Schema,
  { revalidate }: FetchOptions = {},
): Promise<z.infer<Schema>> {
  const response = await fetch(url, {
    next: revalidate === undefined ? undefined : { revalidate },
  });

  if (!response.ok) {
    throw new ApiError(response.status, url, response.statusText);
  }

  const result = schema.safeParse(await response.json());

  if (!result.success) {
    throw new SchemaError(url, result.error.issues);
  }

  return result.data;
}

/** As `fetchJson`, but a 404 is an answer rather than a failure. */
export async function fetchJsonOrNull<Schema extends z.ZodType>(
  url: string,
  schema: Schema,
  options: FetchOptions = {},
): Promise<z.infer<Schema> | null> {
  try {
    return await fetchJson(url, schema, options);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null;
    throw error;
  }
}
