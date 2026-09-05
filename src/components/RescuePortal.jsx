import React, { useState } from 'react';
import { 
  Radio, Shield, AlertTriangle, Phone, MapPin, Users, CheckCircle2, 
  Navigation, LifeBuoy, Clock, Flame, ChevronRight, Anchor 
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

  const selectedSos = sosRequests.find(s => s.id === selectedSosId) || sosRequests[0];

  const filteredSosList = sosRequests.filter(s => {
    if (sosFilter === 'PENDING') return s.status === 'PENDING';
    if (sosFilter === 'DISPATCHED') return s.status === 'DISPATCHED';
    return true;
  });

  const criticalCount = sosRequests.filter(s => s.urgency === 'CRITICAL' && s.status !== 'RESCUED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Pending SOS Calls</div>
            <div className="text-2xl font-extrabold text-red-400 font-mono mt-1">
              {sosRequests.filter(s => s.status === 'PENDING').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-900 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Critical Priority Victims</div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{criticalCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-900 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Active NDRF Rescue Teams</div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1">{rescueTeams.length}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-900 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Successfully Evacuated</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {sosRequests.filter(s => s.status === 'RESCUED').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-900 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Incident Dispatch Stream */}
        <div className="lg:col-span-1 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col space-y-4 h-[620px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" /> Live SOS Feed
              </h3>
              <p className="text-[11px] text-slate-400">Real-time distress signals queue</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button 
                onClick={() => setSosFilter('PENDING')} 
                className={`px-2 py-1 rounded font-semibold transition ${sosFilter === 'PENDING' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setSosFilter('DISPATCHED')} 
                className={`px-2 py-1 rounded font-semibold transition ${sosFilter === 'DISPATCHED' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Active
              </button>
              <button 
                onClick={() => setSosFilter('ALL')} 
                className={`px-2 py-1 rounded font-semibold transition ${sosFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                All
              </button>
            </div>
          </div>

          {/* List of SOS Items */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredSosList.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active distress calls match this filter.
              </div>
            ) : (
              filteredSosList.map(sos => {
                const isSelected = selectedSos?.id === sos.id;
                return (
                  <div
                    key={sos.id}
                    onClick={() => setSelectedSosId(sos.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-slate-850 border-blue-500/80 shadow-lg ring-1 ring-blue-500/30'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                        sos.urgency === 'CRITICAL' ? 'bg-red-600' : (sos.urgency === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600')
                      }`}>
                        {sos.urgency}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {sos.timestamp}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs">{sos.name}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {sos.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-amber-400">{sos.peopleCount} Trapped</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                      <span className={`font-semibold ${
                        sos.status === 'PENDING' ? 'text-red-400' : (sos.status === 'DISPATCHED' ? 'text-blue-400' : 'text-emerald-400')
                      }`}>
                        Status: {sos.status}
                      </span>
                      {sos.assignedTeam && (
                        <span className="text-slate-400 text-[10px] font-mono truncate max-w-[120px]">
                          Assigned: {sos.assignedTeam}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Incident Tactical Action & Map */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tactical Map */}
          <InteractiveMap 
            sosList={sosRequests}
            shelterList={[]}
            teamList={rescueTeams}
            activeFocusCoord={selectedSos ? [selectedSos.lat, selectedSos.lng] : null}
          />

          {/* Selected Incident Detail & Dispatch Panel */}
          {selectedSos && (
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded text-white ${
                      selectedSos.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {selectedSos.urgency} PRIORITY INCIDENT
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: #{selectedSos.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedSos.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedSos.phone}`}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call Victim ({selectedSos.phone})
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-medium">Victim Location & Landmark:</div>
                  <div className="text-white font-semibold flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{selectedSos.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pt-1">
                    GPS Coordinates: {selectedSos.lat.toFixed(4)}° N, {selectedSos.lng.toFixed(4)}° E
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-medium">Incident Notes & Needs:</div>
                  <p className="text-slate-200 italic leading-relaxed">
                    "{selectedSos.notes || 'No extra notes provided by citizen.'}"
                  </p>
                  <div className="text-amber-400 font-mono font-bold">
                    Total Victims in Distress: {selectedSos.peopleCount} Persons
                  </div>
                </div>
              </div>

              {/* Status Update & Team Assignment Control Strip */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Assign Rescue Team:</span>
                  <select
                    value={selectedSos.assignedTeam || ''}
                    onChange={(e) => onAssignTeam(selectedSos.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="">Select NDRF Unit...</option>
                    {rescueTeams.map(t => (
                      <option key={t.id} value={t.unitName}>
                        {t.unitName} ({t.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSos.status === 'PENDING' && (
                    <button
                      onClick={() => onUpdateSosStatus(selectedSos.id, 'DISPATCHED')}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-950 transition"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Dispatch Rescue Boat
                    </button>
                  )}

                  {selectedSos.status === 'DISPATCHED' && (
                    <button
                      onClick={() => onUpdateSosStatus(selectedSos.id, 'RESCUED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-950 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Evacuated & Safe
                    </button>
                  )}

                  {selectedSos.status === 'RESCUED' && (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-950 border border-emerald-900 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rescue Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
