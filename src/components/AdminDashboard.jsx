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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
      {/* Top Executive KPI Grid (Full 4-Column Command Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Overall Shelter Occupancy</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalOccupied} / {totalCapacity}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.round((totalOccupied/totalCapacity)*100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Unresolved SOS Calls</span>
            <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono">
            {activeSosCount} Active Calls
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {sosRequests.filter(s => s.urgency === 'CRITICAL').length} Critical Priority
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>NDRF Deployment Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono">
            {rescueTeams.filter(t => t.status === 'ON_MISSION').length} / {rescueTeams.length} Teams
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {rescueTeams.reduce((acc, t) => acc + t.personnel, 0)} On-field Personnel
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Mass Alerts Broadcasted</span>
            <Radio className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            {broadcasts.length} Sent
          </div>
          <div className="text-[11px] text-slate-500 font-mono truncate">
            Last: {broadcasts[0]?.title || 'None'}
          </div>
        </div>
      </div>

      {/* LIVE SOS INCIDENT COMMAND TABLE */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" /> Live Incoming SOS Distress Signals (Admin Monitor)
            </h3>
            <p className="text-xs text-slate-500">Real-time incoming distress tickets from citizen mobile devices</p>
          </div>
          <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full font-mono font-bold">
            ● Live Stream Syncing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
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
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {sosRequests.map(sos => (
                <tr key={sos.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-red-600">#{sos.id}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                      sos.urgency === 'CRITICAL' ? 'bg-red-600' : (sos.urgency === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600')
                    }`}>
                      {sos.urgency}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{sos.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{sos.phone}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-slate-700 max-w-[200px] truncate">
                      <MapPin className="w-3 h-3 text-red-600 shrink-0" /> {sos.location}
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-700">{sos.peopleCount} Persons</td>
                  <td className="p-3">
                    <span className={`font-mono font-semibold text-[11px] ${
                      sos.status === 'PENDING' ? 'text-red-600' : (sos.status === 'DISPATCHED' ? 'text-blue-600' : 'text-emerald-600')
                    }`}>
                      ● {sos.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500">
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
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-600" /> Mass Alert Broadcast Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Send instant push notification alerts to citizens in target zones</p>
          </div>

          {bcSentSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2 font-bold animate-pulse">
              <PackageCheck className="w-4 h-4 text-emerald-600" /> Broadcast Alert Transmitted Successfully!
            </div>
          )}

          <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Alert Severity Level</label>
              <select
                value={bcLevel}
                onChange={(e) => setBcLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500 font-medium"
              >
                <option value="RED_ALERT">🚨 RED ALERT (Immediate Evacuation)</option>
                <option value="EVACUATION">⚠️ EVACUATION ADVISORY</option>
                <option value="WEATHER_ADVISORY">ℹ️ WEATHER / RATION ADVISORY</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Target Sector / Pin Codes</label>
              <input
                type="text"
                required
                placeholder="e.g. Coastal Sector 1, 2, 4"
                value={bcArea}
                onChange={(e) => setBcArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Alert Heading / Title</label>
              <input
                type="text"
                required
                placeholder="e.g. High Tide Surge Warning"
                value={bcTitle}
                onChange={(e) => setBcTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Detailed Message Instructions</label>
              <textarea
                rows="3"
                required
                placeholder="Clear instructions for citizens..."
                value={bcMessage}
                onChange={(e) => setBcMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" /> TRANSMIT EMERGENCY BROADCAST
            </button>
          </form>
        </div>

        {/* Module 2: Shelter Supply & Logistics Manager */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" /> Shelter Logistics & Ration Allocation
                </h3>
                <p className="text-xs text-slate-500">Monitor and update food, water, and medical inventory across camps</p>
              </div>
            </div>

            <div className="space-y-3">
              {shelters.map(shelter => (
                <div key={shelter.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{shelter.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{shelter.address}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        {shelter.occupied} / {shelter.capacity} Occupied
                      </span>
                    </div>
                  </div>

                  {/* Ration Control Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 text-xs">
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" /> Food Rations:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{shelter.foodSupplyDays} Days</span>
                        <button 
                          onClick={() => onUpdateShelterSupply(shelter.id, 'foodSupplyDays', shelter.foodSupplyDays + 1)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-1.5 py-0.5 rounded text-xs font-bold"
                        >
                          +1d
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" /> Water Tankers:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{shelter.waterLiters}L</span>
                        <button 
                          onClick={() => onUpdateShelterSupply(shelter.id, 'waterLiters', shelter.waterLiters + 500)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-1.5 py-0.5 rounded text-xs font-bold"
                        >
                          +500L
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <HeartPulse className="w-3.5 h-3.5 text-red-600" /> Medical Doctor:
                      </span>
                      <button 
                        onClick={() => onUpdateShelterSupply(shelter.id, 'medicalDoctorPresent', !shelter.medicalDoctorPresent)}
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          shelter.medicalDoctorPresent ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
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
