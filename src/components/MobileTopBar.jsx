import React from 'react';
import { ShieldAlert, PhoneCall, Wifi, WifiOff, Globe } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm select-none">
      {/* Sleek Emergency Red Ticker with Continuous Marquee Motion */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white text-xs px-3 py-1.5 flex items-center justify-between shadow-sm relative overflow-hidden">
        {/* Fixed Alert Badge */}
        <div className="flex items-center gap-1.5 z-10 shrink-0 bg-red-950/60 px-2 py-0.5 rounded border border-red-400/30">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-black uppercase tracking-wider text-[10px] text-white">ALERT</span>
        </div>

        {/* Marquee Motion Scrolling Text Container Track */}
        <div className="mx-2 flex-1 overflow-hidden whitespace-nowrap relative flex items-center bg-red-950/40 backdrop-blur-sm py-0.5 px-2 rounded border border-red-400/30">
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-red-950/80 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee-ltr font-extrabold tracking-wider text-white text-[11px] py-0.5 drop-shadow-sm">
            <span className="shrink-0 pr-6">🚨 {t.disasterAlert} &nbsp;&bull;&nbsp;</span>
            <span className="shrink-0 pr-6">🚨 {t.disasterAlert} &nbsp;&bull;&nbsp;</span>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-red-950/80 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Connectivity status badge */}
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          {isOnline ? (
            <span className="flex items-center gap-1 text-[10px] text-white font-mono bg-emerald-700/80 px-1.5 py-0.5 rounded font-bold border border-emerald-500/40">
              <Wifi className="w-2.5 h-2.5" />
              <span>LIVE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-white font-mono bg-amber-700/80 px-1.5 py-0.5 rounded font-bold border border-amber-500/40 animate-pulse">
              <WifiOff className="w-2.5 h-2.5" />
              <span>OFFLINE</span>
            </span>
          )}
        </div>
      </div>

      {/* Main App Bar in Red & White Theme */}
      <div className="px-3 py-2 flex items-center justify-between gap-2 bg-white">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-md shadow-red-200 shrink-0">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-slate-900 font-mono leading-none">RescuENet</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                APP
              </span>
            </div>
            <p className="text-[10px] text-slate-500 capitalize font-semibold leading-tight">
              {activeRole === 'citizen' ? 'Citizen Emergency' : activeRole === 'rescue' ? 'NDRF Field Ops' : 'Disaster HQ'}
            </p>
          </div>
        </div>

        {/* Right actions: 1-Tap SOS Call & Language */}
        <div className="flex items-center gap-1.5">
          {/* Emergency 112 Speed-Dial */}
          <a
            href="tel:112"
            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-lg text-xs font-bold transition-all touch-press shadow-sm"
            title="Call National Emergency 112"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            <span className="font-mono text-[11px] font-extrabold">112</span>
          </a>

          {/* NDRF Speed-Dial */}
          <a
            href="tel:1078"
            className="hidden sm:flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-xs font-bold transition-all touch-press shadow-sm"
            title="Call NDRF Helpline 1078"
          >
            <span className="font-mono text-[11px]">1078</span>
          </a>

          {/* Compact Language Selector */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-1.5 py-1">
            <Globe className="w-3 h-3 text-slate-600 mr-1 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-slate-800 text-[11px] font-bold focus:outline-none cursor-pointer"
            >
              <option value="EN">EN</option>
              <option value="HI">हिं</option>
              <option value="TE">తె</option>
              <option value="TA">த</option>
              <option value="BN">বাং</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
