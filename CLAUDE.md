# Body Check Dashboard

React + TS dashboard for one patient's FHIR Observations.
API: https://body-check-dashboard-phi.vercel.app/api/observations

## Commands

- `bun install` · `bun run dev` · `bun run build`
- `bun run test:watch` while developing, `bun run test` for a single run. Never `bun test`: that's bun's own runner, not Vitest.
- `bun run typecheck` · `bun run lint` · `bun run format`
- shadcn: `bunx --bun shadcn@latest add <name>`. Never hand-write files in `src/components/ui`.

## Workflow: TDD

Logic in `src/shared/` and in feature `.ts` files (not components) is written test-first:

1. Red: write one failing test for the next behaviour. Run it and check it fails for the expected reason.
2. Green: write the minimum code that makes it pass.
3. Refactor: clean up code and test with the suite green. Then the next behaviour.

- A bug fix starts with a failing test that reproduces it.
- Components and hooks are thin glue: they call tested functions and render. If one needs logic worth testing, move it into a pure function and test-drive that.
- One behaviour per test, Arrange-Act-Assert, test names read as specs
  ("returns the newest reading per LOINC code regardless of input order").
- Build test data with `shared/observations/test-builders.ts`, not large JSON fixtures. The time zone is pinned.
- Before each commit, `bun run test`, `bun run typecheck` and `bun run lint` pass. Commit after each green milestone.

## Clean code

- Names explain intent. No abbreviations except domain terms (FHIR, LOINC, BMI). Booleans read as `is/has/should…`.
- Small functions with one job; early returns instead of nesting. Domain logic is pure.
- No magic values: LOINC codes live in `observation-types.ts`, config in `src/config/env.ts`.
- Strict TS: no `any`, no `!` non-null assertions, no `as` casts on API data. Types come from Zod (`z.infer`).
- Never mutate inputs; copy before sorting.
- Loading, error and empty states are always handled explicitly.
- No speculative abstractions: extract on the second real use. Delete dead code; never comment it out.
- One component per file, named exports, file name matches the export.

## Comments

- Default to none. If code needs a comment to be understood, rename or split it instead.
- Only for a non-obvious _why_: an API quirk, a FHIR/spec reference, a deliberate trade-off. One line, next to the code.
- No comments that restate the code, no JSDoc on self-explanatory functions, no section dividers, no TODOs (unfinished work goes in the README).
- When editing, don't add comments describing the change; remove stale comments in code you touch.

## Architecture: vertical slices

- `src/features/<slice>/` owns its hooks, logic and UI. Slices never import each other; only `src/app/` combines them, through each slice's `index.ts`.
- `src/shared/observations/` is the only FHIR-aware code: schema, fetch, LOINC map, formatting. No React.
- All config goes through `src/config/env.ts`. Never read `import.meta.env` elsewhere; new vars go in its schema and in `.env.example`.

## API facts that aren't in the docs

- Data is regenerated on every request; page N+1 is not a continuation of page N.
- `count` is the dataset size (default 10, max 800), not the page size. Always send it from env.
- `sort`: `asc | desc | random` (default random; anything else → 400). Bad `page`/`pageSize` silently fall back to defaults.
- No type filter and no `link` entries: totalPages = ceil(total / pageSize).

## Data rules

- List order comes from the server (`sort=desc`); the browser only re-sorts within a page, as a safeguard.
- Latest per type = `latestByCode()` by `effectiveAt`; never assume the order of the input.
- Validate with Zod per entry: drop and log bad entries, never fail the whole page.
- Labels and units come only from `observation-types.ts`, keyed by LOINC code.
- Display formatting only through `shared/observations/format.ts` (nl-NL, time zone from env). No `toLocaleString` in components.
- Follow the Figma design; list deviations in the README.

## Priorities

1. Measurements list with API pagination 2. Body Length, Body Weight, BMI cards 3. Remaining cards 4. Responsive layout.
   Unfinished work goes in the README, not hidden.
