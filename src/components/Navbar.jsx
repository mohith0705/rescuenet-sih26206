import React from 'react';
import { ShieldAlert, Users, Radio, HeartHandshake, Languages } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({ activeRole, setActiveRole, activeSosCount, currentLang, setCurrentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Sleek Emergency Red Ticker with Continuous Marquee Motion */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white text-xs px-4 py-2 flex items-center justify-between shadow-md relative overflow-hidden">
        
        {/* Fixed Alert Badge */}
        <div className="flex items-center gap-2 z-10 shrink-0 bg-red-950/60 px-2.5 py-1 rounded-md border border-red-400/30 shadow-inner">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-white">ALERT:</span>
        </div>

        {/* Marquee Motion Scrolling Text Container Track */}
        <div className="mx-3 flex-1 overflow-hidden whitespace-nowrap relative flex items-center bg-red-950/45 backdrop-blur-sm py-1 px-2 rounded-lg border border-red-400/30 shadow-inner">
          {/* Left Fade Gradient Vignette */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-950/80 to-transparent z-10 pointer-events-none"></div>

          {/* Moving Marquee Text */}
          <div className="animate-marquee-ltr font-semibold tracking-wide text-red-50 text-[11px] py-0.5">
            <span className="shrink-0 pr-8">🚨 {t.disasterAlert} &nbsp;&bull;&nbsp; 🚨 {t.disasterAlert} &nbsp;&bull;&nbsp;</span>
            <span className="shrink-0 pr-8">🚨 {t.disasterAlert} &nbsp;&bull;&nbsp; 🚨 {t.disasterAlert} &nbsp;&bull;&nbsp;</span>
          </div>

          {/* Right Fade Gradient Vignette */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-950/80 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Language Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0 z-10">
          <div className="flex items-center gap-1 bg-red-950/60 border border-red-400/40 px-2.5 py-1 rounded-md text-[11px] text-white font-bold shadow-sm hover:border-white transition">
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

          <div className="hidden md:flex items-center gap-3 text-red-100 text-[11px] font-mono pl-3 border-l border-red-500/50 font-bold">
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
