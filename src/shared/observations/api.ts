import { z } from "zod";
import { config } from "@/config/env";
import { toMeasurement, type Measurement } from "./model";
import { BundleSchema, ObservationEntrySchema } from "./schema";

export type SortOrder = "asc" | "desc" | "random";

export type ObservationsQuery = {
  page: number;
  pageSize: number;
  count: number;
  sort: SortOrder;
};

export type DroppedEntry = { index: number; reason: string };

export type ObservationsPage = {
  total: number;
  measurements: Measurement[];
  dropped: DroppedEntry[];
};

export function parseObservationBundle(json: unknown): ObservationsPage {
  const bundle = BundleSchema.safeParse(json);
  if (!bundle.success) {
    throw new Error(
      `Unexpected response from the observations API:\n${z.prettifyError(bundle.error)}`,
    );
  }

  const measurements: Measurement[] = [];
  const dropped: DroppedEntry[] = [];
  bundle.data.entry.forEach((entry, index) => {
    const parsed = ObservationEntrySchema.safeParse(entry);
    if (parsed.success) {
      measurements.push(toMeasurement(parsed.data.resource));
    } else {
      dropped.push({ index, reason: z.prettifyError(parsed.error) });
    }
  });

  return { total: bundle.data.total, measurements, dropped };
}

export async function fetchObservations(
  query: ObservationsQuery,
  signal?: AbortSignal,
): Promise<ObservationsPage> {
  const url = new URL(`${config.apiBaseUrl}/observations`);
  url.searchParams.set("page", String(query.page));
  url.searchParams.set("pageSize", String(query.pageSize));
  url.searchParams.set("count", String(query.count));
  url.searchParams.set("sort", query.sort);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const page = parseObservationBundle(await response.json());
  if (page.dropped.length > 0) {
    console.warn("Dropped invalid observations", page.dropped);
  }
  return page;
}

const ErrorBodySchema = z.object({ message: z.string() });

async function readErrorMessage(response: Response) {
  const fallback = `Request failed with status ${response.status}`;
  try {
    const body = ErrorBodySchema.safeParse(await response.json());
    return body.success ? body.data.message : fallback;
  } catch {
    return fallback;
  }
}
