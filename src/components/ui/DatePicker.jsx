import React, { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, subDays } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, X } from '../icons'
import 'react-day-picker/dist/style.css'

export function SingleDatePicker({ selected, onSelect, label = 'Select Date' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const today = new Date()
  const disabledDays = { after: today, before: subDays(today, 730) }

  return (
    <div ref={ref} className="relative group">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 pl-3 py-2 ${selected ? 'pr-9' : 'pr-3'} rounded-xl border border-amber-500/20 bg-slate-800/80 text-sm text-slate-300 hover:border-amber-500/40 hover:bg-slate-800 transition-all`}>
        <Calendar size={14} className="text-amber-400" />
        {selected ? format(selected, 'MMM d, yyyy') : label}
      </button>

      {selected && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(null); setOpen(false); }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Clear date"
        >
          <X size={14} />
        </button>
      )}

      {open && (
        <div className="absolute top-full mt-2 z-50 rounded-xl border border-slate-700 shadow-2xl"
          style={{ background: '#1e293b', minWidth: 280 }}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => { onSelect(d); setOpen(false) }}
            disabled={disabledDays}
            defaultMonth={selected || today}
            styles={{
              months: { display: 'flex' },
              month: { margin: '12px' },
              caption: { color: '#f1f5f9', fontFamily: 'Space Grotesk', marginBottom: 8 },
              head_cell: { color: '#64748b', fontSize: 11 },
              day: { color: '#cbd5e1', borderRadius: 8 },
              nav_button: { color: '#94a3b8' },
              day_today: { color: '#f59e0b', fontWeight: 'bold' },
            }}
          />
        </div>
      )}
    </div>
  )
}

export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
  const [openPicker, setOpenPicker] = useState(null) // 'start' | 'end'
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenPicker(null) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const today = new Date()
  const minDate = subDays(today, 730)

  return (
    <div ref={ref} className="flex flex-wrap items-center gap-2">
      {/* Start Date */}
      <div className="relative">
        <button onClick={() => setOpenPicker(openPicker === 'start' ? null : 'start')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/20 bg-slate-800/80 text-sm text-slate-300 hover:border-amber-500/40 transition-all">
          <Calendar size={14} className="text-amber-400" />
          {startDate ? format(startDate, 'MMM d, yyyy') : 'Start Date'}
        </button>
        {openPicker === 'start' && (
          <div className="absolute top-full mt-2 z-50 rounded-xl border border-slate-700 shadow-2xl"
            style={{ background: '#1e293b' }}>
            <DayPicker
              mode="single"
              selected={startDate}
              onSelect={(d) => { onStartChange(d); setOpenPicker(null) }}
              disabled={{ after: endDate || today, before: minDate }}
              defaultMonth={startDate || today}
              styles={{
                months: { display: 'flex' },
                month: { margin: '12px' },
                caption: { color: '#f1f5f9', fontFamily: 'Space Grotesk', marginBottom: 8 },
                head_cell: { color: '#64748b', fontSize: 11 },
                day: { color: '#cbd5e1', borderRadius: 8 },
              }}
            />
          </div>
        )}
      </div>

      <span className="text-slate-500 text-sm">to</span>

      {/* End Date */}
      <div className="relative">
        <button onClick={() => setOpenPicker(openPicker === 'end' ? null : 'end')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/20 bg-slate-800/80 text-sm text-slate-300 hover:border-amber-500/40 transition-all">
          <Calendar size={14} className="text-amber-400" />
          {endDate ? format(endDate, 'MMM d, yyyy') : 'End Date'}
        </button>
        {openPicker === 'end' && (
          <div className="absolute top-full mt-2 z-50 rounded-xl border border-slate-700 shadow-2xl"
            style={{ background: '#1e293b' }}>
            <DayPicker
              mode="single"
              selected={endDate}
              onSelect={(d) => { onEndChange(d); setOpenPicker(null) }}
              disabled={{ after: today, before: startDate || minDate }}
              defaultMonth={endDate || today}
              styles={{
                months: { display: 'flex' },
                month: { margin: '12px' },
                caption: { color: '#f1f5f9', fontFamily: 'Space Grotesk', marginBottom: 8 },
                head_cell: { color: '#64748b', fontSize: 11 },
                day: { color: '#cbd5e1', borderRadius: 8 },
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
