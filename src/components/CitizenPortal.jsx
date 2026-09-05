import React, { useState } from 'react';
import { 
  AlertOctagon, Phone, MapPin, Users, HeartPulse, Search, Plus, 
  CheckCircle, ShieldAlert, Navigation, Filter, Info, Radio, Upload 
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

export default function CitizenPortal({ 
  shelters, 
  sosRequests, 
  missingPersons, 
  onTriggerSos, 
  onReportMissingPerson 
}) {
  const [activeTab, setActiveTab] = useState('sos'); // 'sos' | 'shelters' | 'missing' | 'guide'
  
  // SOS Form Modal State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosCategory, setSosCategory] = useState('FLOOD_TRAPPED');
  const [sosName, setSosName] = useState('');
  const [sosPhone, setSosPhone] = useState('');
  const [sosPeople, setSosPeople] = useState(2);
  const [sosLocation, setSosLocation] = useState('');
  const [sosNotes, setSosNotes] = useState('');
  const [sosSubmitted, setSosSubmitted] = useState(false);

  // Missing Person Form Modal State
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [mpName, setMpName] = useState('');
  const [mpAge, setMpAge] = useState('');
  const [mpLastSeen, setMpLastSeen] = useState('');
  const [mpContact, setMpContact] = useState('');
  const [mpSearchQuery, setMpSearchQuery] = useState('');

  // Shelter Filter State
  const [shelterFilter, setShelterFilter] = useState('ALL');

  const handleSosSubmit = (e) => {
    e.preventDefault();
    const newSos = {
      id: `sos-${Date.now().toString().slice(-4)}`,
      name: sosName || 'Anonymous Citizen',
      phone: sosPhone || '+91 99999 00000',
      peopleCount: parseInt(sosPeople) || 1,
      location: sosLocation || 'Near Beach Road Sector 3 (GPS Auto-detected)',
      lat: 17.6950 + (Math.random() - 0.5) * 0.04,
      lng: 83.2250 + (Math.random() - 0.5) * 0.04,
      urgency: sosCategory === 'MEDICAL_EMERGENCY' || sosCategory === 'FLOOD_TRAPPED' ? 'CRITICAL' : 'HIGH',
      category: sosCategory,
      timestamp: 'Just now',
      status: 'PENDING',
      notes: sosNotes
    };
    onTriggerSos(newSos);
    setSosSubmitted(true);
  };

  const handleMissingSubmit = (e) => {
    e.preventDefault();
    const newMp = {
      id: `mp-${Date.now().toString().slice(-4)}`,
      name: mpName,
      age: parseInt(mpAge) || 25,
      gender: 'Unspecified',
      lastSeen: mpLastSeen,
      reportDate: 'Today',
      contactPerson: mpContact,
      status: 'SEARCHING',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
    };
    onReportMissingPerson(newMp);
    setShowMissingModal(false);
    setMpName('');
    setMpAge('');
    setMpLastSeen('');
    setMpContact('');
  };

  const filteredShelters = shelters.filter(s => {
    if (shelterFilter === 'FOOD') return s.foodSupplyDays >= 3;
    if (shelterFilter === 'DOCTOR') return s.medicalDoctorPresent;
    if (shelterFilter === 'AVAILABLE') return s.occupied < s.capacity;
    return true;
  });

  const filteredMissingPersons = missingPersons.filter(mp => 
    mp.name.toLowerCase().includes(mpSearchQuery.toLowerCase()) ||
    mp.lastSeen.toLowerCase().includes(mpSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Sub Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sos' 
                ? 'bg-red-600/20 text-red-400 border border-red-500/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <span>Emergency SOS & Map</span>
          </button>

          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'shelters' 
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Relief Shelters ({shelters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'missing' 
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Missing Persons Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'guide' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-blue-400" />
            <span>Offline Survival Guide</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SOS & MAP */}
      {activeTab === 'sos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SOS Trigger Hero Card */}
          <div className="lg:col-span-1 bg-gradient-to-b from-red-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-red-900/40 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" /> Immediate Crisis Response
              </div>
              <h2 className="text-2xl font-extrabold text-white">Trapped or Need Evacuation?</h2>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                Press the Emergency SOS button below to transmit your instant GPS signal directly to NDRF rescue teams and control room.
              </p>
            </div>

            {/* Huge Pulse SOS Button */}
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={() => { setShowSosModal(true); setSosSubmitted(false); }}
                className="relative group w-40 h-40 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 text-white flex flex-col items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-transform"
              >
                <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30"></span>
                <AlertOctagon className="w-14 h-14 mb-1 group-hover:rotate-12 transition-transform" />
                <span className="text-xl font-black tracking-wider">SEND SOS</span>
                <span className="text-[10px] font-mono text-red-200 uppercase mt-0.5">1-Tap Evac Alert</span>
              </button>
            </div>

            {/* Quick Emergency Contacts */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 mb-1">Direct Disaster Toll-Free:</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <a href="tel:1078" className="bg-red-950/60 border border-red-900/60 p-2 rounded text-red-300 hover:bg-red-900/60 text-center flex items-center justify-center gap-1 font-bold">
                  <Phone className="w-3 h-3" /> NDRF: 1078
                </a>
                <a href="tel:112" className="bg-slate-900 border border-slate-700 p-2 rounded text-slate-200 hover:bg-slate-800 text-center flex items-center justify-center gap-1 font-bold">
                  <Phone className="w-3 h-3" /> Police: 112
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" /> Live Disaster Map (Coastal Sector)
                </h3>
                <p className="text-xs text-slate-400">Real-time distress signals & open relief shelters</p>
              </div>
              <div className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-2.5 py-1 rounded-full font-mono">
                ● Live GPS Tracking Active
              </div>
            </div>

            <InteractiveMap 
              sosList={sosRequests}
              shelterList={shelters}
            />
          </div>
        </div>
      )}

      {/* TAB 2: SHELTERS & HOSPITALS */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Open Relief Camps & Shelters</h2>
              <p className="text-xs text-slate-400">Locate safe zones, food distribution centers, and medical stations</p>
            </div>
            
            {/* Shelter Filter Buttons */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button 
                onClick={() => setShelterFilter('ALL')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${shelterFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                All ({shelters.length})
              </button>
              <button 
                onClick={() => setShelterFilter('FOOD')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${shelterFilter === 'FOOD' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                3+ Days Food
              </button>
              <button 
                onClick={() => setShelterFilter('DOCTOR')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${shelterFilter === 'DOCTOR' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Doctor Available
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShelters.map(s => {
              const occupancyPercent = Math.round((s.occupied / s.capacity) * 100);
              return (
                <div key={s.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                        {s.type}
                      </span>
                      <h3 className="font-bold text-white text-base mt-2">{s.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> {s.address}
                      </p>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Capacity Occupancy</span>
                      <span className={`font-mono font-bold ${occupancyPercent > 85 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {s.occupied} / {s.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${occupancyPercent > 85 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${occupancyPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Supply Status */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Food Rations</div>
                      <div className="font-mono font-bold text-slate-200">{s.foodSupplyDays} Days</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Water Tanker</div>
                      <div className="font-mono font-bold text-slate-200">{s.waterLiters}L</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Medical Doctor</div>
                      <div className={`font-mono font-bold ${s.medicalDoctorPresent ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {s.medicalDoctorPresent ? 'Present' : 'On Call'}
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`tel:${s.contact}`}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Shelter Helpline ({s.contact})
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MISSING PERSONS */}
      {activeTab === 'missing' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Missing Persons Registry & Search</h2>
              <p className="text-xs text-slate-400">Search missing loved ones or register a report for emergency rescue matching</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name or location..."
                  value={mpSearchQuery}
                  onChange={(e) => setMpSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setShowMissingModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
              >
                <Plus className="w-4 h-4" /> Report Missing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissingPersons.map(mp => (
              <div key={mp.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-4">
                <img 
                  src={mp.photoUrl} 
                  alt={mp.name} 
                  className="w-24 h-24 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                />
                <div className="space-y-1 text-xs flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-base">{mp.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mp.status === 'SEARCHING' ? 'bg-amber-950 text-amber-400 border border-amber-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                    }`}>
                      {mp.status}
                    </span>
                  </div>
                  <p className="text-slate-400">Age: <span className="text-white font-mono">{mp.age}</span> | Gender: <span className="text-white">{mp.gender}</span></p>
                  <p className="text-slate-300 text-[11px] leading-tight">
                    <span className="text-slate-500">Last Seen:</span> {mp.lastSeen}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    Contact: <span className="text-amber-400 font-semibold">{mp.contactPerson}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFLINE SURVIVAL GUIDE */}
      {activeTab === 'guide' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400" /> Offline & Low-Bandwidth Survival Instructions
            </h2>
            <p className="text-xs text-slate-400 mt-1">What to do when cellular networks and internet disconnect during cyclones or floods</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-400 font-bold">1</div>
              <h3 className="font-bold text-white text-sm">Bluetooth & Wi-Fi Direct Mesh SOS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Even without cellular towers, RescuENet relays low-power emergency beacons between nearby smartphones up to 500 meters until reaching a rescue unit device.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-900 flex items-center justify-center text-amber-400 font-bold">2</div>
              <h3 className="font-bold text-white text-sm">Lightweight SMS Beacon</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If mobile data is disabled, tap "Send SMS Beacon" to send a compressed 40-character text message with your raw lat/long coordinates directly to NDRF server.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-900 flex items-center justify-center text-emerald-400 font-bold">3</div>
              <h3 className="font-bold text-white text-sm">Whistle & Flashlight Acoustic Signals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use 3 short bursts on your whistle or phone flashlight strobe (S-O-S pattern: 3 quick flashes, 3 long flashes, 3 quick flashes) to signal aerial rescue helicopters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SOS DISPATCH MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            {!sosSubmitted ? (
              <form onSubmit={handleSosSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-base">
                    <AlertOctagon className="w-5 h-5" /> Emergency SOS Dispatch Form
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowSosModal(false)}
                    className="text-slate-500 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Category</label>
                  <select
                    value={sosCategory}
                    onChange={(e) => setSosCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="FLOOD_TRAPPED">🌊 Trapped in Flood / High Water Level</option>
                    <option value="MEDICAL_EMERGENCY">🚑 Urgent Medical Trauma / Doctor Needed</option>
                    <option value="STRUCTURE_COLLAPSE">🏚️ Building / Roof Collapse Danger</option>
                    <option value="FOOD_WATER_SHORTAGE">🍞 Food & Clean Drinking Water Shortage</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={sosName}
                      onChange={(e) => setSosName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={sosPhone}
                      onChange={(e) => setSosPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Total People Trapped</label>
                    <input
                      type="number"
                      min="1"
                      value={sosPeople}
                      onChange={(e) => setSosPeople(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GPS Coordinates</label>
                    <input
                      type="text"
                      disabled
                      value="17.6950 N, 83.2250 E (Auto-detected)"
                      className="w-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 rounded-lg p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location Details / Landmark</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Floor, Green Roof House, near SBI ATM"
                    value={sosLocation}
                    onChange={(e) => setSosLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Special Emergency Notes (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. 1 infant present, low phone battery (12%)"
                    value={sosNotes}
                    onChange={(e) => setSosNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSosModal(false)}
                    className="text-xs text-slate-400 hover:text-white px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-lg shadow-red-950 transition"
                  >
                    BROADCAST SOS ALERT NOW
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-red-950 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Emergency SOS Broadcast Active!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your location and distress ticket <span className="font-mono text-red-400 font-bold">#SOS-{Date.now().toString().slice(-4)}</span> has been transmitted to NDRF Command and nearby rescue boats.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl text-left border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="text-emerald-400">✔ Beacon Signal: Live Transmitted</div>
                  <div className="text-slate-400">✔ Assigned Sector: Coastal Command 4</div>
                  <div className="text-amber-400">⌛ Estimated Rescue Dispatch: &lt; 15 Mins</div>
                </div>
                <button
                  onClick={() => setShowSosModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-2 rounded-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MISSING PERSON MODAL */}
      {showMissingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Report Missing Person</h3>
              <button onClick={() => setShowMissingModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleMissingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Missing Person Name</label>
                <input
                  type="text"
                  required
                  value={mpName}
                  onChange={(e) => setMpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={mpAge}
                    onChange={(e) => setMpAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Photo Upload</label>
                  <div className="w-full bg-slate-950 border border-dashed border-slate-700 rounded-lg p-2 text-center text-slate-400 text-[11px] flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Select Image
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Last Known Location / Description</label>
                <textarea
                  required
                  rows="2"
                  value={mpLastSeen}
                  onChange={(e) => setMpLastSeen(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Name & Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh (Brother) - 9876543210"
                  value={mpContact}
                  onChange={(e) => setMpContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowMissingModal(false)} className="px-3 py-1.5 text-slate-400">Cancel</button>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
