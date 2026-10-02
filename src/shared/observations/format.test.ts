import { describe, expect, it } from "vitest";
import {
  formatBmi,
  formatCardDate,
  formatRowDate,
  formatValue,
} from "./format";

describe("formatValue", () => {
  it("uses a decimal comma", () => {
    expect(formatValue(96.9)).toBe("96,9");
  });

  it("shows whole numbers without decimals", () => {
    expect(formatValue(109)).toBe("109");
  });
});

describe("formatBmi", () => {
  it("rounds to one decimal with a decimal comma", () => {
    expect(formatBmi(18.7871)).toBe("18,8");
  });

  it("keeps the decimal for whole numbers", () => {
    expect(formatBmi(25)).toBe("25,0");
  });
});

describe("formatCardDate", () => {
  it("formats as day, short month, year and time", () => {
    expect(formatCardDate(new Date("2018-04-12T10:00:00Z"))).toBe(
      "12 apr 2018 10:00",
    );
  });

  it("drops the abbreviation dot that some locales add to the month", () => {
    expect(formatCardDate(new Date("2018-03-05T10:00:00Z"))).toBe(
      "5 mrt 2018 10:00",
    );
  });

  it("shows midnight as 00:00", () => {
    expect(formatCardDate(new Date("2018-04-12T00:00:00Z"))).toBe(
      "12 apr 2018 00:00",
    );
  });

  it("converts to the given time zone", () => {
    expect(
      formatCardDate(new Date("2018-04-12T10:00:00Z"), "Europe/Amsterdam"),
    ).toBe("12 apr 2018 12:00");
  });
});

describe("formatRowDate", () => {
  it("formats as dd-mm-yyyy hh:mm:ss", () => {
    expect(formatRowDate(new Date("2022-07-06T20:31:41Z"))).toBe(
      "06-07-2022 20:31:41",
    );
  });

  it("shows midnight as 00:00:00", () => {
    expect(formatRowDate(new Date("2022-07-06T00:00:05Z"))).toBe(
      "06-07-2022 00:00:05",
    );
  });

  it("converts to the given time zone", () => {
    expect(
      formatRowDate(new Date("2022-07-06T23:31:41Z"), "Europe/Amsterdam"),
    ).toBe("07-07-2022 01:31:41");
  });
});
