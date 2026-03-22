import React, { useState, useCallback } from 'react'
import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, Brush,
  ReferenceLine,
} from 'recharts'
import { ZoomIn, ZoomOut } from '../icons'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, unit, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-slate-400 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-mono font-medium text-slate-100">
            {formatter ? formatter(p.value, p.name) : `${p.value != null ? Number(p.value).toFixed(1) : '–'}${unit || ''}`}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Zoom Controls ────────────────────────────────────────────────────────────
function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onZoomIn}
        className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
        title="Zoom In">
        <ZoomIn size={13} />
      </button>
      <button onClick={onZoomOut}
        className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
        title="Zoom Out">
        <ZoomOut size={13} />
      </button>
      {zoom !== 1 && (
        <button onClick={onReset}
          className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors">
          Reset
        </button>
      )}
    </div>
  )
}

// ─── Base Chart Wrapper ───────────────────────────────────────────────────────
export function ChartWrapper({
  title,
  subtitle,
  children,
  dataLength = 24,
  height = 220,
  minWidth,
}) {
  const [zoom, setZoom] = useState(1)
  const [brushStart, setBrushStart] = useState(0)
  const [brushEnd, setBrushEnd] = useState(Math.max(0, dataLength - 1))

  const visibleCount = Math.round(dataLength / zoom)
  const center = Math.round((brushStart + brushEnd) / 2)
  const half = Math.round(visibleCount / 2)

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.5, 8)
    setZoom(newZoom)
    const newCount = Math.round(dataLength / newZoom)
    const newHalf = Math.round(newCount / 2)
    setBrushStart(Math.max(0, center - newHalf))
    setBrushEnd(Math.min(dataLength - 1, center + newHalf))
  }, [zoom, center, dataLength])

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.5, 1)
    setZoom(newZoom)
    if (newZoom === 1) {
      setBrushStart(0)
      setBrushEnd(dataLength - 1)
    } else {
      const newCount = Math.round(dataLength / newZoom)
      const newHalf = Math.round(newCount / 2)
      setBrushStart(Math.max(0, center - newHalf))
      setBrushEnd(Math.min(dataLength - 1, center + newHalf))
    }
  }, [zoom, center, dataLength])

  const handleReset = useCallback(() => {
    setZoom(1)
    setBrushStart(0)
    setBrushEnd(dataLength - 1)
  }, [dataLength])

  return (
    <div className="weather-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-display font-semibold text-slate-200">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <ZoomControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />
      </div>

      <div className="chart-scroll-container" style={{ minWidth: 0 }}>
        <div style={{ minWidth: minWidth || '100%', width: '100%' }}>
          {React.cloneElement(children, {
            brushStart,
            brushEnd,
            onBrushChange: ({ startIndex, endIndex }) => {
              setBrushStart(startIndex)
              setBrushEnd(endIndex)
            },
            height,
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Hourly Area Chart ────────────────────────────────────────────────────────
export function HourlyAreaChart({
  data,
  dataKey,
  color = '#f59e0b',
  unit = '',
  gradientId,
  brushStart = 0,
  brushEnd,
  onBrushChange,
  height = 220,
  name,
  formatter,
}) {
  const gradId = gradientId || `grad-${dataKey}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={(t) => t?.slice(11, 16)} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip unit={unit} formatter={formatter} />} />
        <Area type="monotone" dataKey={dataKey} name={name || dataKey}
          stroke={color} strokeWidth={2} fill={`url(#${gradId})`} dot={false} />
        <Brush dataKey="time" startIndex={brushStart} endIndex={brushEnd}
          onChange={onBrushChange} height={20} fill="#1e293b" stroke="#334155"
          travellerWidth={6}
          tickFormatter={(t) => t?.slice(11, 16)} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Dual Line Chart (PM10 + PM2.5) ──────────────────────────────────────────
export function DualLineChart({
  data,
  keys = [],
  colors = ['#f59e0b', '#3b82f6'],
  unit = '',
  brushStart = 0,
  brushEnd,
  onBrushChange,
  height = 220,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={(t) => t?.slice(11, 16)} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip unit={unit} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
        {keys.map((k, i) => (
          <Line key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={2}
            dot={false} activeDot={{ r: 4 }} />
        ))}
        <Brush dataKey="time" startIndex={brushStart} endIndex={brushEnd}
          onChange={onBrushChange} height={20} fill="#1e293b" stroke="#334155"
          travellerWidth={6}
          tickFormatter={(t) => t?.slice(11, 16)} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Historical Line Chart ────────────────────────────────────────────────────
export function HistoricalLineChart({
  data,
  keys = [],
  colors = ['#f59e0b', '#ef4444', '#3b82f6'],
  unit = '',
  brushStart = 0,
  brushEnd,
  onBrushChange,
  height = 250,
  name,
  formatter,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={formatter ? (v) => formatter(v) : undefined} />
        <Tooltip content={<CustomTooltip unit={unit} formatter={formatter} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
        {keys.map((k, i) => (
          <Line key={k} type="monotone" dataKey={k} name={k} stroke={colors[i]}
            strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        ))}
        <Brush dataKey="date" startIndex={brushStart} endIndex={brushEnd}
          onChange={onBrushChange} height={20} fill="#1e293b" stroke="#334155" travellerWidth={6} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Historical Bar Chart ─────────────────────────────────────────────────────
export function HistoricalBarChart({
  data,
  dataKey,
  color = '#3b82f6',
  unit = '',
  brushStart = 0,
  brushEnd,
  onBrushChange,
  height = 250,
  name,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip unit={unit} />} />
        <Bar dataKey={dataKey} name={name || dataKey} fill={color} opacity={0.85} radius={[2, 2, 0, 0]} />
        <Brush dataKey="date" startIndex={brushStart} endIndex={brushEnd}
          onChange={onBrushChange} height={20} fill="#1e293b" stroke="#334155" travellerWidth={6} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Wind Direction Chart ─────────────────────────────────────────────────────
export function WindDirectionChart({
  data,
  brushStart = 0,
  brushEnd,
  onBrushChange,
  height = 250,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 360]}
          tickFormatter={(v) => {
            const d = ['N','NE','E','SE','S','SW','W','NW']
            return d[Math.round(v / 45) % 8] || v
          }} />
        <Tooltip content={<CustomTooltip unit="°"
          formatter={(val) => {
            const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
            return dirs[Math.round(val / 22.5) % 16] || `${val}°`
          }} />} />
        <Bar dataKey="windDirection" name="Wind Direction" fill="#6366f1" opacity={0.85} radius={[2, 2, 0, 0]} />
        <Brush dataKey="date" startIndex={brushStart} endIndex={brushEnd}
          onChange={onBrushChange} height={20} fill="#1e293b" stroke="#334155" travellerWidth={6} />
      </BarChart>
    </ResponsiveContainer>
  )
}
