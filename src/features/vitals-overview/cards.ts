import { LOINC, type LoincCode } from "@/shared/observations/observation-types";

export type CardDefinition =
  { kind: "observation"; code: LoincCode } | { kind: "bmi" };

export const VITAL_CARDS: CardDefinition[] = [
  { kind: "observation", code: LOINC.bodyLength },
  { kind: "observation", code: LOINC.bodyWeight },
  { kind: "bmi" },
  { kind: "observation", code: LOINC.bloodSaturation },
  { kind: "observation", code: LOINC.bloodPressure },
  { kind: "observation", code: LOINC.heartRate },
];

export function requiredCodesFor(cards: CardDefinition[]): LoincCode[] {
  const codes = cards.flatMap((card) =>
    card.kind === "bmi" ? [LOINC.bodyWeight, LOINC.bodyLength] : [card.code],
  );
  return [...new Set(codes)];
}
