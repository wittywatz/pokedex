# Pokédex

A server-rendered Pokédex built on [PokéAPI](https://pokeapi.co). Browse the
register a page at a time, open any entry for its Pokédex text, base stats,
abilities and evolution line, and walk between related Pokémon from there.

## Running it

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm test                     # vitest
npm run test:watch           # vitest in watch mode
npm run lint                 # eslint, including import-boundary rules
npm run typecheck            # tsc --noEmit
npm run build && npm start   # production build
```

## The API

All data comes from [PokéAPI](https://pokeapi.co), from four endpoints:

| Endpoint                       | Used for                                                 |
| ------------------------------ | -------------------------------------------------------- |
| `/pokemon?offset=<n>&limit=18` | The list page                                            |
| `/pokemon/{id}`                | Types, stats, abilities, height, weight, base experience |
| `/pokemon-species/{id}`        | Genus, Pokédex text, generation, habitat, capture rate   |
| `/evolution-chain/{id}`        | The evolution line, followed from the species response   |

A single `?limit=151` call would pull the original generation in one request.
This uses the same endpoint with `PAGE_SIZE` as the limit and the offset walking
the register, so the list covers every Pokémon rather than stopping at Mew and
no one request grows with the size of the register. The offset is an API
detail: the app's own URLs count pages, and `api.ts` converts one to the other
at the moment it builds the request.

## Routes

| Route                   | Renders                                                   |
| ----------------------- | --------------------------------------------------------- |
| `/`                     | Landing page into the Pokédex                             |
| `/pokemon`              | Paginated grid, 18 per page                               |
| `/pokemon?page=2`       | Any later page                                            |
| `/pokemon/[id]`         | One Pokémon's entry                                       |
| `/pokemon/[id]?from=2`  | The same entry, remembering which list page you came from |

## How it is put together

Everything Pokémon-related lives in `src/features/pokemon/`. The `src/app/`
files are thin: they await params, call one function, and render components.

```
.github/workflows/ci.yml       lint, typecheck, test and build on every push
eslint.config.mjs              lint rules, including import boundaries
next.config.ts                 allowed image hosts
vitest.config.ts               test runner
src/
  app/
    layout.tsx                 app shell, fonts, header
    globals.css                design tokens and component classes
    page.tsx                   landing
    pokemon/
      page.tsx                 list route
      loading.tsx              skeleton grid
      error.tsx                fetch failure
      [id]/
        page.tsx               detail route
        loading.tsx            skeleton entry
        error.tsx              fetch failure
        not-found.tsx          unknown Pokédex number
  components/ui/
    Button.tsx                 button and link, with variants
    PageContainer.tsx          the column every page sits in
    Pagination.tsx             generic previous/next bar, any feature can use
    StatusMessage.tsx          errors, not-found, empty states
  lib/
    cn.ts                      class merging (tailwind-merge + clsx)
    http.ts                    shared fetcher: caching, ApiError, schema parsing
    params.ts                  search-param reading and path building
    *.test.ts                  tests sit beside what they cover
  middleware.ts                canonicalises list URLs before they render
  routes.ts                    app-wide route registry
  features/pokemon/
    index.ts                   the feature's public API
    api.ts                     the only module that talks to PokéAPI
    pokeapi.ts                 PokéAPI's response schemas (zod)
    transform.ts               validated responses -> view models
    types.ts                   view models the UI renders
    routes.ts                  its URLs and param parsing
    format.ts                  display strings
    constants.ts               PAGE_SIZE, MAX_STAT
    sprites.ts                 sprite URLs derived from the id
    typeTheme.ts               type -> accent colour
    components/                presentational components
    __fixtures__/              API fixtures for tests
    *.test.ts                  tests sit beside what they cover
```

Next 16 (App Router) and React 19, Tailwind v4, zod for response validation,
Vitest for tests. `server-only` keeps the fetching module off the client.

Each module has one reason to change. `pokeapi.ts` changes when PokéAPI does,
and outside its own tests only `api.ts` and `transform.ts` import it — an
upstream schema change cannot reach the components. `transform.ts` is pure and
needs no network to test.

### Adding a feature

1. Create `src/features/<name>/` with the modules above; only add what you need.
2. Export its public surface from `src/features/<name>/index.ts`.
3. Register its routes in `src/routes.ts`.
4. Add its route folder under `src/app/`, keeping the page thin — parse params,
   call one function, render components.

Reuse `src/lib/http.ts` for fetching and `src/lib/params.ts` for params rather
than writing your own. Both are covered by tests.

### Boundaries, enforced

ESLint fails the build on imports that cross a boundary:

- Nothing outside a feature may import past its barrel — `@/features/pokemon`
  is fine, `@/features/pokemon/transform` is an error.
- One exception, declared in the config: `@/features/*/routes`. A feature's URL
  rules are pure and have to be reachable from `middleware.ts`, which runs
  before the server component graph exists and so cannot import a barrel that
  re-exports `server-only` code. A feature has two public surfaces — its routes,
  importable anywhere, and everything else, importable from the server.
- Features reach each other only through those barrels.
- `src/lib` may not import a feature; shared code stays shared.

Run `npm run lint` to check.

## Decisions

**Everything renders on the server.** The only client components are the two
error boundaries, which need it for their retry handler, and `PokemonArtwork`,
which needs `onError`. No client-side data fetching, no state library.

**Generic UI lives in `src/components/ui`.** Pagination, buttons, the page
container and the status message know nothing about Pokémon — a second feature
paginates and reports errors without reimplementing either. Anything
Pokémon-specific stays in the feature.

**Shared components extend their element's props.** Each takes
`React.ComponentProps<"button">` (or `"nav"`, `"div"`, next/image's) and spreads
the rest onto the element, so adding `type`, `disabled`, `aria-*` or an extra
class is a call-site change, not an edit to the component. `cn()` merges the
component's classes with the caller's. Where a prop name would collide with a
DOM attribute the local one is renamed — `PokemonArtwork` takes `pokemonId`,
because `id` would intersect with the DOM's `id` and resolve to `never`.

**Pagination is pinned to the bottom of the viewport.** Reachable without
scrolling the grid, and still in place after the page changes — otherwise every
page turn costs a scroll to the bottom and back. Labels abbreviate below 640px
rather than collapsing to bare arrows.

**Sprites fall back.** Alternate forms above #10000 sometimes have no official
artwork; `PokemonArtwork` swaps to the pixel sprite when the render fails, which
exists for every form.

**The URL counts pages, not records.** `?page=3` rather than `?offset=36`.
There is no such thing as a mid-page value to snap back, junk falls to page 1,
and the upstream paging model stays out of our URLs.

**Pagination is our arithmetic, not the API's.** We ignore the `next`/`previous`
URLs PokéAPI returns and derive everything from `count`: `totalPages`, and
whether a neighbour exists (`page > 1`, `page < totalPages`). So which pages
exist is decided in one tested place rather than inferred from a response.
`PAGE_SIZE` in `constants.ts` is the single knob.

**The URL never disagrees with the page it rendered.** Out-of-range values go
to the page they actually resolve to, at both ends — but the two ends know
different things, so they run in different places.

Below the range, the answer is in the param alone: `?page=0`, `?page=-5`,
`?page=abc` and an explicit `?page=1` all mean the bare `/pokemon`. No data is
needed to say so, so `middleware.ts` says it before the route renders, and the
response is a real `308` with a `Location` header. A junk URL never reaches
PokéAPI. 308 rather than 307 because the rule cannot change for a given URL, so
the redirect is safe for a browser to cache.

Above the range, the answer is in the response: `?page=99999` is only wrong once
`count` says how many pages there are, so the list route compares `page` against
`totalPages` and redirects to the last real page. By then the shell has already
streamed — `loading.tsx` puts the route behind a Suspense boundary — so Next
falls back to a client-side redirect rather than an HTTP one. Moving it earlier
would mean fetching in middleware on every list request to answer a question
almost no request asks. The trade is deliberate: the common path stays one
fetch, and the rare wrong URL pays a redirect.

**No path is hand-written.** Each feature owns its URLs in its own `routes.ts`,
building links and parsing params back off them, so `?from=` could be renamed in
one place. `src/routes.ts` composes those into one registry, so the app shell
links to a feature without importing it. Pages parse, components link.

**The list remembers where you were.** Cards carry `?from=<page>`, so "Back to
Pokédex" from Gengar returns you to page 5, not page 1.

**Type colour is the design system's variable.** The primary type sets an
`--accent` custom property once on the detail page's root element, and every
`accent-*` class inherits it — the hero panel, the stat segments, the current
evolution stage. It cannot be a static Tailwind class because it arrives from
the API at request time. Everything else is a token: colours, label styles and
repeated surfaces are defined in `src/app/globals.css` as `@theme` values and
component classes (`.label`, `.panel`, `.tile`, `.button`), not inlined at call
sites.

**Responses are validated, not trusted.** `pokeapi.ts` declares zod schemas for
the fields we read; `src/lib/http.ts` parses every response against one. A
renamed field upstream throws a `SchemaError` naming the field, at the boundary,
instead of surfacing as an `undefined` inside a component. Unknown fields are
stripped, so the `moves` array never reaches the client.

**Responses are cached for a day** (`revalidate: 86400`). The Pokédex does not
change, and the detail page's three calls are each cached and deduped within a
request. They have to run in sequence rather than in parallel: the species URL
comes from the Pokémon response and the chain URL from the species response.
Following those URLs rather than rebuilding them from the id is what makes
alternate forms work — Pokémon above #10000 have no species of their own, so
`/pokemon-species/10322` is a 404 while the response points at species 978.

**Branching evolution chains are flattened.** Eevee has eight children; the
chain is walked depth-first into a single scrollable line, which is correct for
the overwhelming majority and readable for the rest.

**CI runs the same four commands you would.** `.github/workflows/ci.yml` runs
`lint`, `typecheck`, `test` and `build` on every push and pull request, in that
order — cheapest feedback first. They are the project's own npm scripts rather
than a reimplementation in YAML, so a green run means exactly what a green
terminal means, and there is no second definition of "passing" to drift.

**A streamed route's status code is settled before its body runs.**
`/pokemon/99999` renders the not-found entry, and the response stays 200: Next
flushes headers as it begins streaming a dynamic route, which is necessarily
before `notFound()` is reached. I traced that to the framework rather than to
application code by moving `notFound()` to the component's first line and by
removing `loading.tsx` — both still returned 200, while the static `/nope` route
returns a correct 404. The distinction matters for anything that reads the
status rather than the page: a crawler, a health check, an uptime monitor. What
the user sees is the not-found entry either way.

## Tests

Tests sit beside the modules they cover, and there is no network and no test
server: almost everything under test is a pure function. The two that are not
are exercised directly — `http.ts` with `fetch` stubbed, and the middleware by
handing it a `NextRequest` and reading the response it returns.

| Suite                | Covers                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `transform.test.ts`  | Mapping: unit conversion, English-entry selection, stat totals and clamping, branching evolution chains, missing habitat |
| `format.test.ts`     | Pokédex numbers, hyphenated names, cartridge control characters in flavour text                                          |
| `routes.test.ts`     | Link building, param parsing and URL canonicalisation, including a round trip                                            |
| `lib/params.test.ts` | Repeated params, junk input, query encoding, omitted defaults                                                            |
| `lib/http.test.ts`   | Status handling, 404-as-null, schema failures, cache options — with `fetch` stubbed                                      |
| `typeTheme.test.ts`  | Known types, unknown types, prototype-chain lookups                                                                      |
| `sprites.test.ts`    | Both sprite URLs, and that each stays on the host `next.config.ts` allows                                                |
| `lib/cn.test.ts`     | Class joining, Tailwind conflict resolution, and that every `@theme` token is registered with tailwind-merge             |
| `middleware.test.ts` | That every non-canonical `?page=` 308s to the bare path, and that a canonical URL passes through untouched               |

The `typeTheme` suite earns its place. `in` matches inherited members, so a
lookup for a type named `toString` resolves to a function where a colour was
expected — the test drove the move to `Object.hasOwn`, and now guards every
lookup keyed by a string the API supplies.

The suite stops where a browser becomes necessary. Components and route
composition are behaviour worth asserting end to end, with Playwright against a
running app, rather than through a JSDOM approximation of one. Keeping the
interesting logic in pure functions is what makes that line clean to draw:
mapping, formatting, paging and param rules are all covered without a network or
a DOM.

### Responsive

Layout was checked in Chrome at 320, 375, 414, 768, 1024 and 1440 px across the
home, list, detail and long-name pages: no page scrolls horizontally at any of
them, and every link and button clears the 44px touch minimum. Display type is
fluid (`clamp`) rather than stepped, because a heavy uppercase face overflows a
narrow viewport long before a breakpoint catches it. Stat labels abbreviate to
`ATK` / `SP.A` on phones, where the full words crowd the bars.

## Scope

A Playwright job is the one addition CI is waiting on, once the browser-level
tests described above exist. Search and type filtering are not implemented; the list is the paginated
register. The structure anticipates them without paying for them now: either
would land inside `features/pokemon` as a module beside `api.ts` with its params
in the feature's own `routes.ts`, and neither would touch the shared UI or any
other feature. That is the point of the boundary — the next feature is an
addition, not an edit.
