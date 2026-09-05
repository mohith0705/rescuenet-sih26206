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
      {/* Mobile KPI Grid (Clean 2x2 grid, never squishes) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#131b2e] p-3 rounded-xl border border-rose-900/40 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pending SOS</div>
            <div className="text-xl font-extrabold text-rose-400 font-mono mt-0.5">
              {pendingCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-900/60 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        <div className="bg-[#131b2e] p-3 rounded-xl border border-amber-900/40 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Critical Victims</div>
            <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
              {criticalCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-900/60 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#131b2e] p-3 rounded-xl border border-blue-900/40 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">NDRF Teams</div>
            <div className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">
              {rescueTeams.length}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-900 flex items-center justify-center text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#131b2e] p-3 rounded-xl border border-emerald-900/40 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Evacuated</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {rescuedCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-900/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Segmented Mobile Switcher */}
      <div className="flex bg-[#0a101d] p-1 rounded-xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => handleTabSwitch('queue')}
          className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 touch-press ${
            activeSubTab === 'queue'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Queue ({filteredSosList.length})</span>
        </button>

        <button
          onClick={() => handleTabSwitch('map')}
          className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 touch-press ${
            activeSubTab === 'map'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Tactical Map</span>
        </button>

        <button
          onClick={() => handleTabSwitch('teams')}
          className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 touch-press ${
            activeSubTab === 'teams'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-extrabold'
              : 'text-slate-400 hover:text-white'
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
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Filter Signals:</span>
            <div className="flex gap-1">
              {['PENDING', 'DISPATCHED', 'ALL'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSosFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all touch-press ${
                    sosFilter === status
                      ? status === 'PENDING' ? 'bg-rose-600 text-white' : status === 'DISPATCHED' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Incident Fast-Action Dispatch Card */}
          {selectedSos && (
            <div className="bg-gradient-to-b from-[#182238] to-[#0f172a] p-4 rounded-2xl border border-blue-500/40 shadow-xl space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                      selectedSos.urgency === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-600'
                    }`}>
                      {selectedSos.urgency}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#{selectedSos.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1 leading-tight">{selectedSos.name}</h3>
                </div>

                <a
                  href={`tel:${selectedSos.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950 transition touch-press shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              {/* Location & GPS Info */}
              <div className="bg-[#090d16] p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-start gap-1.5 text-white font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="truncate">{selectedSos.location}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-900">
                  <span>GPS: {selectedSos.lat.toFixed(4)}°, {selectedSos.lng.toFixed(4)}°</span>
                  <span className="text-amber-400 font-bold">{selectedSos.peopleCount} Trapped</span>
                </div>
                {selectedSos.notes && (
                  <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-900">
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
                    className="flex-1 bg-[#090d16] border border-slate-700 text-xs text-white rounded-xl p-2 focus:outline-none focus:border-blue-500 font-semibold"
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
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-950 transition touch-press"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Dispatch Boat
                    </button>
                  ) : (
                    <span className="w-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" /> Boat Dispatched
                    </span>
                  )}

                  <button
                    onClick={() => onUpdateSosStatus(selectedSos.id, 'RESCUED')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition touch-press"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Evacuated
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List of Incoming Incidents */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 px-1 font-mono uppercase">
              Distress Queue ({filteredSosList.length})
            </div>
            {filteredSosList.map((sos) => {
              const isSelected = selectedSos?.id === sos.id;
              return (
                <div
                  key={sos.id}
                  onClick={() => setSelectedSosId(sos.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer touch-press ${
                    isSelected
                      ? 'bg-[#18233c] border-blue-500 shadow-md ring-1 ring-blue-500/50'
                      : 'bg-[#0f172a]/90 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white ${
                        sos.urgency === 'CRITICAL' ? 'bg-rose-600' : (sos.urgency === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600')
                      }`}>
                        {sos.urgency}
                      </span>
                      <h4 className="font-bold text-white text-xs">{sos.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {sos.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{sos.location}</span>
                  </p>

                  <div className="flex items-center justify-between text-[10.5px] mt-2 pt-2 border-t border-slate-800/80">
                    <span className={`font-semibold ${
                      sos.status === 'PENDING' ? 'text-rose-400' : sos.status === 'DISPATCHED' ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      Status: {sos.status}
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
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
            <span className="text-xs font-bold text-white font-mono uppercase">Field Incident Radar</span>
            <span className="text-[10px] text-emerald-400 font-mono">● Real-Time Feed</span>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <InteractiveMap 
              sosList={sosRequests}
              shelterList={[]}
              teamList={rescueTeams}
              activeFocusCoord={selectedSos ? [selectedSos.lat, selectedSos.lng] : null}
            />
          </div>

          {selectedSos && (
            <div className="bg-[#131b2e] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-[10px] text-slate-400 font-mono">Focused Target:</div>
                <div className="text-xs font-bold text-white truncate">{selectedSos.name} ({selectedSos.location})</div>
              </div>
              <button
                onClick={() => handleTabSwitch('queue')}
                className="text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1.5 rounded-lg shrink-0 touch-press"
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
          <div className="text-xs font-bold text-white px-1 font-mono uppercase">
            Active Rescue Units & Boats ({rescueTeams.length})
          </div>

          <div className="space-y-2.5">
            {rescueTeams.map((team) => (
              <div
                key={team.id}
                className="bg-[#131b2e] p-3.5 rounded-xl border border-slate-800 space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-400">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{team.unitName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{team.callsign}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    team.status === 'READY'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-blue-950 text-blue-400 border border-blue-800 animate-pulse'
                  }`}>
                    {team.status === 'READY' ? 'AVAILABLE' : 'ON MISSION'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
                  <div className="text-slate-400">
                    Personnel: <span className="text-white font-mono font-bold">{team.personnel} Active</span>
                  </div>
                  <div className="text-slate-400 text-right">
                    Type: <span className="text-amber-400 font-semibold">{team.type || 'Quick Response'}</span>
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
