# Body Check Dashboard

React + TypeScript dashboard for one patient's FHIR Observations: a row of latest-per-type cards and a paginated list of measurements.

## Run

```
bun install
bun run dev
```

`bun run test` (Vitest), `bun run typecheck`, `bun run lint`, `bun run build`.
Configuration is read through `src/config/env.ts`; see `.env.example` for every variable and its default.

## Structure

Vertical slices in `src/features/` (`measurements-list`, `vitals-overview`, `patient-header`) that never import each other; `src/app/` combines them. `src/shared/observations/` is the only FHIR-aware code (Zod schema, fetch, LOINC map, formatting).

## Assumptions

- The mock API regenerates its data on every request, so the cards, the list and the patient name can disagree, and values change on refetch. Cache timing is configurable through env.
- The API has no type filter, so the cards walk pages (`sort=desc`) until every card's LOINC code is found or the last page is reached. A real FHIR server would use `?code=…&_sort=-date&_count=1` or `Observation/$lastn` instead.
- Each entry is validated with Zod; invalid entries are dropped and logged, and the rest of the page still renders.
- BMI is calculated from the latest weight and height. Its date is the later of the two dates. It shows `—` if either is missing or height is not positive.
- The patient name comes from `subject.display` of the observations; a real backend would use `GET Patient/{id}`.
- Blood Pressure is a single `valueQuantity` in this API; real FHIR uses `component[]` for systolic and diastolic.
- The page number lives in the URL (`?page=N`) and is clamped to the valid range.
- Dates and numbers use `nl-NL`; the time zone is the browser's unless `VITE_TIME_ZONE` is set.

## Deviations from the design

- The design is desktop only; the mobile layout is our own (cards in 1→2→3 columns, the table scrolls sideways).
- One label per LOINC code everywhere, so the design's "Body length" card reads "Body Length".
- The design's BMI `25,5` doesn't match its own 65 kg / 186 cm (18,8); the card shows the calculated value.
- The design shows the heart-rate row without a unit and the glucose row with `cm`; the app uses the unit for the LOINC code.
- Blood Glucose has no card, as in the design; it appears only in the list.

## Not done

- The row "…" actions are visible but disabled ("Not in scope").
- Pagination is Previous/Next only, as in the design; no page-size selector.
- No component or end-to-end tests; only the pure logic is unit-tested.
- No i18n beyond `nl-NL`.
