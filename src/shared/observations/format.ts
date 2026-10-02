import { config } from "@/config/env";

const LOCALE = "nl-NL";

const valueFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });
const bmiFormat = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatValue(value: number) {
  return valueFormat.format(value);
}

export function formatBmi(bmi: number) {
  return bmiFormat.format(bmi);
}

export function formatCardDate(date: Date, timeZone = config.timeZone) {
  const part = dateParts(date, timeZone, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const month = part("month").replace(/\.$/, "");
  return `${part("day")} ${month} ${part("year")} ${part("hour")}:${part("minute")}`;
}

export function formatRowDate(date: Date, timeZone = config.timeZone) {
  const part = dateParts(date, timeZone, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${part("day")}-${part("month")}-${part("year")} ${part("hour")}:${part("minute")}:${part("second")}`;
}

// Built from parts so the output matches the design exactly, whatever separators the ICU version uses.
function dateParts(
  date: Date,
  timeZone: string | undefined,
  options: Intl.DateTimeFormatOptions,
) {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    ...options,
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  return (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
}
