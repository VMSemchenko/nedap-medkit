import { describe, expect, it } from "vitest";
import { parseEnv } from "./parse-env";

describe("parseEnv", () => {
  it("returns the documented defaults when nothing is set", () => {
    expect(parseEnv({})).toEqual({
      apiBaseUrl: "https://body-check-dashboard-phi.vercel.app/api",
      observationCount: 10,
      pageSize: 7,
      latestPageSize: 20,
      query: { staleTime: 0, gcTime: 300_000, refetchOnWindowFocus: true },
      timeZone: undefined,
    });
  });

  it("reads overrides from their string values", () => {
    const config = parseEnv({
      VITE_API_BASE_URL: "https://example.test/api",
      VITE_OBSERVATION_COUNT: "800",
      VITE_PAGE_SIZE: "25",
      VITE_LATEST_PAGE_SIZE: "50",
      VITE_QUERY_STALE_TIME_MS: "60000",
      VITE_QUERY_GC_TIME_MS: "120000",
      VITE_TIME_ZONE: "Europe/Amsterdam",
    });

    expect(config).toMatchObject({
      apiBaseUrl: "https://example.test/api",
      observationCount: 800,
      pageSize: 25,
      latestPageSize: 50,
      query: { staleTime: 60_000, gcTime: 120_000 },
      timeZone: "Europe/Amsterdam",
    });
  });

  it("reads 'false' as disabling refetch on window focus", () => {
    const config = parseEnv({ VITE_QUERY_REFETCH_ON_WINDOW_FOCUS: "false" });

    expect(config.query.refetchOnWindowFocus).toBe(false);
  });

  it("accepts 'Infinity' for stale and gc time", () => {
    const config = parseEnv({
      VITE_QUERY_STALE_TIME_MS: "Infinity",
      VITE_QUERY_GC_TIME_MS: "Infinity",
    });

    expect(config.query).toMatchObject({
      staleTime: Infinity,
      gcTime: Infinity,
    });
  });

  it("treats empty values as unset", () => {
    const config = parseEnv({ VITE_PAGE_SIZE: "", VITE_TIME_ZONE: "" });

    expect(config.pageSize).toBe(7);
    expect(config.timeZone).toBeUndefined();
  });

  it("drops a trailing slash from the API base URL", () => {
    const config = parseEnv({ VITE_API_BASE_URL: "https://example.test/api/" });

    expect(config.apiBaseUrl).toBe("https://example.test/api");
  });

  it.each(["0", "-1", "2.5", "abc"])("rejects page size %s", (pageSize) => {
    expect(() => parseEnv({ VITE_PAGE_SIZE: pageSize })).toThrow(
      /Invalid environment configuration[\s\S]*VITE_PAGE_SIZE/,
    );
  });

  it("rejects an observation count above the API maximum of 800", () => {
    expect(() => parseEnv({ VITE_OBSERVATION_COUNT: "801" })).toThrow(
      /VITE_OBSERVATION_COUNT/,
    );
  });

  it("rejects a negative cache duration", () => {
    expect(() => parseEnv({ VITE_QUERY_GC_TIME_MS: "-1" })).toThrow(
      /VITE_QUERY_GC_TIME_MS/,
    );
  });

  it("rejects a refetch flag other than true or false", () => {
    expect(() =>
      parseEnv({ VITE_QUERY_REFETCH_ON_WINDOW_FOCUS: "yes" }),
    ).toThrow(/VITE_QUERY_REFETCH_ON_WINDOW_FOCUS/);
  });

  it("rejects an unknown time zone", () => {
    expect(() => parseEnv({ VITE_TIME_ZONE: "Mars/Olympus" })).toThrow(
      /VITE_TIME_ZONE/,
    );
  });

  it("rejects an API base URL that is not a URL", () => {
    expect(() => parseEnv({ VITE_API_BASE_URL: "not a url" })).toThrow(
      /VITE_API_BASE_URL/,
    );
  });
});
