import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Droplets,
  CloudRain,
  Eye,
  Wind,
  Activity,
  Gauge,
  Umbrella,
  Sun,
  BarChart2,
  X,
} from "../components/icons";
import { useCurrentWeather } from "../hooks/useWeather";
import { filterHourlyByDate, formatTemp, fmt } from "../utils/helpers";
import { CHART_PALETTE } from "../utils/constants";
// import WeatherHero from "../components/ui/WeatherHero";
// FUTURE UPDATE: Replace the above with this import for the Google Style UI
import GoogleWeatherHero from "../components/ui/GoogleWeatherHero";
import AQIPanel from "../components/ui/AQIPanel";
import StatCard from "../components/ui/StatCard";
import {
  SectionHeader,
  LoadingSkeleton,
  ErrorBanner,
} from "../components/ui/Elements";
import { SingleDatePicker } from "../components/ui/DatePicker";
import {
  ChartWrapper,
  HourlyAreaChart,
  DualLineChart,
} from "../components/charts/Charts";

export default function TodayPage({ location, locationName }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempUnit, setTempUnit] = useState("C");

  const { data, aqData, loading, error, refetch } = useCurrentWeather(
    location,
    selectedDate,
  );

  // Build hourly chart data
  const hourlyChartData = useMemo(() => {
    if (!data?.hourly) return [];
    const h = data.hourly;
    const times = h.time || [];
    const filterDate = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : times[0]?.slice(0, 10);

    const indices = times
      .map((t, i) => (t.startsWith(filterDate) ? i : -1))
      .filter((i) => i >= 0);

    return indices.map((i) => ({
      time: times[i],
      temperature:
        tempUnit === "F"
          ? parseFloat(((h.temperature_2m?.[i] * 9) / 5 + 32).toFixed(1))
          : h.temperature_2m?.[i],
      humidity: h.relative_humidity_2m?.[i],
      precipitation: h.precipitation?.[i],
      visibility:
        h.visibility?.[i] != null ? +(h.visibility[i] / 1000).toFixed(2) : null,
      windSpeed: h.wind_speed_10m?.[i],
    }));
  }, [data, selectedDate, tempUnit]);

  // Build hourly AQ data
  const hourlyAQData = useMemo(() => {
    if (!aqData?.hourly) return [];
    const h = aqData.hourly;
    const times = h.time || [];
    const filterDate = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : times[0]?.slice(0, 10);

    const indices = times
      .map((t, i) => (t.startsWith(filterDate) ? i : -1))
      .filter((i) => i >= 0);

    return indices.map((i) => ({
      time: times[i],
      pm10: h.pm10?.[i],
      pm2_5: h.pm2_5?.[i],
    }));
  }, [aqData, selectedDate]);

  const d = data?.daily;
  const todayIdx = 0;
  const c = data?.current;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-100">
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Today's Weather"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Current conditions & hourly forecast
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SingleDatePicker
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          {/* Temp toggle */}
          <div className="flex items-center rounded-lg overflow-hidden border border-slate-700">
            {["C", "F"].map((u) => (
              <button
                key={u}
                onClick={() => setTempUnit(u)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  tempUnit === u
                    ? "bg-amber-500 text-black"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingSkeleton rows={4} height="h-32" />
      ) : (
        <>
          {/* Hero */}
          {/* <WeatherHero
            current={data}
            daily={data}
            date={selectedDate}
            tempUnit={tempUnit}
          /> */}

          
            {/* FUTURE UPDATE: To use the new Google Weather widget, remove WeatherHero above
            and uncomment this block. Make sure to also update weatherApi.js (see comments there). */}
            
            <GoogleWeatherHero
              current={data}
              daily={data}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              tempUnit={tempUnit}
              onTempUnitChange={setTempUnit}
              locationName={locationName}
            />
         

          {/* Stat Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard
              icon={CloudRain}
              label="Precipitation"
              color={CHART_PALETTE.precipitation}
              value={fmt(c?.precipitation)}
              unit="mm"
            />
            <StatCard
              icon={Droplets}
              label="Humidity"
              color={CHART_PALETTE.humidity}
              value={fmt(c?.relative_humidity_2m)}
              unit="%"
            />
            <StatCard
              icon={Sun}
              label="UV Index"
              color={CHART_PALETTE.uv}
              value={fmt(d?.uv_index_max?.[todayIdx], 1)}
              badge={
                d?.uv_index_max?.[todayIdx] > 7
                  ? "High"
                  : d?.uv_index_max?.[todayIdx] > 3
                    ? "Mod"
                    : "Low"
              }
              badgeColor={
                d?.uv_index_max?.[todayIdx] > 7 ? CHART_PALETTE.pm25 : "#22c55e"
              }
            />
            <StatCard
              icon={Wind}
              label="Max Wind Speed"
              color={CHART_PALETTE.wind}
              value={fmt(d?.wind_speed_10m_max?.[todayIdx])}
              unit="km/h"
            />
            <StatCard
              icon={Umbrella}
              label="Precipitation Prob."
              color={CHART_PALETTE.precipProb}
              value={fmt(d?.precipitation_probability_max?.[todayIdx])}
              unit="%"
            />
            <StatCard
              icon={Gauge}
              label="Pressure"
              color={CHART_PALETTE.pressure}
              value={fmt(c?.surface_pressure, 0)}
              unit="hPa"
            />
            <StatCard
              icon={Eye}
              label="Visibility"
              color={CHART_PALETTE.visibility}
              value={
                c?.visibility != null ? (c.visibility / 1000).toFixed(1) : "N/A"
              }
              unit="km"
            />
            <StatCard
              icon={Activity}
              label="Cloud Cover"
              color={CHART_PALETTE.cloud}
              value={fmt(c?.cloud_cover)}
              unit="%"
            />
          </div>

          {/* AQI + Charts side-by-side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <AQIPanel aqData={aqData} date={selectedDate} />
            </div>

            {/* Hourly Charts */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <SectionHeader
                  title="Hourly Charts"
                  subtitle="Scroll & zoom to explore"
                  icon={BarChart2}
                />
              </div>

              <ChartWrapper
                title={`Temperature (°${tempUnit})`}
                dataLength={hourlyChartData.length}
              >
                <HourlyAreaChart
                  data={hourlyChartData}
                  dataKey="temperature"
                  color={CHART_PALETTE.temperature}
                  unit={`°${tempUnit}`}
                  name={`Temp (°${tempUnit})`}
                  gradientId="grad-temp"
                />
              </ChartWrapper>

              <ChartWrapper
                title="Relative Humidity"
                dataLength={hourlyChartData.length}
              >
                <HourlyAreaChart
                  data={hourlyChartData}
                  dataKey="humidity"
                  color={CHART_PALETTE.humidity}
                  unit="%"
                  name="Humidity"
                  gradientId="grad-hum"
                />
              </ChartWrapper>

              <ChartWrapper
                title="Precipitation"
                dataLength={hourlyChartData.length}
              >
                <HourlyAreaChart
                  data={hourlyChartData}
                  dataKey="precipitation"
                  color={CHART_PALETTE.precipitation}
                  unit=" mm"
                  name="Precipitation"
                  gradientId="grad-precip"
                />
              </ChartWrapper>

              <ChartWrapper
                title="Visibility"
                dataLength={hourlyChartData.length}
              >
                <HourlyAreaChart
                  data={hourlyChartData}
                  dataKey="visibility"
                  color={CHART_PALETTE.visibility}
                  unit=" km"
                  name="Visibility"
                  gradientId="grad-vis"
                />
              </ChartWrapper>

              <ChartWrapper
                title="Wind Speed (10m)"
                dataLength={hourlyChartData.length}
              >
                <HourlyAreaChart
                  data={hourlyChartData}
                  dataKey="windSpeed"
                  color="#22c55e"
                  unit=" km/h"
                  name="Wind Speed"
                  gradientId="grad-wind"
                />
              </ChartWrapper>

              <ChartWrapper
                title="PM10 & PM2.5"
                subtitle="Particulate matter"
                dataLength={hourlyAQData.length}
              >
                <DualLineChart
                  data={hourlyAQData}
                  keys={["pm10", "pm2_5"]}
                  colors={[CHART_PALETTE.pm10, CHART_PALETTE.pm25]}
                  unit=" µg/m³"
                />
              </ChartWrapper>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
