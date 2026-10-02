import { z } from "zod";

// Vite exposes `VAR=` in .env files as "", which should behave like an unset variable.
const envVar = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema);

const count = z.coerce.number().int().positive();
const durationMs = z.union([
  z.literal("Infinity").transform(() => Infinity),
  z.coerce.number().int().nonnegative(),
]);
const flag = z.enum(["true", "false"]).transform((value) => value === "true");

const timeZone = z.string().refine(isKnownTimeZone, "Unknown IANA time zone");

const envSchema = z.object({
  VITE_API_BASE_URL: envVar(
    z
      .url()
      .transform((url) => url.replace(/\/+$/, ""))
      .default("https://body-check-dashboard-phi.vercel.app/api"),
  ),
  // The API silently caps `count` at 800.
  VITE_OBSERVATION_COUNT: envVar(count.max(800).default(10)),
  VITE_PAGE_SIZE: envVar(count.default(7)),
  VITE_LATEST_PAGE_SIZE: envVar(count.default(20)),
  VITE_QUERY_STALE_TIME_MS: envVar(durationMs.default(0)),
  VITE_QUERY_GC_TIME_MS: envVar(durationMs.default(300_000)),
  VITE_QUERY_REFETCH_ON_WINDOW_FOCUS: envVar(flag.default(true)),
  VITE_TIME_ZONE: envVar(timeZone.optional()),
});

export type AppConfig = ReturnType<typeof parseEnv>;

export function parseEnv(source: Record<string, unknown>) {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${z.prettifyError(result.error)}`,
    );
  }

  const env = result.data;
  return {
    apiBaseUrl: env.VITE_API_BASE_URL,
    observationCount: env.VITE_OBSERVATION_COUNT,
    pageSize: env.VITE_PAGE_SIZE,
    latestPageSize: env.VITE_LATEST_PAGE_SIZE,
    query: {
      staleTime: env.VITE_QUERY_STALE_TIME_MS,
      gcTime: env.VITE_QUERY_GC_TIME_MS,
      refetchOnWindowFocus: env.VITE_QUERY_REFETCH_ON_WINDOW_FOCUS,
    },
    timeZone: env.VITE_TIME_ZONE,
  };
}

function isKnownTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
