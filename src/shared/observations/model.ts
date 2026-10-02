import { findObservationType, LOINC_SYSTEM } from "./observation-types";
import type { Observation } from "./schema";

export type Measurement = {
  id: string;
  code: string;
  label: string;
  value: number;
  unit: string;
  effectiveAt: Date;
  patientName: string | undefined;
};

export function toMeasurement(observation: Observation): Measurement {
  const { coding, text } = observation.code;
  const primaryCoding =
    coding.find((candidate) => candidate.system === LOINC_SYSTEM) ?? coding[0];
  const knownType = findObservationType(primaryCoding.code);

  return {
    id: observation.id,
    code: primaryCoding.code,
    label:
      knownType?.label ?? text ?? primaryCoding.display ?? primaryCoding.code,
    value: observation.valueQuantity.value,
    unit: knownType?.unit ?? observation.valueQuantity.unit ?? "",
    effectiveAt: new Date(observation.effectiveDateTime),
    patientName: observation.subject?.display,
  };
}

export function sortByDateDesc(measurements: Measurement[]): Measurement[] {
  return [...measurements].sort(
    (first, second) =>
      second.effectiveAt.getTime() - first.effectiveAt.getTime(),
  );
}
