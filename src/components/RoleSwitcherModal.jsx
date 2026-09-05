import React from 'react';
import { X, HeartHandshake, Radio, Users, Check, Shield } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function RoleSwitcherModal({
  isOpen,
  onClose,
  activeRole,
  setActiveRole,
  activeSosCount = 0,
  currentLang = 'EN'
}) {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const roles = [
    {
      id: 'citizen',
      title: t.citizenPortal || 'Citizen / Victim Portal',
      subtitle: 'Trigger 1-tap SOS, locate nearest cyclone shelters, find missing family, and offline survival guides.',
      icon: HeartHandshake,
      color: 'red',
      badge: null
    },
    {
      id: 'rescue',
      title: t.rescueUnits || 'NDRF Field Rescue Teams',
      subtitle: 'Field triage console, acknowledge incoming distress beacons, dispatch boats, unit tracking.',
      icon: Radio,
      color: 'blue',
      badge: activeSosCount > 0 ? `${activeSosCount} Active SOS` : null
    },
    {
      id: 'admin',
      title: t.adminCommand || 'Incident Command Center (HQ)',
      subtitle: 'Disaster command dashboard, shelter logistics monitoring, mass broadcast alerts, resource allocation.',
      icon: Users,
      color: 'emerald',
      badge: 'Command'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">Switch Application Mode</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center touch-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 touch-press ${
                  isSelected
                    ? 'bg-red-50/80 border-red-500 shadow-md ring-1 ring-red-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    role.color === 'red'
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : role.color === 'blue'
                      ? 'bg-blue-100 text-blue-600 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{role.title}</h4>
                    {role.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 shrink-0">
                        {role.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {role.subtitle}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 text-center mt-4 font-mono font-medium">
          Smart India Hackathon (SIH 2026) &bull; Problem #26206
        </p>
      </div>
    </div>
  );
}
