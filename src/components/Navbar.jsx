import React from 'react';
import { ShieldAlert, Users, Radio, PhoneCall, AlertCircle, HeartHandshake } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, activeSosCount }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
      {/* Emergency Ticker */}
      <div className="bg-red-950/80 border-b border-red-900/50 text-red-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold text-red-400 uppercase tracking-wider">Disaster Alert:</span>
          <span className="truncate">Cyclone Warning Active - Heavy Rainfall & Coastal Surge expected in Sector 1-5. Stay in designated shelters.</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-slate-500">NDRF Control:</span> 1078
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-slate-500">State Helpline:</span> 1070
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-900/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">RescuENet</h1>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-2 py-0.5 rounded-full">
                SIH 26206
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Unified Disaster Crisis & Emergency Response</p>
          </div>
        </div>

        {/* Role Navigation Switcher */}
        <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveRole('citizen')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'citizen'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Citizen / Victim</span>
          </button>

          <button
            onClick={() => setActiveRole('rescue')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeRole === 'rescue'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Rescue Units</span>
            {activeSosCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                {activeSosCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Admin Command</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
