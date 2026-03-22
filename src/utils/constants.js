export const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1';
export const AQ_API_URL = import.meta.env.VITE_AQ_API_URL || 'https://air-quality-api.open-meteo.com/v1';
export const ARCHIVE_API_URL = import.meta.env.VITE_ARCHIVE_API_URL || 'https://archive-api.open-meteo.com/v1';
export const GEOCODE_API_URL = import.meta.env.VITE_GEOCODE_API_URL || 'https://nominatim.openstreetmap.org';

export const WEATHER_PARAMS = {
  current: [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation',
    'uv_index',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'weather_code',
    'apparent_temperature',
    'surface_pressure',
    'cloud_cover',
    'visibility',
  ].join(','),
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index',
    'precipitation_probability',
    'weather_code',
  ].join(','),
  daily: [
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'precipitation_sum',
    'wind_speed_10m_max',
    'precipitation_probability_max',
    'uv_index_max',
    'wind_direction_10m_dominant',
    'weather_code',
  ].join(',')
};

export const AIR_QUALITY_PARAMS = {
  hourly: [
    'pm10',
    'pm2_5',
    'carbon_monoxide',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'ozone',
    'european_aqi',
    'us_aqi',
  ].join(',')
};

export const HISTORICAL_WEATHER_PARAMS = {
  daily: [
    'temperature_2m_max',
    'temperature_2m_min',
    'temperature_2m_mean',
    'sunrise',
    'sunset',
    'precipitation_sum',
    'wind_speed_10m_max',
    'wind_direction_10m_dominant',
  ].join(',')
};

export const HISTORICAL_AQ_PARAMS = {
  hourly: 'pm10,pm2_5'
};

export const WEATHER_CODES = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
  61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
  85: 'Slight Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Thunderstorm + Heavy Hail',
};

export const COMPASS_DIRECTIONS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

export const CHART_PALETTE = {
  precipitation: '#3b82f6',
  humidity: '#06b6d4',
  uv: '#f59e0b',
  wind: '#8b5cf6',
  precipProb: '#6366f1',
  pressure: '#ec4899',
  visibility: '#14b8a6',
  cloud: '#94a3b8',
  temperature: '#eab308',
  pm10: '#f59e0b',
  pm25: '#ef4444',
  windDir: '#6366f1',
  // UI & General Theme
  bgGoogle: '#202124',
  bgCardHover: '#303134',
  textMuted: '#9aa0a6',
  textLight: '#e2e8f0',
  axisTick: '#64748b',
  brushFill: '#1e293b',
  brushStroke: '#334155'
};

export const AQI_LEVELS = [
  { max: 50, label: 'Good', color: '#22c55e', class: 'aqi-good' },
  { max: 100, label: 'Moderate', color: '#eab308', class: 'aqi-moderate' },
  { max: 150, label: 'Unhealthy for Sensitive', color: '#f97316', class: 'aqi-unhealthy-sensitive' },
  { max: 200, label: 'Unhealthy', color: '#ef4444', class: 'aqi-unhealthy' },
  { max: 300, label: 'Very Unhealthy', color: '#a855f7', class: 'aqi-very-unhealthy' },
  { max: Infinity, label: 'Hazardous', color: '#be123c', class: 'aqi-hazardous' }
];
