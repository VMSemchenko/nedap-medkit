import { describe, expect, it } from "vitest";
import { LOINC } from "@/shared/observations/observation-types";
import { aMeasurement } from "@/shared/observations/test-builders";
import { calculateBmi } from "./bmi";

const weight = (value: number, effectiveAt = "2022-01-01T00:00:00Z") =>
  aMeasurement({
    code: LOINC.bodyWeight,
    value,
    effectiveAt: new Date(effectiveAt),
  });
const length = (value: number, effectiveAt = "2022-01-01T00:00:00Z") =>
  aMeasurement({
    code: LOINC.bodyLength,
    value,
    effectiveAt: new Date(effectiveAt),
  });

describe("calculateBmi", () => {
  it("divides weight in kg by the squared height in metres", () => {
    const bmi = calculateBmi(weight(65), length(186));

    expect(bmi?.value).toBeCloseTo(18.79, 2);
  });

  it("is dated with the later of the two readings", () => {
    const bmi = calculateBmi(
      weight(65, "2022-01-01T00:00:00Z"),
      length(186, "2023-06-01T00:00:00Z"),
    );

    expect(bmi?.effectiveAt).toEqual(new Date("2023-06-01T00:00:00Z"));
  });

  it("is unknown when the weight is missing", () => {
    expect(calculateBmi(undefined, length(186))).toBeUndefined();
  });

  it("is unknown when the length is missing", () => {
    expect(calculateBmi(weight(65), undefined)).toBeUndefined();
  });

  it("is unknown when the length is zero", () => {
    expect(calculateBmi(weight(65), length(0))).toBeUndefined();
  });
});
