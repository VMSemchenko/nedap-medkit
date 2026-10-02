export const LOINC_SYSTEM = "http://loinc.org";

export const LOINC = {
  bodyLength: "8302-2",
  bodyWeight: "29463-7",
  bloodSaturation: "2708-6",
  bloodPressure: "55284-4",
  heartRate: "8867-4",
  bloodGlucose: "2345-7",
} as const;

export type LoincCode = (typeof LOINC)[keyof typeof LOINC];

type ObservationType = { label: string; unit: string };

const OBSERVATION_TYPES: Record<LoincCode, ObservationType> = {
  [LOINC.bodyLength]: { label: "Body Length", unit: "cm" },
  [LOINC.bodyWeight]: { label: "Body Weight", unit: "kg" },
  [LOINC.bloodSaturation]: { label: "Blood Saturation", unit: "%" },
  [LOINC.bloodPressure]: { label: "Blood Pressure", unit: "mmHg" },
  [LOINC.heartRate]: { label: "Heart Rate", unit: "/min" },
  [LOINC.bloodGlucose]: { label: "Blood Glucose Level", unit: "mg/dL" },
};

const typesByCode = new Map<string, ObservationType>(
  Object.entries(OBSERVATION_TYPES),
);

export function findObservationType(code: string) {
  return typesByCode.get(code);
}
