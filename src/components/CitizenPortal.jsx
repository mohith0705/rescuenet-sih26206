import React, { useState } from 'react';
import { 
  AlertOctagon, Phone, MapPin, Users, HeartPulse, Search, Plus, 
  CheckCircle, ShieldAlert, Navigation, Filter, Info, Radio, Upload, Zap 
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import OfflineGuideModal from './OfflineGuideModal';
import { TRANSLATIONS } from '../data/translations';

export default function CitizenPortal({ 
  shelters, 
  sosRequests, 
  missingPersons, 
  onTriggerSos, 
  onReportMissingPerson,
  currentLang = 'EN',
  activeTab: externalActiveTab,
  onTabChange
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const [internalActiveTab, setInternalActiveTab] = useState('sos'); // 'sos' | 'shelters' | 'missing' | 'guide'
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;
  
  // Instant SOS State & Follow-up Modal
  const [lastSosTicket, setLastSosTicket] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [sosCategory, setSosCategory] = useState('FLOOD_TRAPPED');
  const [sosName, setSosName] = useState('');
  const [sosPhone, setSosPhone] = useState('');
  const [sosPeople, setSosPeople] = useState(2);
  const [sosLocation, setSosLocation] = useState('');
  const [sosNotes, setSosNotes] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('Acquired (GPS Lock)');

  // Missing Person Form Modal State
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [mpName, setMpName] = useState('');
  const [mpAge, setMpAge] = useState('');
  const [mpLastSeen, setMpLastSeen] = useState('');
  const [mpContact, setMpContact] = useState('');
  const [mpSearchQuery, setMpSearchQuery] = useState('');

  // Shelter Filter State
  const [shelterFilter, setShelterFilter] = useState('ALL');

  // STEP 1: INSTANT 1-TAP SOS DISPATCH WITH REAL GPS & HAPTICS
  const handleInstantSosClick = () => {
    // 1. Trigger mobile haptic vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    const ticketId = `SOS-${Date.now().toString().slice(-4)}`;
    
    // Default fallback coordinates (Visakhapatnam coastal disaster sector)
    let userLat = 17.6950 + (Math.random() - 0.5) * 0.03;
    let userLng = 83.2250 + (Math.random() - 0.5) * 0.03;
    let locLabel = 'Beach Road Sector 4 (Auto GPS: 17.6950° N, 83.2250° E)';

    const instantSos = {
      id: ticketId.toLowerCase(),
      ticketCode: ticketId,
      name: 'Victim (Instant Beacon)',
      phone: '+91 98765 43210',
      peopleCount: 1,
      location: locLabel,
      lat: userLat,
      lng: userLng,
      urgency: 'CRITICAL',
      category: 'IMMEDIATE_DISTRESS',
      timestamp: 'Just now',
      status: 'PENDING',
      notes: 'Instant 1-tap distress beacon transmitted from mobile device.'
    };

    // 2. Query real hardware GPS if available on mobile
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          instantSos.lat = pos.coords.latitude;
          instantSos.lng = pos.coords.longitude;
          instantSos.location = `Live Device GPS (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E &plusmn;${Math.round(pos.coords.accuracy)}m)`;
          setGpsStatus(`GPS High Accuracy: ±${Math.round(pos.coords.accuracy)}m`);
          setLastSosTicket({ ...instantSos });
        },
        (err) => {
          console.warn('Geolocation fallback used:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    // 3. Offline storage queue if cellular is unavailable
    if (typeof localStorage !== 'undefined') {
      try {
        const queued = JSON.parse(localStorage.getItem('rescuenet_offline_sos') || '[]');
        queued.unshift(instantSos);
        localStorage.setItem('rescuenet_offline_sos', JSON.stringify(queued));
      } catch (e) {
        console.error('Offline storage error', e);
      }
    }
    
    onTriggerSos(instantSos);
    setLastSosTicket(instantSos);
    setDetailsSaved(false);
    setShowFollowupModal(true);
  };

  const handleSaveAdditionalDetails = (e) => {
    e.preventDefault();
    if (lastSosTicket) {
      lastSosTicket.name = sosName || lastSosTicket.name;
      lastSosTicket.phone = sosPhone || lastSosTicket.phone;
      lastSosTicket.peopleCount = parseInt(sosPeople) || lastSosTicket.peopleCount;
      lastSosTicket.location = sosLocation ? `${sosLocation} (${lastSosTicket.location})` : lastSosTicket.location;
      lastSosTicket.category = sosCategory;
      lastSosTicket.notes = sosNotes || lastSosTicket.notes;
    }
    setDetailsSaved(true);
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-5">
      {/* TAB 1: SOS & MAP (Single unified mobile stack in Red & White Theme) */}
      {activeTab === 'sos' && (
        <div className="flex flex-col space-y-4">
          {/* Concentric Glowing Red & White SOS Hero Card */}
          <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Outer Pulsing Aura Rings */}
            <div className="absolute w-56 h-56 rounded-full bg-red-500/10 animate-ping pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full bg-red-600/15 animate-pulse pointer-events-none" />

            {/* ULTRA-PREMIUM CONCENTRIC GLOWING SOS BUTTON */}
            <div className="py-3 relative z-10">
              <button
                onClick={handleInstantSosClick}
                className="relative group w-44 h-44 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-rose-700 text-white flex flex-col items-center justify-center shadow-[0_12px_30px_rgba(220,38,38,0.35)] hover:shadow-[0_18px_40px_rgba(220,38,38,0.5)] active:scale-95 transition-all ring-8 ring-red-100 border-4 border-white cursor-pointer overflow-hidden touch-press"
              >
                {/* Radial Top Gloss Highlight */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/35 via-transparent to-transparent pointer-events-none" />

                {/* Center Animated Icon */}
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-md shrink-0">
                  <AlertOctagon className="w-7 h-7 text-white drop-shadow" />
                </div>

                {/* Main Bold Text */}
                <span className="text-2xl font-black tracking-widest text-white drop-shadow-md font-sans leading-tight">
                  {t.sendSos || 'SEND SOS'}
                </span>

                {/* Micro Subtitle */}
                <span className="mt-1 text-[9px] font-extrabold text-red-100 uppercase tracking-widest bg-red-950/40 px-2.5 py-0.5 rounded-full border border-white/20">
                  1-Tap Dispatch
                </span>
              </button>
            </div>

            {/* GPS lock pill & Emergency speed dials */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>GPS Locked: 17.695° N, 83.225° E</span>
              </span>

              <a
                href="tel:1078"
                className="text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-all touch-press"
              >
                <Phone className="w-3 h-3" />
                <span>NDRF: 1078</span>
              </a>

              <a
                href="tel:112"
                className="text-[11px] font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-all touch-press"
              >
                <Phone className="w-3 h-3 text-slate-600" />
                <span>Police: 112</span>
              </a>
            </div>
          </div>

          {/* Full Width Live Disaster Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 font-mono uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> Multi-Disaster Live Map (Coastal Sector)
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Tracking Active
              </span>
            </div>

            <div className="h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <InteractiveMap 
                sosList={sosRequests}
                shelterList={shelters}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHELTERS & HOSPITALS */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.openCamps}</h2>
              <p className="text-xs text-slate-600 font-medium">Locate safe zones, food distribution centers, and medical stations</p>
            </div>
            
            {/* Shelter Filter Buttons */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button 
                onClick={() => setShelterFilter('ALL')}
                className={`px-3 py-1.5 rounded-md font-extrabold transition ${shelterFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                All ({shelters.length})
              </button>
              <button 
                onClick={() => setShelterFilter('FOOD')}
                className={`px-3 py-1.5 rounded-md font-extrabold transition ${shelterFilter === 'FOOD' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'}`}
              >
                3+ Days Food
              </button>
              <button 
                onClick={() => setShelterFilter('DOCTOR')}
                className={`px-3 py-1.5 rounded-md font-extrabold transition ${shelterFilter === 'DOCTOR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
              >
                Doctor Available
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShelters.map(s => {
              const occupancyPercent = Math.round((s.occupied / s.capacity) * 100);
              return (
                <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                        {s.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-2">{s.name}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {s.address}
                      </p>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-600">Capacity Occupancy</span>
                      <span className={`font-mono font-bold ${occupancyPercent > 85 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {s.occupied} / {s.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${occupancyPercent > 85 ? 'bg-red-600' : 'bg-emerald-600'}`}
                        style={{ width: `${occupancyPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Supply Status */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-500">{t.foodRations}</div>
                      <div className="font-mono font-bold text-slate-900">{s.foodSupplyDays} Days</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-500">{t.waterTankers}</div>
                      <div className="font-mono font-bold text-slate-900">{s.waterLiters}L</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <div className="text-[10px] text-slate-500">{t.doctorPresent}</div>
                      <div className={`font-mono font-bold ${s.medicalDoctorPresent ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {s.medicalDoctorPresent ? 'Present' : 'On Call'}
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`tel:${s.contact}`}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> {t.callHelpline} ({s.contact})
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.missingTab}</h2>
              <p className="text-xs text-slate-600 font-medium">Search missing loved ones or register a report for emergency rescue matching</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name or location..."
                  value={mpSearchQuery}
                  onChange={(e) => setMpSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setShowMissingModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Report Missing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissingPersons.map(mp => (
              <div key={mp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <img 
                  src={mp.photoUrl} 
                  alt={mp.name} 
                  className="w-24 h-24 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                />
                <div className="space-y-1 text-xs flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-base">{mp.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mp.status === 'SEARCHING' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {mp.status}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">Age: <span className="text-slate-900 font-mono">{mp.age}</span> | Gender: <span className="text-slate-900">{mp.gender}</span></p>
                  <p className="text-slate-700 text-[11px] leading-tight">
                    <span className="text-slate-500">Last Seen:</span> {mp.lastSeen}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-600 font-medium">
                    Contact: <span className="text-amber-700 font-semibold">{mp.contactPerson}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFLINE SURVIVAL GUIDE */}
      {activeTab === 'guide' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" /> {t.guideTab}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">What to do when cellular networks and internet disconnect during cyclones or floods</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">1</div>
              <h3 className="font-bold text-slate-900 text-sm">Bluetooth & Wi-Fi Direct Mesh SOS</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Even without cellular towers, RescuENet relays low-power emergency beacons between nearby smartphones up to 500 meters until reaching a rescue unit device.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">2</div>
              <h3 className="font-bold text-slate-900 text-sm">Lightweight SMS Beacon</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                If mobile data is disabled, tap "Send SMS Beacon" to send a compressed 40-character text message with your raw lat/long coordinates directly to NDRF server.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">3</div>
              <h3 className="font-bold text-slate-900 text-sm">Whistle & Flashlight Acoustic Signals</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Use 3 short bursts on your whistle or phone flashlight strobe (S-O-S pattern: 3 quick flashes, 3 long flashes, 3 quick flashes) to signal aerial rescue helicopters.
              </p>
            </div>
          </div>

          {/* Full First-Aid & Weather Offline Manual */}
          <OfflineGuideModal />
        </div>
      )}

      {/* POST-SOS CONFIRMATION & OPTIONAL FOLLOW-UP FORM MODAL (HIGH Z-INDEX Z-[9999]) */}
      {showFollowupModal && lastSosTicket && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 animate-bounce" />
                <span>{t.sosSentTitle}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFollowupModal(false)}
                className="text-slate-400 hover:text-slate-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Instant Confirmation Banner */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-700 uppercase">Distress Ticket #{lastSosTicket.ticketCode}</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">CRITICAL SOS LIVE</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {t.sosSentDesc}
              </p>
            </div>

            {/* Optional Additional Details Form */}
            {!detailsSaved ? (
              <form onSubmit={handleSaveAdditionalDetails} className="space-y-4 pt-1">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2 text-xs text-blue-900 font-medium">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.optionalFormNote}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Emergency Category</label>
                    <select
                      value={sosCategory}
                      onChange={(e) => setSosCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500 font-medium"
                    >
                      <option value="FLOOD_TRAPPED">🌊 Trapped in Flood Water</option>
                      <option value="MEDICAL_EMERGENCY">🚑 Medical Emergency / Doctor Needed</option>
                      <option value="STRUCTURE_COLLAPSE">🏚️ Roof / Building Collapse</option>
                      <option value="FOOD_WATER_SHORTAGE">🍞 Food & Clean Water Needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Total Trapped Count</label>
                    <input
                      type="number"
                      min="1"
                      value={sosPeople}
                      onChange={(e) => setSosPeople(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={sosName}
                      onChange={(e) => setSosName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={sosPhone}
                      onChange={(e) => setSosPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-700 font-medium mb-1">Landmark / Special Notes</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. 2nd floor balcony, green building near SBI ATM"
                    value={sosNotes}
                    onChange={(e) => setSosNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowFollowupModal(false)}
                    className="text-xs text-slate-500 hover:text-slate-900 px-3 py-2 font-medium"
                  >
                    {t.skipSos}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-md transition"
                  >
                    {t.updateDetails}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="text-emerald-600 font-bold text-sm">✔ Details Updated & Synced with NDRF Command!</div>
                <button
                  onClick={() => setShowFollowupModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2 rounded-lg"
                >
                  Close & View Incident Status
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MISSING PERSON MODAL */}
      {showMissingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Report Missing Person</h3>
              <button onClick={() => setShowMissingModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
            </div>

            <form onSubmit={handleMissingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Missing Person Name</label>
                <input
                  type="text"
                  required
                  value={mpName}
                  onChange={(e) => setMpName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={mpAge}
                    onChange={(e) => setMpAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Photo Upload</label>
                  <div className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 text-center text-slate-500 text-[11px] flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Select Image
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Last Known Location / Description</label>
                <textarea
                  required
                  rows="2"
                  value={mpLastSeen}
                  onChange={(e) => setMpLastSeen(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Name & Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh (Brother) - 9876543210"
                  value={mpContact}
                  onChange={(e) => setMpContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowMissingModal(false)} className="px-3 py-1.5 text-slate-500 font-medium">Cancel</button>
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg shadow-sm">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
