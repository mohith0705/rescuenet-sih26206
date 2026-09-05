import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, HeartPulse, Waves, Wind, Activity, 
  PhoneCall, Search, AlertTriangle, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function OfflineGuideModal() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 'cyclone',
      category: 'WEATHER',
      title: 'Cyclone & Extreme Wind Survival',
      icon: Wind,
      color: 'blue',
      steps: [
        'Stay indoors in the strongest part of the building (interior room/hallway).',
        'Keep clear of windows, skylights, and glass doors.',
        'Turn off electricity main breaker, gas cylinders, and water valves.',
        'Keep battery radio, torch, dry rations, and potable water ready.',
        'Do NOT venture outside when the eye of the storm passes (winds will return violently).'
      ]
    },
    {
      id: 'flood',
      category: 'WATER',
      title: 'Flash Flood & Storm Surge Protocols',
      icon: Waves,
      color: 'cyan',
      steps: [
        'Move immediately to the highest accessible level or nearest high-ground shelter.',
        'NEVER walk or drive through flowing water — 15cm of fast water can sweep an adult.',
        'Avoid downed power lines, submerged electrical transformers, and murky flood water.',
        'Boil all drinking water for at least 1 minute or use chlorine purification tablets.',
        'Signal rescue boats using bright cloths or flashing smartphone torch at regular intervals.'
      ]
    },
    {
      id: 'cpr',
      category: 'FIRST_AID',
      title: 'Emergency CPR & Drowning First-Aid',
      icon: HeartPulse,
      color: 'rose',
      steps: [
        'Check victim responsiveness: Tap shoulders firmly and ask "Are you okay?".',
        'Call for help immediately (Dial 108 / 112) or instruct a bystander to call.',
        'Place heel of hand on center of victim\'s chest, interlock other hand over it.',
        'Push hard and fast: 100 to 120 compressions per minute (depth of 5 to 6 cm).',
        'For drowned victims: Give 5 initial rescue breaths before initiating chest compressions.'
      ]
    },
    {
      id: 'earthquake',
      category: 'QUAKE',
      title: 'Earthquake: Drop, Cover & Hold On',
      icon: Activity,
      color: 'amber',
      steps: [
        'DROP down onto your hands and knees to prevent being knocked over.',
        'COVER your head and neck under a sturdy table or desk.',
        'HOLD ON to your shelter until the shaking completely stops.',
        'If outdoors, move away from buildings, streetlights, and utility wires.',
        'Expect aftershocks. Avoid using elevators during evacuation.'
      ]
    }
  ];

  const helplines = [
    { name: 'National Emergency', number: '112', color: 'red' },
    { name: 'NDRF Disaster Control', number: '1078', color: 'red' },
    { name: 'Medical / Ambulance', number: '108', color: 'emerald' },
    { name: 'State Disaster Helpline', number: '1070', color: 'amber' }
  ];

  const filteredGuides = guides.filter(g => {
    const matchesCategory = activeCategory === 'ALL' || g.category === activeCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-50 via-white to-rose-50 border border-red-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Offline Survival Guide
              <span className="text-[10px] bg-red-100 text-red-700 font-mono px-2 py-0.5 rounded-full border border-red-200 font-bold">
                100% OFFLINE
              </span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Essential life-saving protocols and first-aid available without internet connection.
            </p>
          </div>
        </div>

        {/* Quick Dial Helplines Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200">
          {helplines.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 px-3 py-2 rounded-xl transition-all touch-press shadow-sm"
            >
              <div>
                <p className="text-[10px] text-slate-500 font-medium truncate">{item.name}</p>
                <p className="text-xs font-black text-red-600 font-mono">{item.number}</p>
              </div>
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0 ml-1" />
            </a>
          ))}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search symptoms, cyclone, drowning, burns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 shadow-sm font-medium"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {['ALL', 'WEATHER', 'WATER', 'FIRST_AID', 'QUAKE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-all touch-press ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Protocols' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="space-y-3">
        {filteredGuides.map((guide) => {
          const Icon = guide.icon;
          return (
            <div
              key={guide.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">{guide.title}</h3>
              </div>

              <div className="space-y-2">
                {guide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
