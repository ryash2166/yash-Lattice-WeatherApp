import React from "react";

export default function WeatherIcon({ code, size = 64 }) {
  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
  const isThunder = [95, 96, 99].includes(code);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(code);
  const isFog = [45, 48].includes(code);
  const isCloud = [2, 3].includes(code);
  const isDrizzle = [51, 53, 55].includes(code);

  if (isThunder)
    return (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: size, height: size }}>
        <path d="M16 40c-6.6-1.4-10-6.8-10-12 0-7.2 5.8-13 13-13 .6 0 1.2 0 1.8.1C22.6 9.7 27.4 7 33 7c8.3 0 15 6.7 15 15 0 .4 0 .8-.1 1.2 3.1 1.2 5.1 4.1 5.1 7.5 0 4.5-3.6 8-8 8H16z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
        <path d="M30 26l-6 12h8l-4 10 12-14h-8l6-8H30z" fill="#fbbf24" />
      </svg>
    );

  if (isRain || isDrizzle)
    return (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: size, height: size }}>
        <path d="M14 36c-5.5-1.2-9-6-9-11 0-6.6 5.4-12 12-12 .5 0 1 0 1.5.1C20 7.6 24.7 5 30 5c7.7 0 14 6.3 14 14 0 .4 0 .8-.1 1.1C47 21.2 49 24 49 27.2c0 4.1-3.3 7.5-7.5 7.5H14z" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M20 42l-2 6M28 42l-2 6M36 42l-2 6M24 47l-2 6M32 47l-2 6" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );

  if (isSnow)
    return (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: size, height: size }}>
        <path d="M14 34c-5-1-8-5.5-8-10 0-6 4.9-11 11-11 .5 0 1 0 1.4.1C20 7.5 24.5 5 30 5c7 0 12.7 5.7 12.7 12.7l-.1.9C46 19.8 48 22.5 48 25.7c0 3.7-3 6.7-6.7 6.7L14 34z" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="20" cy="42" r="2" fill="white" opacity="0.8" />
        <circle cx="28" cy="46" r="2" fill="white" opacity="0.8" />
        <circle cx="36" cy="42" r="2" fill="white" opacity="0.8" />
        <circle cx="24" cy="50" r="2" fill="white" opacity="0.8" />
        <circle cx="32" cy="50" r="2" fill="white" opacity="0.8" />
      </svg>
    );

  if (isFog)
    return (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: size, height: size }}>
        <path d="M12 20c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#94a3b8" strokeWidth="2" fill="none" />
        <path d="M8 30h48M14 38h36M20 46h24" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );

  if (isCloud)
    return (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: size, height: size }}>
        <path d="M16 40c-6.6-1.4-10-6.8-10-12 0-7.2 5.8-13 13-13 .6 0 1.2 0 1.8.1C22.6 9.7 27.4 7 33 7c8.3 0 15 6.7 15 15 0 .4 0 .8-.1 1.2 3.1 1.2 5.1 4.1 5.1 7.5 0 4.5-3.6 8-8 8H16z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
      </svg>
    );
  
  // Clear / sunny
  return (
    <svg viewBox="0 0 64 64" fill="none" style={{ width: size, height: size }}>
      <circle cx="32" cy="32" r="16" fill="#fbbf24" />
      <circle cx="32" cy="32" r="16" fill="url(#sun-gradient)" opacity="0.8" />
      <g stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        <line x1="32" y1="8" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="56" />
        <line x1="8" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="56" y2="32" />
        <line x1="15" y1="15" x2="18" y2="18" />
        <line x1="46" y1="46" x2="49" y2="49" />
        <line x1="49" y1="15" x2="46" y2="18" />
        <line x1="18" y1="46" x2="15" y2="49" />
      </g>
      <defs>
        <radialGradient id="sun-gradient">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
    </svg>
  );
}
