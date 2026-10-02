import type { Measurement } from "./model";
import { LOINC, LOINC_SYSTEM } from "./observation-types";
import type { ObservationInput } from "./schema";

let nextId = 1;

type ObservationOptions = {
  id?: string;
  code?: string;
  system?: string;
  text?: string;
  display?: string;
  value?: number;
  unit?: string;
  effectiveDateTime?: string;
  patientName?: string;
};

export function anObservation(
  options: ObservationOptions = {},
): ObservationInput {
  return {
    resourceType: "Observation",
    id: options.id ?? `observation-${nextId++}`,
    code: {
      coding: [
        {
          system: options.system ?? LOINC_SYSTEM,
          code: options.code ?? LOINC.bodyWeight,
          display: options.display,
        },
      ],
      text: options.text,
    },
    subject: { display: options.patientName ?? "Wilson Goldner" },
    effectiveDateTime: options.effectiveDateTime ?? "2022-07-06T20:31:41.000Z",
    valueQuantity: { value: options.value ?? 65, unit: options.unit ?? "kg" },
  };
}

export function aBundle(entries: unknown[], total = entries.length) {
  return {
    resourceType: "Bundle",
    type: "searchset",
    total,
    entry: entries.map((resource) => ({ resource })),
  };
}

export function aMeasurement(
  overrides: Partial<Measurement> = {},
): Measurement {
  return {
    id: `measurement-${nextId++}`,
    code: LOINC.bodyWeight,
    label: "Body Weight",
    value: 65,
    unit: "kg",
    effectiveAt: new Date("2022-07-06T20:31:41.000Z"),
    patientName: "Wilson Goldner",
    ...overrides,
  };
}
