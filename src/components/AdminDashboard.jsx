import React, { useState } from 'react';
import { 
  Building2, Users, AlertTriangle, ShieldCheck, Send, Radio, 
  PackageCheck, Truck, Droplets, Utensils, HeartPulse, Activity, Plus, MapPin, Clock 
} from 'lucide-react';

export default function AdminDashboard({ 
  shelters, 
  sosRequests, 
  rescueTeams, 
  broadcasts, 
  onSendBroadcast,
  onUpdateShelterSupply
}) {
  const [bcLevel, setBcLevel] = useState('RED_ALERT');
  const [bcTitle, setBcTitle] = useState('');
  const [bcArea, setBcArea] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcSentSuccess, setBcSentSuccess] = useState(false);

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.occupied, 0);
  const activeSosCount = sosRequests.filter(s => s.status !== 'RESCUED').length;

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    const newBroadcast = {
      id: `bc-${Date.now().toString().slice(-4)}`,
      level: bcLevel,
      title: bcTitle || 'EMERGENCY DISASTER NOTICE',
      message: bcMessage,
      targetArea: bcArea || 'All Coastal Sectors',
      timestamp: 'Just now'
    };
    onSendBroadcast(newBroadcast);
    setBcSentSuccess(true);
    setBcTitle('');
    setBcArea('');
    setBcMessage('');
    setTimeout(() => setBcSentSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Overall Shelter Occupancy</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalOccupied} / {totalCapacity}
          </div>
          <div className="w-full bg-[#070b14] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.round((totalOccupied/totalCapacity)*100)}%` }}></div>
          </div>
        </div>

        <div className="bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Unresolved SOS Calls</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            {activeSosCount} Active Calls
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {sosRequests.filter(s => s.urgency === 'CRITICAL').length} Critical Priority
          </div>
        </div>

        <div className="bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>NDRF Deployment Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400 font-mono">
            {rescueTeams.filter(t => t.status === 'ON_MISSION').length} / {rescueTeams.length} Teams
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {rescueTeams.reduce((acc, t) => acc + t.personnel, 0)} On-field Personnel
          </div>
        </div>

        <div className="bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Mass Alerts Broadcasted</span>
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {broadcasts.length} Sent
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            Last: {broadcasts[0]?.title || 'None'}
          </div>
        </div>
      </div>

      {/* LIVE SOS INCIDENT COMMAND TABLE */}
      <div className="bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1e2a45] pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" /> Live Incoming SOS Distress Signals (Admin Monitor)
            </h3>
            <p className="text-xs text-slate-400">Real-time incoming distress tickets from citizen mobile devices</p>
          </div>
          <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-full font-mono font-bold">
            ● Live Stream Syncing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070b14] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Urgency</th>
                <th className="p-3">Citizen Name / Phone</th>
                <th className="p-3">GPS Location</th>
                <th className="p-3">Trapped Count</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a45] text-slate-200">
              {sosRequests.map(sos => (
                <tr key={sos.id} className="hover:bg-[#1a253f]/60 transition">
                  <td className="p-3 font-mono font-bold text-rose-400">#{sos.id}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                      sos.urgency === 'CRITICAL' ? 'bg-rose-600' : (sos.urgency === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600')
                    }`}>
                      {sos.urgency}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{sos.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{sos.phone}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-slate-300 max-w-[200px] truncate">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {sos.location}
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-400">{sos.peopleCount} Persons</td>
                  <td className="p-3">
                    <span className={`font-mono font-semibold text-[11px] ${
                      sos.status === 'PENDING' ? 'text-rose-400' : (sos.status === 'DISPATCHED' ? 'text-blue-400' : 'text-emerald-400')
                    }`}>
                      ● {sos.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {sos.assignedTeam || 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Admin Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Mass Warning Broadcast Sender */}
        <div className="lg:col-span-1 bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-4 shadow-xl">
          <div className="border-b border-[#1e2a45] pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500" /> Mass Alert Broadcast Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Send instant push notification alerts to citizens in target zones</p>
          </div>

          {bcSentSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs p-3 rounded-lg flex items-center gap-2 font-bold animate-pulse">
              <PackageCheck className="w-4 h-4 text-emerald-400" /> Broadcast Alert Transmitted Successfully!
            </div>
          )}

          <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Alert Severity Level</label>
              <select
                value={bcLevel}
                onChange={(e) => setBcLevel(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e2a45] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="RED_ALERT">🚨 RED ALERT (Immediate Evacuation)</option>
                <option value="EVACUATION">⚠️ EVACUATION ADVISORY</option>
                <option value="WEATHER_ADVISORY">ℹ️ WEATHER / RATION ADVISORY</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Sector / Pin Codes</label>
              <input
                type="text"
                required
                placeholder="e.g. Coastal Sector 1, 2, 4"
                value={bcArea}
                onChange={(e) => setBcArea(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e2a45] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Alert Heading / Title</label>
              <input
                type="text"
                required
                placeholder="e.g. High Tide Surge Warning"
                value={bcTitle}
                onChange={(e) => setBcTitle(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e2a45] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Detailed Message Instructions</label>
              <textarea
                rows="3"
                required
                placeholder="Clear instructions for citizens..."
                value={bcMessage}
                onChange={(e) => setBcMessage(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e2a45] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-rose-950 transition"
            >
              <Send className="w-4 h-4" /> TRANSMIT EMERGENCY BROADCAST
            </button>
          </form>
        </div>

        {/* Module 2: Shelter Supply & Logistics Manager */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#131b2e] p-5 rounded-xl border border-[#1e2a45] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1e2a45] pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" /> Shelter Logistics & Ration Allocation
                </h3>
                <p className="text-xs text-slate-400">Monitor and update food, water, and medical inventory across camps</p>
              </div>
            </div>

            <div className="space-y-3">
              {shelters.map(shelter => (
                <div key={shelter.id} className="bg-[#070b14] p-4 rounded-xl border border-[#1e2a45] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{shelter.name}</h4>
                      <p className="text-xs text-slate-400">{shelter.address}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {shelter.occupied} / {shelter.capacity} Occupied
                      </span>
                    </div>
                  </div>

                  {/* Ration Control Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1e2a45] text-xs">
                    <div className="flex items-center justify-between bg-[#131b2e] p-2 rounded border border-[#1e2a45]">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" /> Food Rations:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{shelter.foodSupplyDays} Days</span>
                        <button 
                          onClick={() => onUpdateShelterSupply(shelter.id, 'foodSupplyDays', shelter.foodSupplyDays + 1)}
                          className="bg-[#1e2a45] hover:bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded text-xs"
                        >
                          +1d
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#131b2e] p-2 rounded border border-[#1e2a45]">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Tankers:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{shelter.waterLiters}L</span>
                        <button 
                          onClick={() => onUpdateShelterSupply(shelter.id, 'waterLiters', shelter.waterLiters + 500)}
                          className="bg-[#1e2a45] hover:bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded text-xs"
                        >
                          +500L
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#131b2e] p-2 rounded border border-[#1e2a45]">
                      <span className="flex items-center gap-1 text-slate-300">
                        <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Medical Doctor:
                      </span>
                      <button 
                        onClick={() => onUpdateShelterSupply(shelter.id, 'medicalDoctorPresent', !shelter.medicalDoctorPresent)}
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          shelter.medicalDoctorPresent ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {shelter.medicalDoctorPresent ? 'Doctor Present' : 'Request Doctor'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
