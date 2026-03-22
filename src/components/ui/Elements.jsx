import React from 'react'

export function SectionHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Icon size={16} className="text-amber-400" />
          </div>
        )}
        <div>
          <h2 className="font-display font-semibold text-slate-100">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function LoadingSkeleton({ rows = 3, height = 'h-20' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`skeleton ${height} w-full`} />
      ))}
    </div>
  )
}

export function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {message}
    </div>
  )
}

export function EmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M9 17H7A5 5 0 0117 12c0 2.76-2.24 5-5 5z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 12v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export function Badge({ children, color = '#f59e0b' }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `${color}18`, color }}>
      {children}
    </span>
  )
}

export function Divider() {
  return <div className="h-px bg-amber-500/10 my-6" />
}

export function GlowCard({ children, className = '' }) {
  return (
    <div className={`weather-card amber-glow ${className}`}>
      {children}
    </div>
  )
}
