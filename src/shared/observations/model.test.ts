import { describe, expect, it } from "vitest";
import { sortByDateDesc, toMeasurement } from "./model";
import { LOINC } from "./observation-types";
import { ObservationSchema } from "./schema";
import { aMeasurement, anObservation } from "./test-builders";

const parse = (input: ReturnType<typeof anObservation>) =>
  ObservationSchema.parse(input);

describe("toMeasurement", () => {
  it("maps an observation to a measurement", () => {
    const observation = parse(
      anObservation({
        id: "abc",
        code: LOINC.bodyLength,
        value: 186,
        unit: "cm",
        effectiveDateTime: "2018-04-12T10:00:00.000Z",
        patientName: "Wilson Goldner",
      }),
    );

    expect(toMeasurement(observation)).toEqual({
      id: "abc",
      code: LOINC.bodyLength,
      label: "Body Length",
      value: 186,
      unit: "cm",
      effectiveAt: new Date("2018-04-12T10:00:00.000Z"),
      patientName: "Wilson Goldner",
    });
  });

  it("takes label and unit from the LOINC map, not from the API", () => {
    const observation = parse(
      anObservation({
        code: LOINC.heartRate,
        text: "Heart Rate (rest)",
        unit: "beats/minute",
      }),
    );

    expect(toMeasurement(observation)).toMatchObject({
      label: "Heart Rate",
      unit: "/min",
    });
  });

  it("uses the LOINC coding when the observation has several codings", () => {
    const observation = parse({
      ...anObservation(),
      code: {
        coding: [
          { system: "http://snomed.info/sct", code: "27113001" },
          { system: "http://loinc.org", code: LOINC.bodyWeight },
        ],
      },
    });

    expect(toMeasurement(observation).code).toBe(LOINC.bodyWeight);
  });

  it("falls back to code.text and the API unit for an unknown code", () => {
    const observation = parse(
      anObservation({
        code: "9279-1",
        text: "Respiratory rate",
        display: "Breaths",
        unit: "/min",
      }),
    );

    expect(toMeasurement(observation)).toMatchObject({
      label: "Respiratory rate",
      unit: "/min",
    });
  });

  it("falls back to the coding display when an unknown code has no text", () => {
    const observation = parse(
      anObservation({ code: "9279-1", display: "Respiratory rate" }),
    );

    expect(toMeasurement(observation).label).toBe("Respiratory rate");
  });
});

describe("sortByDateDesc", () => {
  it("orders measurements newest first", () => {
    const oldest = aMeasurement({
      effectiveAt: new Date("2020-01-01T00:00:00Z"),
    });
    const newest = aMeasurement({
      effectiveAt: new Date("2022-01-01T00:00:00Z"),
    });
    const middle = aMeasurement({
      effectiveAt: new Date("2021-01-01T00:00:00Z"),
    });

    expect(sortByDateDesc([oldest, newest, middle])).toEqual([
      newest,
      middle,
      oldest,
    ]);
  });

  it("does not mutate its input", () => {
    const older = aMeasurement({
      effectiveAt: new Date("2020-01-01T00:00:00Z"),
    });
    const newer = aMeasurement({
      effectiveAt: new Date("2022-01-01T00:00:00Z"),
    });
    const input = [older, newer];

    sortByDateDesc(input);

    expect(input).toEqual([older, newer]);
  });
});
