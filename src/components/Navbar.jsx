import React from 'react';
import { ShieldAlert, Users, Radio, HeartHandshake, Languages } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ activeRole, setActiveRole, activeSosCount, currentLang, setCurrentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
      {/* Emergency Ticker */}
      <div className="bg-red-950/80 border-b border-red-900/50 text-red-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold text-red-400 uppercase tracking-wider">Alert:</span>
          <span className="truncate">{t.disasterAlert}</span>
        </div>

        {/* Language Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[11px] text-amber-400 font-bold">
            <Languages className="w-3.5 h-3.5" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
            >
              <option value="EN" className="bg-slate-900 text-white">🇬🇧 English</option>
              <option value="HI" className="bg-slate-900 text-white">🇮🇳 हिंदी</option>
              <option value="TE" className="bg-slate-900 text-white">🇮🇳 తెలుగు</option>
              <option value="TA" className="bg-slate-900 text-white">🇮🇳 தமிழ்</option>
              <option value="BN" className="bg-slate-900 text-white">🇮🇳 বাংলা</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-300 text-[11px] font-mono pl-2 border-l border-slate-800">
            <span>NDRF: 1078</span>
            <span>Helpline: 1070</span>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
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
            <span>{t.citizenPortal}</span>
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
            <span>{t.rescueUnits}</span>
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
            <span>{t.adminCommand}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
