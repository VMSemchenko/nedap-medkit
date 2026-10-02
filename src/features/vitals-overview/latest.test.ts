import { describe, expect, it } from "vitest";
import { LOINC } from "@/shared/observations/observation-types";
import { aMeasurement } from "@/shared/observations/test-builders";
import { getNextWalkPage, latestByCode } from "./latest";

describe("latestByCode", () => {
  it("returns the newest reading per LOINC code regardless of input order", () => {
    const oldWeight = aMeasurement({
      code: LOINC.bodyWeight,
      effectiveAt: new Date("2022-01-01T00:00:00Z"),
    });
    const newWeight = aMeasurement({
      code: LOINC.bodyWeight,
      effectiveAt: new Date("2023-01-01T00:00:00Z"),
    });
    const length = aMeasurement({
      code: LOINC.bodyLength,
      effectiveAt: new Date("2021-01-01T00:00:00Z"),
    });

    const latest = latestByCode([newWeight, length, oldWeight]);

    expect(latest.get(LOINC.bodyWeight)).toBe(newWeight);
    expect(latest.get(LOINC.bodyLength)).toBe(length);
  });

  it("has no entry for a code that was never measured", () => {
    expect(latestByCode([]).has(LOINC.heartRate)).toBe(false);
  });
});

describe("getNextWalkPage", () => {
  const required = [LOINC.bodyWeight, LOINC.bodyLength];

  it("asks for the next page while a required code is still missing", () => {
    const seen = [aMeasurement({ code: LOINC.bodyWeight })];

    expect(
      getNextWalkPage({
        measurements: seen,
        requiredCodes: required,
        lastPage: 1,
        pageSize: 20,
        total: 100,
      }),
    ).toBe(2);
  });

  it("stops once every required code has been seen", () => {
    const seen = [
      aMeasurement({ code: LOINC.bodyWeight }),
      aMeasurement({ code: LOINC.bodyLength }),
    ];

    expect(
      getNextWalkPage({
        measurements: seen,
        requiredCodes: required,
        lastPage: 1,
        pageSize: 20,
        total: 100,
      }),
    ).toBeUndefined();
  });

  it("stops at the last page even when a code was never found", () => {
    expect(
      getNextWalkPage({
        measurements: [],
        requiredCodes: required,
        lastPage: 5,
        pageSize: 20,
        total: 100,
      }),
    ).toBeUndefined();
  });
});
