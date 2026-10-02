import { describe, expect, it } from "vitest";
import { parseObservationBundle } from "./api";
import { aBundle, anObservation } from "./test-builders";

describe("parseObservationBundle", () => {
  it("returns the total and the measurements of a valid bundle", () => {
    const bundle = aBundle(
      [anObservation({ id: "a" }), anObservation({ id: "b" })],
      10,
    );

    const result = parseObservationBundle(bundle);

    expect(result.total).toBe(10);
    expect(result.measurements.map((measurement) => measurement.id)).toEqual([
      "a",
      "b",
    ]);
    expect(result.dropped).toEqual([]);
  });

  it("drops an entry without a value and keeps the rest of the page", () => {
    const invalid = { ...anObservation({ id: "bad" }), valueQuantity: {} };
    const bundle = aBundle([anObservation({ id: "a" }), invalid]);

    const result = parseObservationBundle(bundle);

    expect(result.measurements.map((measurement) => measurement.id)).toEqual([
      "a",
    ]);
    expect(result.dropped).toEqual([{ index: 1, reason: expect.any(String) }]);
  });

  it("drops an entry with an invalid date", () => {
    const bundle = aBundle([anObservation({ effectiveDateTime: "yesterday" })]);

    const result = parseObservationBundle(bundle);

    expect(result.measurements).toEqual([]);
    expect(result.dropped).toHaveLength(1);
  });

  it("treats a bundle without entries as an empty page", () => {
    const result = parseObservationBundle({
      resourceType: "Bundle",
      total: 10,
    });

    expect(result).toEqual({ total: 10, measurements: [], dropped: [] });
  });

  it("throws when the response is not a bundle", () => {
    expect(() =>
      parseObservationBundle({ statusCode: 400, message: "Invalid sort" }),
    ).toThrow(/Unexpected response/);
  });
});
