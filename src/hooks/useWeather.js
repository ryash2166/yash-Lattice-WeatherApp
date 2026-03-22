// Custom hooks for weather data fetching and geolocation
import { useState, useEffect, useCallback, useRef } from 'react'
import { format } from 'date-fns'
import {
  fetchCurrentWeather,
  fetchAirQuality,
  fetchHistoricalWeather,
  fetchHistoricalAirQuality,
  fetchLocationName,
} from '../services/weatherApi'

// ─── Geolocation Hook ─────────────────────────────────────────────────────────
export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      // Fallback: Mumbai, India
      const fallback = { lat: 19.076, lon: 72.8777 }
      setLocation(fallback)
      fetchLocationName(fallback.lat, fallback.lon).then(setLocationName)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setLocation(coords)
        const name = await fetchLocationName(coords.lat, coords.lon)
        setLocationName(name)
        setLoading(false)
      },
      () => {
        // Fallback on error: Surat, Gujarat
        const fallback = { lat: 21.1702, lon: 72.8311 }
        setLocation(fallback)
        fetchLocationName(fallback.lat, fallback.lon).then(setLocationName)
        setLoading(false)
        setError('Location access denied. Using default location.')
      },
      { timeout: 5000, enableHighAccuracy: true }
    )
  }, [])

  return { location, locationName, error, loading }
}

// ─── Current Weather Hook ─────────────────────────────────────────────────────
export function useCurrentWeather(location, date) {
  const [data, setData] = useState(null)
  const [aqData, setAqData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const load = useCallback(async () => {
    if (!location) return
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    try {
      const dateStr = date ? format(date, 'yyyy-MM-dd') : null
      const [weather, aq] = await Promise.all([
        fetchCurrentWeather(location.lat, location.lon, dateStr),
        fetchAirQuality(location.lat, location.lon, dateStr),
      ])
      setData(weather)
      setAqData(aq)
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [location, date])

  useEffect(() => { load() }, [load])

  return { data, aqData, loading, error, refetch: load }
}

// ─── Historical Weather Hook ──────────────────────────────────────────────────
export function useHistoricalWeather(location, startDate, endDate) {
  const [data, setData] = useState(null)
  const [aqData, setAqData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!location || !startDate || !endDate) return
    setLoading(true)
    setError(null)
    try {
      const start = format(startDate, 'yyyy-MM-dd')
      const end = format(endDate, 'yyyy-MM-dd')
      const [weather, aq] = await Promise.all([
        fetchHistoricalWeather(location.lat, location.lon, start, end),
        fetchHistoricalAirQuality(location.lat, location.lon, start, end),
      ])
      setData(weather)
      setAqData(aq)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [location, startDate, endDate])

  useEffect(() => { load() }, [load])

  return { data, aqData, loading, error, refetch: load }
}
