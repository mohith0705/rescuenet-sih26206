import React from 'react';
import { ShieldAlert, Users, Radio, HeartHandshake, Languages } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ activeRole, setActiveRole, activeSosCount, currentLang, setCurrentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* High-Detection Emergency Red Ticker */}
      <div className="bg-red-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 overflow-hidden font-medium">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-extrabold uppercase tracking-wider text-[11px] bg-red-800 px-1.5 py-0.5 rounded">ALERT:</span>
          <span className="truncate">{t.disasterAlert}</span>
        </div>

        {/* Language Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="flex items-center gap-1 bg-red-700 border border-red-500 px-2.5 py-1 rounded-md text-[11px] text-white font-bold">
            <Languages className="w-3.5 h-3.5" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
            >
              <option value="EN" className="bg-white text-slate-900">🇬🇧 English</option>
              <option value="HI" className="bg-white text-slate-900">🇮🇳 हिंदी</option>
              <option value="TE" className="bg-white text-slate-900">🇮🇳 తెలుగు</option>
              <option value="TA" className="bg-white text-slate-900">🇮🇳 தமிழ்</option>
              <option value="BN" className="bg-white text-slate-900">🇮🇳 বাংলা</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-3 text-red-100 text-[11px] font-mono pl-3 border-l border-red-500 font-bold">
            <span>NDRF: 1078</span>
            <span>Helpline: 1070</span>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-200">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-mono">RescuENet</h1>
              <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded-full">
                SIH 26206
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">Unified Disaster Crisis & Emergency Response</p>
          </div>
        </div>

        {/* Role Navigation Switcher */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveRole('citizen')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'citizen'
                ? 'bg-red-600 text-white shadow-md font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.citizenPortal}</span>
          </button>

          <button
            onClick={() => setActiveRole('rescue')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeRole === 'rescue'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{t.rescueUnits}</span>
            {activeSosCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                {activeSosCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'admin'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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
