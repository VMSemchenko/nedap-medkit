import type { Measurement } from "@/shared/observations/model";

const CENTIMETRES_PER_METRE = 100;

export type Bmi = { value: number; effectiveAt: Date };

export function calculateBmi(
  weight: Measurement | undefined,
  length: Measurement | undefined,
): Bmi | undefined {
  if (!weight || !length || length.value <= 0) return undefined;

  const lengthInMetres = length.value / CENTIMETRES_PER_METRE;
  return {
    value: weight.value / lengthInMetres ** 2,
    effectiveAt:
      weight.effectiveAt > length.effectiveAt
        ? weight.effectiveAt
        : length.effectiveAt,
  };
}
