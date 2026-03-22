import React, { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useGeolocation } from './hooks/useWeather'
import Navbar from './components/ui/Navbar'
import TodayPage from './pages/TodayPage'
import HistoricalPage from './pages/HistoricalPage'
import { MapPin, AlertCircle } from './components/icons'

// function LocationBanner({ message }) {
//   return (
//     <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-400">
//       <AlertCircle size={13} />
//       {message}
//     </div>
//   )
// }

// FUTURE UPDATE: Upgraded Premium Location Banner
function LocationBanner({ message }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-amber-500/20 backdrop-blur-md">
      <div className="absolute top-0 left-0 w-64 h-full bg-amber-500/10 blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex-shrink-0 mt-0.5 sm:mt-0 relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse" />
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <AlertCircle size={16} className="text-amber-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-200/90 leading-snug">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 animate-pulse-slow" />
        </div>
        <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-slate-300 text-lg">Detecting your location</p>
        <p className="text-sm text-slate-500 mt-1">Allow location access for local weather</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <MapPin size={12} />
        <span>GPS positioning…</span>
      </div>
    </div>
  )
}

export default function App() {
  const { location, locationName, error: geoError, loading: geoLoading } = useGeolocation()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  if (geoLoading) return <LoadingScreen />

  return (
    <div className="relative min-h-screen">
      <div className="bg-blob-1" />
      <div className="bg-blob-2" />
      <div className="relative z-10">
        <Navbar locationName={locationName} onRefresh={handleRefresh} loading={false} />
        {geoError && <LocationBanner message={geoError} />}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route path="/" element={<TodayPage key={`today-${refreshKey}`} location={location} locationName={locationName} />} />
            <Route path="/historical" element={<HistoricalPage key={`hist-${refreshKey}`} location={location} locationName={locationName} />} />
          </Routes>
        </main>
        <footer className="border-t border-amber-500/10 mt-12 py-6 px-4 text-center">
          <p className="text-xs text-slate-600">
            Data from{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noreferrer"
              className="text-amber-500/60 hover:text-amber-400 transition-colors">
              Open-Meteo API
            </a>
            {' '}& Nominatim · WeatherLens © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  )
}
