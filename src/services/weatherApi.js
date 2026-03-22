// Open-Meteo API Service
// Docs: https://open-meteo.com/en/docs

import {
  WEATHER_API_URL,
  AQ_API_URL,
  ARCHIVE_API_URL,
  GEOCODE_API_URL,
  WEATHER_PARAMS,
  AIR_QUALITY_PARAMS,
  HISTORICAL_WEATHER_PARAMS,
  HISTORICAL_AQ_PARAMS,
  WEATHER_CODES,
  COMPASS_DIRECTIONS,
  AQI_LEVELS,
} from '../utils/constants';

// ─── Current + Hourly Forecast ───────────────────────────────────────────────
export async function fetchCurrentWeather(lat, lon, date) {
  // FUTURE UPDATE (Google Weather UI): uncomment this block to fetch 7 days of daily forecast.

  let dateParams = { forecast_days: 7 };
  if (date) {
    const d = new Date(date);
    const end_d = new Date(d.getTime() + 6 * 24 * 60 * 60 * 1000); // 6 days ahead + current day = 7 days
    dateParams = {
      start_date: date,
      end_date: end_d.toISOString().split('T')[0]
    };
  }

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: WEATHER_PARAMS.current,
    hourly: WEATHER_PARAMS.hourly,
    daily: WEATHER_PARAMS.daily,
    timezone: 'auto',
    // ...(date ? { start_date: date, end_date: date } : { forecast_days: 1 }),
    ...dateParams,
    // FUTURE UPDATE: Replace the line above with "...dateParams"
  })

  const res = await fetch(`${WEATHER_API_URL}/forecast?${params}`)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

// ─── Air Quality ─────────────────────────────────────────────────────────────
export async function fetchAirQuality(lat, lon, date) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: AIR_QUALITY_PARAMS.hourly,
    ...(date ? { start_date: date, end_date: date } : { forecast_days: 1 }),
    timezone: 'auto',
  })

  const res = await fetch(`${AQ_API_URL}/air-quality?${params}`)
  if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`)
  return res.json()
}

// ─── Historical Data ──────────────────────────────────────────────────────────
export async function fetchHistoricalWeather(lat, lon, startDate, endDate) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily: HISTORICAL_WEATHER_PARAMS.daily,
    timezone: 'auto',
  })

  const res = await fetch(`${ARCHIVE_API_URL}/archive?${params}`)
  if (!res.ok) throw new Error(`Historical Weather API error: ${res.status}`)
  return res.json()
}

// ─── Historical Air Quality ───────────────────────────────────────────────────
export async function fetchHistoricalAirQuality(lat, lon, startDate, endDate) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    hourly: HISTORICAL_AQ_PARAMS.hourly,
    timezone: 'auto',
  })

  const res = await fetch(`${AQ_API_URL}/air-quality?${params}`)
  if (!res.ok) throw new Error(`Historical AQ API error: ${res.status}`)
  return res.json()
}

// ─── Reverse Geocoding ────────────────────────────────────────────────────────
export async function fetchLocationName(lat, lon) {
  try {
    const res = await fetch(
      `${GEOCODE_API_URL}/reverse?lat=${lat}&lon=${lon}&format=json`
    )
    const data = await res.json()
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Unknown'
    const country = data.address?.country_code?.toUpperCase() || ''
    return `${city}, ${country}`
  } catch {
    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`
  }
}

// ─── WMO Weather Code → Description ──────────────────────────────────────────
export function weatherCodeToDesc(code) {
  return WEATHER_CODES[code] || 'Unknown'
}

// ─── AQI Classification ───────────────────────────────────────────────────────
export function getAQIInfo(aqi) {
  return AQI_LEVELS.find((level) => aqi <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

// ─── Wind Direction ───────────────────────────────────────────────────────────
export function degToCompass(deg) {
  return COMPASS_DIRECTIONS[Math.round(deg / 22.5) % 16]
}
