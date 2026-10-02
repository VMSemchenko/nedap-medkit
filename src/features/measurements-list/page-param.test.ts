import { describe, expect, it } from "vitest";
import { clampPage, parsePageParam } from "./page-param";

describe("parsePageParam", () => {
  it("reads a positive integer", () => {
    expect(parsePageParam("3")).toBe(3);
  });

  it.each([null, "", "abc", "0", "-1", "1.5"])(
    "falls back to the first page for %j",
    (raw) => {
      expect(parsePageParam(raw)).toBe(1);
    },
  );
});

describe("clampPage", () => {
  it("keeps a page that is within range", () => {
    expect(clampPage(2, 5)).toBe(2);
  });

  it("limits a page past the end to the last page", () => {
    expect(clampPage(999, 5)).toBe(5);
  });

  it("returns the first page when there are no pages", () => {
    expect(clampPage(3, 0)).toBe(1);
  });
});
