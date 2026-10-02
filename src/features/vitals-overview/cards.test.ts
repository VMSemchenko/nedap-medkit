import { describe, expect, it } from "vitest";
import { LOINC } from "@/shared/observations/observation-types";
import { requiredCodesFor } from "./cards";

describe("requiredCodesFor", () => {
  it("lists the LOINC codes behind observation cards and the BMI card without duplicates", () => {
    const codes = requiredCodesFor([
      { kind: "observation", code: LOINC.bodyWeight },
      { kind: "bmi" },
      { kind: "observation", code: LOINC.bodyLength },
    ]);

    expect(codes).toEqual([LOINC.bodyWeight, LOINC.bodyLength]);
  });
});
