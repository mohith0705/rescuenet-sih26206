import React from 'react';
import { ShieldAlert, PhoneCall, Wifi, WifiOff, Globe, BellRing } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function MobileTopBar({
  isOnline = true,
  currentLang = 'EN',
  setCurrentLang,
  activeRole,
  onOpenRoleModal,
  activeSosCount = 0
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 select-none">
      {/* Top micro status bar */}
      <div className="bg-gradient-to-r from-rose-950 via-[#101726] to-slate-900 px-3 py-1 text-[11px] flex items-center justify-between text-slate-300 border-b border-rose-900/30">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-bold text-rose-400 uppercase tracking-wide text-[10px]">ALERT</span>
          <span className="truncate text-slate-300 font-medium text-[10.5px]">
            {t.disasterAlert || "Cyclone Warning Active"}
          </span>
        </div>

        {/* Connectivity status pill */}
        <div className="flex items-center gap-2 shrink-0 ml-1">
          {isOnline ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              <Wifi className="w-2.5 h-2.5" />
              <span>LIVE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 animate-pulse">
              <WifiOff className="w-2.5 h-2.5" />
              <span>OFFLINE</span>
            </span>
          )}
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-950/40 shrink-0">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white font-mono leading-none">RescuENet</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                APP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 capitalize font-medium leading-tight">
              {activeRole === 'citizen' ? 'Citizen Emergency' : activeRole === 'rescue' ? 'NDRF Field Ops' : 'Disaster HQ'}
            </p>
          </div>
        </div>

        {/* Right actions: 1-Tap SOS Call & Language */}
        <div className="flex items-center gap-1.5">
          {/* Emergency 112 Speed-Dial */}
          <a
            href="tel:112"
            className="flex items-center gap-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 hover:text-rose-300 border border-rose-500/40 px-2 py-1 rounded-lg text-xs font-bold transition-all touch-press"
            title="Call National Emergency 112"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span className="font-mono text-[11px]">112</span>
          </a>

          {/* NDRF Speed-Dial */}
          <a
            href="tel:1078"
            className="hidden sm:flex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/40 px-2 py-1 rounded-lg text-xs font-bold transition-all touch-press"
            title="Call NDRF Helpline 1078"
          >
            <span className="font-mono text-[11px]">1078</span>
          </a>

          {/* Compact Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1">
            <Globe className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="EN" className="bg-[#090d16] text-white">EN</option>
              <option value="HI" className="bg-[#090d16] text-white">हिं</option>
              <option value="TE" className="bg-[#090d16] text-white">తె</option>
              <option value="TA" className="bg-[#090d16] text-white">த</option>
              <option value="BN" className="bg-[#090d16] text-white">বাং</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
