import React from 'react'
import { Activity, Leaf, AlertCircle } from '../icons'
import { getAQIInfo } from "../../services/weatherApi"
import { fmt } from "../../utils/helpers"
import { SectionHeader } from './Elements'

function AQIMeter({ value, max = 300 }) {
  const pct = Math.min((value / max) * 100, 100)
  const info = getAQIInfo(value)
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">AQI</span>
        <span className="font-mono font-medium" style={{ color: info.color }}>{value ?? '–'}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #22c55e, #eab308, #ef4444, #a855f7)` }} />
      </div>
      <div className="flex justify-between text-xs mt-1 text-slate-600">
        <span>Good</span>
        <span>Hazardous</span>
      </div>
    </div>
  )
}

function PollutantRow({ label, value, unit, color = '#94a3b8' }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="font-mono text-xs font-medium text-slate-200">
        {value != null ? `${Number(value).toFixed(1)} ${unit}` : '–'}
      </span>
    </div>
  )
}

export default function AQIPanel({ aqData, date }) {
  if (!aqData) return null

  const h = aqData.hourly
  const now = new Date()
  const hour = now.getHours()

  // Get current hour index
  const times = h?.time || []
  const today = date
    ? (date instanceof Date ? date.toISOString().slice(0, 10) : date)
    : now.toISOString().slice(0, 10)

  const todayTimes = times.filter(t => t.startsWith(today))
  const idx = todayTimes.length > 0 ? times.indexOf(todayTimes[Math.min(hour, todayTimes.length - 1)]) : hour

  const safeGet = (arr) => arr?.[idx] ?? null

  const aqi = safeGet(h?.european_aqi)
  const usAqi = safeGet(h?.us_aqi)
  const pm10 = safeGet(h?.pm10)
  const pm25 = safeGet(h?.pm2_5)
  const co = safeGet(h?.carbon_monoxide)
  const no2 = safeGet(h?.nitrogen_dioxide)
  const so2 = safeGet(h?.sulphur_dioxide)
  const o3 = safeGet(h?.ozone)

  const info = getAQIInfo(aqi ?? 0)

  return (
    <div className="weather-card p-4 animate-fade-in">
      <SectionHeader title="Air Quality" icon={Leaf} />

      {/* AQI badges */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl text-center" style={{ background: `${info.color}12`, border: `1px solid ${info.color}30` }}>
          <p className="text-xs text-slate-400 mb-1">EU AQI</p>
          <p className="text-2xl font-display font-bold" style={{ color: info.color }}>{aqi ?? '–'}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: info.color }}>{info.label}</p>
        </div>
        <div className="p-3 rounded-xl text-center bg-slate-800/60 border border-slate-700/40">
          <p className="text-xs text-slate-400 mb-1">US AQI</p>
          <p className="text-2xl font-display font-bold text-slate-200">{usAqi ?? '–'}</p>
          <p className="text-xs mt-1 text-slate-400">{usAqi != null ? getAQIInfo(usAqi).label : '–'}</p>
        </div>
      </div>

      <AQIMeter value={aqi} />

      {/* Pollutants */}
      <div className="mt-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Pollutants</p>
        <PollutantRow label="PM10" value={pm10} unit="µg/m³" />
        <PollutantRow label="PM2.5" value={pm25} unit="µg/m³" />
        <PollutantRow label="Carbon Monoxide (CO)" value={co} unit="µg/m³" />
        <PollutantRow label="Nitrogen Dioxide (NO₂)" value={no2} unit="µg/m³" />
        <PollutantRow label="Sulphur Dioxide (SO₂)" value={so2} unit="µg/m³" />
        <PollutantRow label="Ozone (O₃)" value={o3} unit="µg/m³" />
      </div>

      {/* Note: CO2 not in Open-Meteo */}
      <p className="mt-3 text-xs text-slate-600 italic">
        * CO₂ data not provided by Open-Meteo API
      </p>
    </div>
  )
}
