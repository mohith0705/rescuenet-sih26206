import React from 'react';
import { AlertCircle, MapPin, Users, BookOpen, Layers } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  activeRole,
  onOpenRoleModal,
  activeSosCount = 0,
  currentLang = 'EN'
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const handleTabClick = (tabId) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    setActiveTab(tabId);
  };

  const navItems = [
    {
      id: 'sos',
      label: t.tabSos || 'SOS',
      icon: AlertCircle,
      isPrimary: true,
      color: 'red'
    },
    {
      id: 'shelters',
      label: t.tabMap || 'Shelters',
      icon: MapPin,
      color: 'blue'
    },
    {
      id: 'missing',
      label: t.tabMissing || 'Missing',
      icon: Users,
      color: 'amber'
    },
    {
      id: 'guide',
      label: t.tabGuide || 'Guides',
      icon: BookOpen,
      color: 'emerald'
    },
    {
      id: 'roles',
      label: activeRole === 'citizen' ? 'Modes' : activeRole === 'rescue' ? 'Units' : 'HQ',
      icon: Layers,
      color: 'purple',
      badge: activeSosCount > 0 ? activeSosCount : null,
      action: onOpenRoleModal
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-5px_25px_rgba(0,0,0,0.08)] pb-safe select-none">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'roles' ? false : activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="group relative -top-3 flex flex-col items-center justify-center focus:outline-none touch-press"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white ring-4 ring-red-200 shadow-red-500/40 scale-105'
                      : 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-red-500/30 group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className={`text-[10px] font-black mt-1 tracking-tight ${
                  isActive ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  handleTabClick(item.id);
                }
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 relative focus:outline-none touch-press"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-150 ${
                    isActive
                      ? 'text-red-600 stroke-[2.5]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                  isActive
                    ? 'font-black text-red-600'
                    : 'font-semibold text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
