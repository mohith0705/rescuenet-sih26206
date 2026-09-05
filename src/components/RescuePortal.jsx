import React, { useState } from 'react';
import { 
  Radio, Shield, AlertTriangle, Phone, MapPin, Users, CheckCircle2, 
  Navigation, LifeBuoy, Clock, Flame, ChevronRight, Anchor, Layers,
  PhoneCall, ExternalLink, Filter
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

export default function RescuePortal({ 
  sosRequests, 
  rescueTeams, 
  onUpdateSosStatus, 
  onAssignTeam 
}) {
  const [selectedSosId, setSelectedSosId] = useState(sosRequests[0]?.id || null);
  const [sosFilter, setSosFilter] = useState('PENDING'); // 'PENDING' | 'DISPATCHED' | 'ALL'
  const [activeSubTab, setActiveSubTab] = useState('queue'); // 'queue' | 'map' | 'teams'

  const selectedSos = sosRequests.find(s => s.id === selectedSosId) || sosRequests[0];

  const filteredSosList = sosRequests.filter(s => {
    if (sosFilter === 'PENDING') return s.status === 'PENDING';
    if (sosFilter === 'DISPATCHED') return s.status === 'DISPATCHED';
    return true;
  });

  const criticalCount = sosRequests.filter(s => s.urgency === 'CRITICAL' && s.status !== 'RESCUED').length;
  const pendingCount = sosRequests.filter(s => s.status === 'PENDING').length;
  const rescuedCount = sosRequests.filter(s => s.status === 'RESCUED').length;

  const handleTabSwitch = (tab) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    setActiveSubTab(tab);
  };

  return (
    <div className="max-w-md md:max-w-xl mx-auto px-3 py-3 space-y-4">
      {/* Mobile KPI Grid (Clean 2x2 grid in Red & White theme) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-red-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Pending SOS</div>
            <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
              {pendingCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Critical Victims</div>
            <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
              {criticalCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">NDRF Teams</div>
            <div className="text-2xl font-black text-blue-600 font-mono mt-0.5">
              {rescueTeams.length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Shield className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Evacuated</div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
              {rescuedCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Segmented Mobile Switcher */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-300 text-xs font-bold">
        <button
          onClick={() => handleTabSwitch('queue')}
          className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 touch-press ${
            activeSubTab === 'queue'
              ? 'bg-red-600 text-white shadow-sm font-black'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Queue ({filteredSosList.length})</span>
        </button>

        <button
          onClick={() => handleTabSwitch('map')}
          className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 touch-press ${
            activeSubTab === 'map'
              ? 'bg-red-600 text-white shadow-sm font-black'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Tactical Map</span>
        </button>

        <button
          onClick={() => handleTabSwitch('teams')}
          className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 touch-press ${
            activeSubTab === 'teams'
              ? 'bg-red-600 text-white shadow-sm font-black'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Teams ({rescueTeams.length})</span>
        </button>
      </div>

      {/* VIEW 1: INCIDENT QUEUE */}
      {activeSubTab === 'queue' && (
        <div className="space-y-3">
          {/* Quick Filter Bar */}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Filter Signals:</span>
            <div className="flex gap-1">
              {['PENDING', 'DISPATCHED', 'ALL'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSosFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all touch-press ${
                    sosFilter === status
                      ? status === 'PENDING' ? 'bg-red-600 text-white shadow-sm' : status === 'DISPATCHED' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Incident Fast-Action Dispatch Card in Red & White */}
          {selectedSos && (
            <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-md space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                      selectedSos.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-500'
                    }`}>
                      {selectedSos.urgency}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">#{selectedSos.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-tight">{selectedSos.name}</h3>
                </div>

                <a
                  href={`tel:${selectedSos.phone}`}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition touch-press shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              {/* Location & GPS Info */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-start gap-1.5 text-slate-900 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span className="truncate">{selectedSos.location}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                  <span>GPS: {selectedSos.lat.toFixed(4)}°, {selectedSos.lng.toFixed(4)}°</span>
                  <span className="text-amber-700 font-bold">{selectedSos.peopleCount} Trapped</span>
                </div>
                {selectedSos.notes && (
                  <p className="text-[11px] text-slate-700 italic pt-1 border-t border-slate-200 font-medium">
                    "{selectedSos.notes}"
                  </p>
                )}
              </div>

              {/* Field Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSos.assignedTeam || ''}
                    onChange={(e) => onAssignTeam(selectedSos.id, e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded-xl p-2 focus:outline-none focus:border-red-500 font-semibold"
                  >
                    <option value="">Assign NDRF Unit...</option>
                    {rescueTeams.map(t => (
                      <option key={t.id} value={t.unitName}>
                        {t.unitName} ({t.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {selectedSos.status !== 'DISPATCHED' ? (
                    <button
                      onClick={() => onUpdateSosStatus(selectedSos.id, 'DISPATCHED')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition touch-press"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Dispatch Boat
                    </button>
                  ) : (
                    <span className="w-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" /> Boat Dispatched
                    </span>
                  )}

                  <button
                    onClick={() => onUpdateSosStatus(selectedSos.id, 'RESCUED')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition touch-press"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Evacuated
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List of Incoming Incidents */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-600 px-1 font-mono uppercase">
              Distress Queue ({filteredSosList.length})
            </div>
            {filteredSosList.map((sos) => {
              const isSelected = selectedSos?.id === sos.id;
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedSosId(sos.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer touch-press ${
                    isSelected
                      ? 'bg-red-50/70 border-red-500 shadow-md ring-1 ring-red-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white ${
                        sos.urgency === 'CRITICAL' ? 'bg-red-600' : (sos.urgency === 'HIGH' ? 'bg-amber-500' : 'bg-blue-600')
                      }`}>
                        {sos.urgency}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs">{sos.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" /> {sos.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 truncate font-medium">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{sos.location}</span>
                  </p>

                  <div className="flex items-center justify-between text-[10.5px] mt-2 pt-2 border-t border-slate-100">
                    <span className={`font-bold ${
                      sos.status === 'PENDING' ? 'text-red-600' : sos.status === 'DISPATCHED' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                      Status: {sos.status}
                    </span>
                    <span className="text-amber-700 font-mono font-bold">
                      {sos.peopleCount} Trapped
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TACTICAL MAP */}
      {activeSubTab === 'map' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-900 font-mono uppercase">Field Incident Radar</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">● Real-Time Feed</span>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <InteractiveMap 
              sosList={sosRequests}
              shelterList={[]}
              teamList={rescueTeams}
              activeFocusCoord={selectedSos ? [selectedSos.lat, selectedSos.lng] : null}
            />
          </div>

          {selectedSos && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="min-w-0 pr-2">
                <div className="text-[10px] text-slate-500 font-mono font-bold">Focused Target:</div>
                <div className="text-xs font-extrabold text-slate-900 truncate">{selectedSos.name} ({selectedSos.location})</div>
              </div>
              <button
                onClick={() => handleTabSwitch('queue')}
                className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg shrink-0 touch-press hover:bg-red-100"
              >
                Triage &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: RESCUE TEAMS ROSTER */}
      {activeSubTab === 'teams' && (
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-slate-900 px-1 font-mono uppercase">
            Active Rescue Units & Boats ({rescueTeams.length})
          </div>

          <div className="space-y-2.5">
            {rescueTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{team.unitName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{team.callsign}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    team.status === 'READY'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                  }`}>
                    {team.status === 'READY' ? 'AVAILABLE' : 'ON MISSION'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                  <div className="text-slate-600 font-medium">
                    Personnel: <span className="text-slate-900 font-mono font-bold">{team.personnel} Active</span>
                  </div>
                  <div className="text-slate-600 text-right font-medium">
                    Type: <span className="text-red-600 font-bold">{team.type || 'Quick Response'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
