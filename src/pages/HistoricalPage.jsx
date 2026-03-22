import React, { useState, useMemo } from 'react'
import { subDays, subMonths, format, differenceInDays } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { History, TrendingUp, CloudRain, Wind, Leaf, Sun } from '../components/icons'
import { useHistoricalWeather } from '../hooks/useWeather'
import { aggregateDailyAQ } from '../utils/helpers'
import { SectionHeader, LoadingSkeleton, ErrorBanner } from '../components/ui/Elements'
import { DateRangePicker } from '../components/ui/DatePicker'
import {
  ChartWrapper,
  HistoricalLineChart,
  HistoricalBarChart,
  WindDirectionChart,
} from '../components/charts/Charts'

const PRESETS = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '2Y', months: 24 },
]

export default function HistoricalPage({ location }) {
  const today = new Date()
  const [startDate, setStartDate] = useState(subMonths(today, 1))
  const [endDate, setEndDate] = useState(subDays(today, 1))
  const [activePreset, setActivePreset] = useState('1M')

  const handlePreset = (preset) => {
    setActivePreset(preset.label)
    setStartDate(subMonths(today, preset.months))
    setEndDate(subDays(today, 1))
  }

  // Enforce 2-year max
  const safeStart = useMemo(() => {
    if (!startDate || !endDate) return startDate
    const diff = differenceInDays(endDate, startDate)
    return diff > 730 ? subDays(endDate, 730) : startDate
  }, [startDate, endDate])

  const { data, aqData, loading, error } = useHistoricalWeather(location, safeStart, endDate)

  // Transform data for charts
  const { tempData, sunData, precipData, windData, aqChartData } = useMemo(() => {
    if (!data?.daily) return {}

    const d = data.daily
    const dates = d.time || []

    const tempData = dates.map((date, i) => ({
      date: format(new Date(date), 'MMM d'),
      'Mean Temp': d.temperature_2m_mean?.[i],
      'Max Temp': d.temperature_2m_max?.[i],
      'Min Temp': d.temperature_2m_min?.[i],
    }))

    // Sun cycle in IST
    const sunData = dates.map((date, i) => {
      const sr = d.sunrise?.[i]
      const ss = d.sunset?.[i]
      let sunriseMin = null, sunsetMin = null
      try {
        if (sr) {
          const srIST = formatInTimeZone(new Date(sr), 'Asia/Kolkata', 'HH:mm')
          const [h, m] = srIST.split(':').map(Number)
          sunriseMin = h * 60 + m
        }
        if (ss) {
          const ssIST = formatInTimeZone(new Date(ss), 'Asia/Kolkata', 'HH:mm')
          const [h, m] = ssIST.split(':').map(Number)
          sunsetMin = h * 60 + m
        }
      } catch {}
      return {
        date: format(new Date(date), 'MMM d'),
        Sunrise: sunriseMin,
        Sunset: sunsetMin,
        _sr: sr ? formatInTimeZone(new Date(sr), 'Asia/Kolkata', 'HH:mm') : null,
        _ss: ss ? formatInTimeZone(new Date(ss), 'Asia/Kolkata', 'HH:mm') : null,
      }
    })

    const precipData = dates.map((date, i) => ({
      date: format(new Date(date), 'MMM d'),
      precipitation: d.precipitation_sum?.[i],
    }))

    const windData = dates.map((date, i) => ({
      date: format(new Date(date), 'MMM d'),
      windSpeed: d.wind_speed_10m_max?.[i],
      windDirection: d.wind_direction_10m_dominant?.[i],
    }))

    // AQ daily averages
    let aqChartData = []
    if (aqData?.hourly) {
      const pm10Daily = aggregateDailyAQ(aqData.hourly.time, aqData.hourly.pm10)
      const pm25Daily = aggregateDailyAQ(aqData.hourly.time, aqData.hourly.pm2_5)
      aqChartData = dates.map((date) => ({
        date: format(new Date(date), 'MMM d'),
        pm10: pm10Daily[date] != null ? +pm10Daily[date].toFixed(1) : null,
        pm2_5: pm25Daily[date] != null ? +pm25Daily[date].toFixed(1) : null,
      }))
    }

    return { tempData, sunData, precipData, windData, aqChartData }
  }, [data, aqData])

  const dayCount = safeStart && endDate ? differenceInDays(endDate, safeStart) + 1 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-100">Historical Analysis</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {dayCount > 0 ? `Showing ${dayCount} days of data` : 'Select a date range'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Presets */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-slate-700">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => handlePreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePreset === p.label
                    ? 'bg-amber-500 text-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
          <DateRangePicker
            startDate={safeStart} endDate={endDate}
            onStartChange={(d) => { setStartDate(d); setActivePreset('') }}
            onEndChange={(d) => { setEndDate(d); setActivePreset('') }}
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingSkeleton rows={5} height="h-64" />
      ) : !data ? (
        <div className="text-center py-20 text-slate-500">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p>Select a date range to view historical data</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Temperature */}
          <ChartWrapper title="Temperature Trends (°C)"
            subtitle="Mean, Max & Min daily temperatures"
            dataLength={tempData?.length}>
            <HistoricalLineChart
              data={tempData}
              keys={['Mean Temp', 'Max Temp', 'Min Temp']}
              colors={['#f59e0b', '#ef4444', '#3b82f6']}
              unit="°C"
            />
          </ChartWrapper>

          {/* Sun Cycle */}
          <ChartWrapper title="Sun Cycle (IST)"
            subtitle="Sunrise & sunset times in Indian Standard Time"
            dataLength={sunData?.length}>
            <HistoricalLineChart
              data={sunData}
              keys={['Sunrise', 'Sunset']}
              colors={['#f97316', '#a855f7']}
              formatter={(val) => {
                const h = Math.floor(val / 60)
                const m = val % 60
                return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
              }}
              unit=""
            />
          </ChartWrapper>

          {/* Precipitation */}
          <ChartWrapper title="Total Precipitation (mm)"
            subtitle="Daily precipitation sum"
            dataLength={precipData?.length}>
            <HistoricalBarChart
              data={precipData}
              dataKey="precipitation"
              color="#3b82f6"
              unit=" mm"
              name="Precipitation"
            />
          </ChartWrapper>

          {/* Wind Speed */}
          <ChartWrapper title="Max Wind Speed (km/h)"
            subtitle="Daily maximum wind speed"
            dataLength={windData?.length}>
            <HistoricalLineChart
              data={windData}
              keys={['windSpeed']}
              colors={['#22c55e']}
              unit=" km/h"
            />
          </ChartWrapper>

          {/* Wind Direction */}
          <ChartWrapper title="Dominant Wind Direction"
            subtitle="Daily dominant wind direction in degrees"
            dataLength={windData?.length}>
            <WindDirectionChart data={windData} />
          </ChartWrapper>

          {/* AQ Trends */}
          {aqChartData?.length > 0 && (
            <ChartWrapper title="Air Quality Trends"
              subtitle="Daily average PM10 & PM2.5 (µg/m³)"
              dataLength={aqChartData.length}>
              <HistoricalLineChart
                data={aqChartData}
                keys={['pm10', 'pm2_5']}
                colors={['#f59e0b', '#ef4444']}
                unit=" µg/m³"
              />
            </ChartWrapper>
          )}
        </div>
      )}
    </div>
  )
}
