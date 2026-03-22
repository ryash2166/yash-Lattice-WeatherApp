import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, History, MapPin, RefreshCw } from "../icons";
import { cn } from "../../utils/helpers";

export default function Navbar({ locationName, onRefresh, loading }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-amber-500/10 backdrop-blur-xl"
      style={{ background: "rgba(10,15,30,0.85)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <circle cx="12" cy="12" r="4" fill="white" />
              <path
                d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
            Weather<span className="text-amber-400">Lens</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "nav-active"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
              )
            }
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:block">Today</span>
          </NavLink>
          <NavLink
            to="/historical"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "nav-active"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
              )
            }
          >
            <History size={16} />
            <span className="hidden sm:block">Historical</span>
          </NavLink>
        </nav>

        {/* Location + Refresh */}
        <div className="flex items-center gap-2 min-w-0">
          {locationName && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
              <MapPin size={12} className="shrink-0 text-amber-400" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {locationName}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
            title="Refresh data"
          >
            <RefreshCw size={15} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>
    </header>
  );
}
