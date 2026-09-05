import React from 'react';
import { ShieldAlert, Users, Radio, HeartHandshake, Languages } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ activeRole, setActiveRole, activeSosCount, currentLang, setCurrentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <header className="sticky top-0 z-50 bg-[#0c1222]/95 backdrop-blur border-b border-[#1e2a45] shadow-xl">
      {/* Emergency Ticker */}
      <div className="bg-rose-950/70 border-b border-rose-900/40 text-rose-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">Alert:</span>
          <span className="truncate text-[11px] font-medium">{t.disasterAlert}</span>
        </div>

        {/* Language Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="flex items-center gap-1.5 bg-[#131b2e] border border-[#1e2a45] px-2.5 py-0.5 rounded-md text-[11px] text-amber-400 font-bold">
            <Languages className="w-3.5 h-3.5" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold"
            >
              <option value="EN" className="bg-[#131b2e] text-white">🇬🇧 English</option>
              <option value="HI" className="bg-[#131b2e] text-white">🇮🇳 हिंदी</option>
              <option value="TE" className="bg-[#131b2e] text-white">🇮🇳 తెలుగు</option>
              <option value="TA" className="bg-[#131b2e] text-white">🇮🇳 தமிழ்</option>
              <option value="BN" className="bg-[#131b2e] text-white">🇮🇳 বাংলা</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-300 text-[11px] font-mono pl-3 border-l border-[#1e2a45]">
            <span className="text-slate-400">NDRF: <strong className="text-rose-400">1078</strong></span>
            <span className="text-slate-400">Helpline: <strong className="text-amber-400">1070</strong></span>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">RescuENet</h1>
              <span className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold px-2 py-0.5 rounded-full">
                SIH 26206
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Unified Disaster Crisis & Emergency Response</p>
          </div>
        </div>

        {/* Role Navigation Switcher */}
        <nav className="flex items-center bg-[#070b14] p-1 rounded-xl border border-[#1e2a45]">
          <button
            onClick={() => setActiveRole('citizen')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'citizen'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#131b2e]'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.citizenPortal}</span>
          </button>

          <button
            onClick={() => setActiveRole('rescue')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeRole === 'rescue'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#131b2e]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{t.rescueUnits}</span>
            {activeSosCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                {activeSosCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#131b2e]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.adminCommand}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
