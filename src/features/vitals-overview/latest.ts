import type { Measurement } from "@/shared/observations/model";

export function latestByCode(
  measurements: Measurement[],
): Map<string, Measurement> {
  const latest = new Map<string, Measurement>();
  for (const measurement of measurements) {
    const current = latest.get(measurement.code);
    if (!current || measurement.effectiveAt > current.effectiveAt) {
      latest.set(measurement.code, measurement);
    }
  }
  return latest;
}

type WalkProgress = {
  measurements: Measurement[];
  requiredCodes: readonly string[];
  lastPage: number;
  pageSize: number;
  total: number;
};

export function getNextWalkPage({
  measurements,
  requiredCodes,
  lastPage,
  pageSize,
  total,
}: WalkProgress): number | undefined {
  const seenCodes = latestByCode(measurements);
  const hasEveryRequiredCode = requiredCodes.every((code) =>
    seenCodes.has(code),
  );
  const isLastPage = lastPage * pageSize >= total;
  return hasEveryRequiredCode || isLastPage ? undefined : lastPage + 1;
}
