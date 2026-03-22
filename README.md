# 🌤 WeatherLens

A high-performance, responsive weather insights web application built with **React + Vite + Tailwind CSS**. Integrates with the **Open-Meteo API** for real-time and historical weather data with automatic GPS-based location detection.

---

## ✨ Features

### Page 1 — Today's Weather & Hourly Forecast
- Auto GPS detection on first load (falls back to Surat, Gujarat)
- Calendar date picker to view any past date
- Temperature toggle between Celsius and Fahrenheit
- Stat cards: Temperature (Min/Max/Current/Feels Like), Precipitation, Humidity, UV Index, Sunrise/Sunset, Wind Speed, Precipitation Probability
- Air Quality panel: EU AQI, US AQI, PM10, PM2.5, CO, NO₂, SO₂, O₃
- Interactive hourly charts (zoom + scroll): Temperature, Humidity, Precipitation, Visibility, Wind Speed (10m), PM10 & PM2.5

### Page 2 — Historical Analysis (up to 2 years)
- Preset range buttons: 1M, 3M, 6M, 1Y, 2Y
- Custom date range picker (max 730 days enforced)
- Charts: Temperature (Mean/Max/Min), Sun Cycle (IST), Precipitation (bar), Wind Speed, Wind Direction, PM10 & PM2.5

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── icons/ 
│   │   ├── index.js            # All icons re-exported from lucide-react
│   │   └── WeatherIcon.jsx     # SVG Icons
│   ├── charts/Charts.jsx       # ChartWrapper, HourlyAreaChart, DualLineChart,
│   │                           # HistoricalLineChart, HistoricalBarChart, WindDirectionChart
│   └── ui/
│       ├── Navbar.jsx          # Sticky top navigation
│       ├── StatCard.jsx        # Reusable metric card
│       ├── WeatherHero.jsx     # Current conditions hero panel
│       ├── AQIPanel.jsx        # Air quality breakdown
│       ├── DatePicker.jsx      # Single & range date pickers
│       └── Elements.jsx        # SectionHeader, LoadingSkeleton, ErrorBanner, Badge, etc.
├── hooks/
│   └── useWeather.js           # useGeolocation, useCurrentWeather, useHistoricalWeather
├── pages/
│   ├── TodayPage.jsx           # Page 1: Current + hourly
│   └── HistoricalPage.jsx      # Page 2: Historical range charts
├── services/
│   └── weatherApi.js           # All API calls + WMO codes, AQI info, wind direction helpers
├── utils/
│   └── helpers.js              # formatTemp, fmt, filterHourlyByDate, aggregateDailyAQ, cn
├── App.jsx                     # Router + layout shell
├── main.jsx                    # Entry point
└── index.css                   # Tailwind + global styles + CSS variables
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | lucide-react |
| Date Utilities | date-fns + date-fns-tz |
| Date Picker | react-day-picker |
| Weather API | Open-Meteo (free, no key needed) |
| Geocoding | Nominatim / OpenStreetMap |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/weather-lens.git
cd weather-lens

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 API Reference

| API | Endpoint | Notes |
|---|---|---|
| Forecast | `https://api.open-meteo.com/v1/forecast` | Current + hourly |
| Archive | `https://api.open-meteo.com/v1/archive` | Historical |
| Air Quality | `https://air-quality-api.open-meteo.com/v1/air-quality` | PM10, PM2.5, CO, NO₂... |
| Geocoding | `https://nominatim.openstreetmap.org/reverse` | Location name from coords |

> All APIs are **free** and require **no API key**.

---

## 📊 Chart Features

All charts include:
- **Horizontal scrolling** for dense datasets
- **Zoom in/out** buttons (up to 8× zoom)
- **Brush range selector** for navigating timeframes
- **Custom styled tooltips**
- **Fully mobile responsive**

---

## 🎨 Design

- Dark theme with deep navy (`#0a0f1e`) and amber accents
- **Space Grotesk** for headings, **DM Sans** for body, **JetBrains Mono** for values
- Subtle noise texture + radial glow blobs for depth
- Fade/slide animations on page load
- Cards with amber hover glow states

---

## 📱 Mobile Support

- Responsive grids: 1 → 2 → 3 → 4 columns
- Touch-friendly chart scrolling
- Compact navbar on small screens
- All components adapt to mobile viewport

---

## ⚠️ Notes

- **CO₂** is not provided by Open-Meteo and is noted in the UI
- GPS requires HTTPS in production (works on localhost)
- Historical air quality may have gaps for some regions
- Sun cycle times on historical page are in **IST (UTC+5:30)**

---

## 📄 License

MIT — free to use, modify, and distribute.
# yash-Lattice-WeatherApp
