import { NextResponse } from "next/server";

import { routes } from "@/routes";
import type { NextRequest } from "next/server";

// 308: a page param's canonical form cannot change for a given URL, so the
// redirect is safe to cache.
export function middleware(request: NextRequest) {
  const canonical = routes.pokemon.canonicalList(
    request.nextUrl.searchParams.get("page") ?? undefined,
  );

  if (canonical === null) return NextResponse.next();

  return NextResponse.redirect(new URL(canonical, request.nextUrl.origin), 308);
}

export const config = { matcher: "/pokemon" };
