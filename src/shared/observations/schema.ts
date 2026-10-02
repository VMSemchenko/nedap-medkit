import { z } from "zod";

const CodingSchema = z.object({
  system: z.string().optional(),
  code: z.string().min(1),
  display: z.string().optional(),
});

export const ObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  id: z.string().min(1),
  code: z.object({
    coding: z.array(CodingSchema).min(1),
    text: z.string().optional(),
  }),
  subject: z.object({ display: z.string().optional() }).optional(),
  effectiveDateTime: z.iso.datetime({ offset: true }),
  valueQuantity: z.object({
    value: z.number(),
    unit: z.string().optional(),
  }),
});

export type Observation = z.infer<typeof ObservationSchema>;
export type ObservationInput = z.input<typeof ObservationSchema>;

export const ObservationEntrySchema = z.object({ resource: ObservationSchema });

// FHIR omits `entry` when a search has no results.
export const BundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  total: z.number().int().nonnegative(),
  entry: z.array(z.unknown()).default([]),
});
