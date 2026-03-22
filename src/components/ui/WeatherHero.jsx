import React from "react";
import { format } from "date-fns";
import {
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  Umbrella,
  Gauge,
  Cloud,
  Activity,
  WeatherIcon,
} from "../icons/index.js";
import { weatherCodeToDesc, getAQIInfo } from "../../services/weatherApi";
import { fmt, formatTime, formatTemp } from "../../utils/helpers";



export default function WeatherHero({ current, daily, date, tempUnit }) {
  if (!current) return null;

  const c = current.current;
  const d = daily?.daily;
  const aqiVal = null; // passed separately

  const todayIndex = 0;
  const maxTemp = d?.temperature_2m_max?.[todayIndex];
  const minTemp = d?.temperature_2m_min?.[todayIndex];
  const sunrise = d?.sunrise?.[todayIndex];
  const sunset = d?.sunset?.[todayIndex];

  const weatherCode = c?.weather_code ?? 0;

  return (
    <div className="weather-card p-6 amber-glow animate-slide-up relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(245,158,11,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Left: Icon + Condition */}
        <div className="flex items-center gap-5">
          <WeatherIcon code={weatherCode} size={72} />
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">
              {date
                ? format(date, "EEEE, MMM d")
                : format(new Date(), "EEEE, MMM d")}
            </p>
            <p className="text-xl font-display font-semibold text-slate-200">
              {weatherCodeToDesc(weatherCode)}
            </p>
            <p className="text-4xl font-display font-bold text-amber-400 mt-1">
              {formatTemp(c?.temperature_2m, tempUnit)}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Feels like {formatTemp(c?.apparent_temperature, tempUnit)}
            </p>
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {[
            {
              icon: Thermometer,
              label: "Max / Min",
              value: maxTemp != null && minTemp != null ? `${formatTemp(maxTemp, tempUnit)} / ${formatTemp(minTemp, tempUnit)}` : "N/A",
              color: "#f59e0b",
            },
            {
              icon: Droplets,
              label: "Humidity",
              value: c?.relative_humidity_2m != null ? `${fmt(c.relative_humidity_2m)}%` : "N/A",
              color: "#3b82f6",
            },
            {
              icon: Wind,
              label: "Wind Speed",
              value: c?.wind_speed_10m != null ? `${fmt(c.wind_speed_10m)} km/h` : "N/A",
              color: "#06b6d4",
            },
            {
              icon: Eye,
              label: "Visibility",
              value: c?.visibility != null ? `${(c.visibility / 1000).toFixed(1)} km` : "N/A",
              color: "#8b5cf6",
            },
            {
              icon: Sunrise,
              label: "Sunrise",
              value: formatTime(sunrise),
              color: "#f97316",
            },
            {
              icon: Sunset,
              label: "Sunset",
              value: formatTime(sunset),
              color: "#a855f7",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}18` }}
              >
                <Icon size={15} style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-medium text-slate-200 font-display">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
