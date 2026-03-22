/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        amber: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
        slate: { 900:'#0f172a',800:'#1e293b',700:'#334155',600:'#475569',500:'#64748b',400:'#94a3b8',300:'#cbd5e1',200:'#e2e8f0',100:'#f1f5f9',50:'#f8fafc' },
        weather: {
          precip: '#3b82f6',    // Precipitation
          humid: '#06b6d4',     // Humidity
          uv: '#f59e0b',        // UV Index
          wind: '#8b5cf6',      // Wind
          pressure: '#ec4899',  // Pressure
          visible: '#14b8a6',   // Visibility
          cloud: '#94a3b8',     // Cloud Cover
          temp: '#eab308',      // Temperature
          pm10: '#f59e0b',      // PM10
          pm25: '#ef4444',      // PM2.5
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
