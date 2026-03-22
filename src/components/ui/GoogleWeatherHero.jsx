import React, { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { weatherCodeToDesc } from "../../services/weatherApi";
import { fmt, formatTemp } from "../../utils/helpers";
import { WeatherIcon } from "../icons/index.js";



// Convert data to show in 3 hour steps
const CustomLabel = (props) => {
  const { x, y, value, index } = props;
  if (index % 3 !== 0) return null;
  return (
    <text
      x={x}
      y={y - 12}
      fill="#e2e8f0"
      fontSize={13}
      fontWeight={500}
      textAnchor="middle"
    >
      {Math.round(value)}
    </text>
  );
};

export default function GoogleWeatherHero({
  current,
  daily,
  locationName = "Current Location",
  selectedDate,
  setSelectedDate,
  tempUnit,
  onTempUnitChange,
}) {
  const [activeTab, setActiveTab] = useState("Temperature");

  if (!current || !daily) return null;

  const c = current.current;
  const d = daily.daily;
  const h = current.hourly;

  const todayIndex = 0; // Current day for right now
  const weatherCode = c?.weather_code ?? 0;

  // Format dates
  const displayDate = selectedDate || new Date();
  const dateStr = format(displayDate, "yyyy-MM-dd");

  // Select daily index based on selectedDate
  const dailyTimes = d?.time || [];
  const selectedDailyIndex = dailyTimes.findIndex((t) => t.startsWith(dateStr));
  const activeDayIndex = selectedDailyIndex >= 0 ? selectedDailyIndex : 0;

  // Build chart data
  const chartData = useMemo(() => {
    if (!h?.time) return [];

    // Find all hours for the selected date
    const indices = h.time
      .map((t, i) => (t.startsWith(dateStr) ? i : -1))
      .filter((i) => i >= 0);

    return indices.map((i) => {
      const isCelsius = tempUnit === "C";
      const tempVal = isCelsius
        ? h.temperature_2m[i]
        : (h.temperature_2m[i] * 9) / 5 + 32;

      return {
        time: h.time[i],
        displayTime: format(parseISO(h.time[i]), "h a").toLowerCase(),
        temperature: tempVal,
        precipitation: h.precipitation_probability
          ? h.precipitation_probability[i]
          : h.precipitation?.[i] || 0,
        wind: h.wind_speed_10m[i],
      };
    });
  }, [h, dateStr, tempUnit]);

  // Get main display temp (either selected date's max, or current actual if today)
  const isToday =
    !selectedDate ||
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const displayTempRaw = isToday
    ? c?.temperature_2m
    : d?.temperature_2m_max[activeDayIndex] || 0;
  const displayTemp =
    tempUnit === "C" ? displayTempRaw : (displayTempRaw * 9) / 5 + 32;

  const displayDesc = isToday
    ? weatherCodeToDesc(weatherCode)
    : weatherCodeToDesc(d?.weather_code?.[activeDayIndex] || 0);
  const displayTime = isToday
    ? format(new Date(), "EEEE, h:mm a")
    : format(displayDate, "EEEE, h:mm a");

  // We'll prepare 7 daily cards (or as many as returned, usually 7-8)
  const dailyForecasts = (d?.time || [])
    .map((timeStr, idx) => {
      const isCelsius = tempUnit === "C";
      const maxT = isCelsius
        ? d.temperature_2m_max[idx]
        : (d.temperature_2m_max[idx] * 9) / 5 + 32;
      const minT = isCelsius
        ? d.temperature_2m_min[idx]
        : (d.temperature_2m_min[idx] * 9) / 5 + 32;

      return {
        date: parseISO(timeStr),
        dayName: format(parseISO(timeStr), "EEE, MMM d"),
        iconCode: d.weather_code?.[idx] || 0,
        max: maxT,
        min: minT,
      };
    })
    .slice(0, 7);

  const activeDataKey =
    activeTab === "Temperature"
      ? "temperature"
      : activeTab === "Precipitation"
        ? "precipitation"
        : "wind";
  const chartColor =
    activeTab === "Temperature"
      ? "#eab308"
      : activeTab === "Precipitation"
        ? "#3b82f6"
        : "#22c55e";

  return (
    <div className="bg-[#202124] rounded-2xl overflow-hidden text-slate-200 border border-slate-700/50 shadow-lg mx-auto w-full font-sans">
      {/* Search / Top banner resembling Google */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/50">
        <span className="text-[14px] text-slate-300">
          Results for{" "}
          <span className="font-bold text-white">
            {locationName || "Current Location"}
          </span>
        </span>
      </div>

      {/* Current Conditions */}
      <div className="px-6 pt-6 pb-2 pb flex flex-col md:flex-row md:items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="-ml-3 drop-shadow-lg">
            <WeatherIcon
              code={
                isToday ? weatherCode : d?.weather_code?.[activeDayIndex] || 0
              }
              size={96}
            />
          </div>

          {/* Temperature wrapper */}
          <div className="flex items-start">
            <span
              className="text-7xl font-normal tracking-tight text-white"
              style={{ lineHeight: "1", marginTop: "-4px" }}
            >
              {Math.round(displayTemp)}
            </span>
            <div className="flex gap-1.5 ml-3 mt-1 text-lg font-medium text-slate-400">
              <button
                onClick={() => onTempUnitChange?.("C")}
                className={`transition-colors ${tempUnit === "C" ? "text-white" : "hover:text-slate-300"}`}
              >
                °C
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => onTempUnitChange?.("F")}
                className={`transition-colors ${tempUnit === "F" ? "text-white" : "hover:text-slate-300"}`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Detailed small stats */}
          {isToday && (
            <div className="hidden sm:flex flex-col gap-1 ml-6 text-[13px] text-[#9aa0a6]">
              <p>Precipitation: {fmt(c?.precipitation)}mm</p>
              <p>Humidity: {Math.round(c?.relative_humidity_2m || 0)}%</p>
              <p>Wind: {Math.round(c?.wind_speed_10m || 0)} km/h</p>
            </div>
          )}
        </div>

        {/* Right side labels */}
        <div className="flex flex-col text-right mt-4 md:mt-0">
          <h2 className="text-2xl font-medium text-white mb-1 tracking-tight">
            Weather
          </h2>
          <p className="text-[14px] text-[#9aa0a6]">{displayTime}</p>
          <p className="text-[14px] text-[#9aa0a6]">{displayDesc}</p>
        </div>
      </div>

      <div className="px-6 block sm:hidden">
        <div className="flex gap-4 text-[13px] text-[#9aa0a6] mt-2 mb-4">
          <p>Precip: {fmt(c?.precipitation)}mm</p>
          <p>Hum: {Math.round(c?.relative_humidity_2m || 0)}%</p>
          <p>Wind: {Math.round(c?.wind_speed_10m || 0)}km/h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex items-center gap-0 mt-2 border-b-2 border-[#3c4043] relative">
        {["Temperature", "Precipitation", "Wind"].map((tab, i) => (
          <React.Fragment key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-[14px] font-medium relative transition-colors ${activeTab === tab ? "text-white" : "text-[#9aa0a6] hover:text-slate-300"}`}
            >
              {tab}
              {activeTab === tab && (
                <div
                  className="absolute bottom-[-2px] left-0 w-full h-[3px] rounded-t-sm"
                  style={{ backgroundColor: chartColor }}
                />
              )}
            </button>
            {i < 2 && <span className="mx-3 mb-2 text-[#5f6368]">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Chart Section */}
      <div className="w-full h-[140px] mt-6 px-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayTime"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload, index }) =>
                index % 3 === 0 ? (
                  <text
                    x={x}
                    y={y + 10}
                    fill="#9aa0a6"
                    fontSize={12}
                    textAnchor="middle"
                  >
                    {payload.value}
                  </text>
                ) : null
              }
              interval={0}
            />
            <Area
              type="monotone"
              dataKey={activeDataKey}
              stroke={chartColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)"
            >
              <LabelList content={<CustomLabel />} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Forecast Row */}
      <div className="px-6 py-6 pb-8 border-t border-[#3c4043] mt-4 flex justify-between overflow-x-auto gap-2 chart-scroll-container">
        {dailyForecasts.map((day, idx) => {
          const isActive = activeDayIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate?.(day.date)}
              className={`flex flex-col items-center flex-1 min-w-[70px] py-2 rounded-xl border border-transparent transition-all ${isActive ? "bg-[#303134] border-slate-700/50" : "hover:bg-[#28292c]"}`}
            >
              <span className="text-[14px] text-slate-300 font-medium mb-1">
                {day.dayName}
              </span>
              <div className="my-1 scale-90">
                <WeatherIcon code={day.iconCode} size={40} />
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-medium text-[13px]">
                <span className="text-white">{Math.round(day.max)}°</span>
                <span className="text-[#9aa0a6]">{Math.round(day.min)}°</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
