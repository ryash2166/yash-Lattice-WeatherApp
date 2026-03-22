// Utility helpers
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

// Temperature conversion
export const celsiusToFahrenheit = (c) => (c * 9) / 5 + 32;
export const formatTemp = (val, unit) =>
  val == null
    ? "N/A"
    : `${Math.round(unit === "F" ? celsiusToFahrenheit(val) : val)}°${unit}`;

// Number formatting
export const fmt = (val, decimals = 0) =>
  val == null ? "N/A" : Number(val).toFixed(decimals);

// Time formatting from ISO string
export const formatTime = (isoStr) => {
  if (!isoStr) return "N/A";
  try {
    return format(parseISO(isoStr), "HH:mm");
  } catch {
    return isoStr;
  }
};

// Format IST time
export const formatIST = (isoStr) => {
  if (!isoStr) return "N/A";
  try {
    return formatInTimeZone(parseISO(isoStr), "Asia/Kolkata", "HH:mm");
  } catch {
    return isoStr;
  }
};

// Filter hourly data for a given date
export function filterHourlyByDate(hourlyTimes, hourlyData, date) {
  const prefix = date
    ? format(date instanceof Date ? date : parseISO(date), "yyyy-MM-dd")
    : null;
  if (!prefix || !hourlyTimes)
    return { times: hourlyTimes || [], data: hourlyData || [] };

  const indices = hourlyTimes
    .map((t, i) => (t.startsWith(prefix) ? i : -1))
    .filter((i) => i >= 0);

  return {
    times: indices.map((i) => hourlyTimes[i]),
    data: indices.map((i) => hourlyData[i]),
  };
}

// Aggregate hourly AQ data to daily
export function aggregateDailyAQ(hourlyTimes, hourlyValues) {
  if (!hourlyTimes || !hourlyValues) return {};
  const daily = {};
  hourlyTimes.forEach((t, i) => {
    const day = t.slice(0, 10);
    if (!daily[day]) daily[day] = [];
    if (hourlyValues[i] != null) daily[day].push(hourlyValues[i]);
  });
  return Object.fromEntries(
    Object.entries(daily).map(([day, vals]) => [
      day,
      vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null,
    ]),
  );
}

// Get current hour index
export function getCurrentHourIndex(times) {
  if (!times) return 0;
  const now = new Date();
  const nowStr = format(now, "yyyy-MM-dd'T'HH");
  return times.findIndex((t) => t.startsWith(nowStr)) || 0;
}

// Clsx helper
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Clamp value
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
