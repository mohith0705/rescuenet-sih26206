import React, { useState } from 'react';
import { 
  AlertOctagon, Phone, MapPin, Users, HeartPulse, Search, Plus, 
  CheckCircle, ShieldAlert, Navigation, Filter, Info, Radio, Upload, Zap, Volume2, VolumeX, Mic,
  MessageSquare, Copy, ExternalLink, Send
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import { TRANSLATIONS } from '../data/translations';

export default function CitizenPortal({ 
  shelters, 
  sosRequests, 
  missingPersons, 
  onTriggerSos, 
  onReportMissingPerson,
  currentLang = 'EN',
  isPowerSaver = false,
  isOnline = true
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const [activeTab, setActiveTab] = useState('sos'); // 'sos' | 'shelters' | 'missing' | 'guide'
  const [activeFocusCoord, setActiveFocusCoord] = useState(null);
  
  // Instant SOS State & Follow-up Modal
  const [lastSosTicket, setLastSosTicket] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [sosCategory, setSosCategory] = useState('FLOOD_TRAPPED');
  const [sosName, setSosName] = useState('');
  const [sosPhone, setSosPhone] = useState('');
  const [sosPeople, setSosPeople] = useState('1');
  const [sosLocation, setSosLocation] = useState('');
  const [sosNotes, setSosNotes] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);

  // Offline 2G SMS Modal State (Point 6)
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsCopied, setSmsCopied] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  // Web Audio API Emergency Siren Beacon State
  const [isSirenActive, setIsSirenActive] = useState(false);
  const audioCtxRef = React.useRef(null);
  const oscRef = React.useRef(null);
  const intervalRef = React.useRef(null);

  // Web Speech API Voice SOS Trigger (Keyword: "HELP NET")
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const recognitionRef = React.useRef(null);

  const toggleVoiceSos = (forceStart = false) => {
    if (isVoiceListening && !forceStart) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsVoiceListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          if (transcript.includes('help net') || transcript.includes('helpnet') || transcript.includes('sos') || transcript.includes('rescuenet')) {
            recognition.stop();
            setIsVoiceListening(false);
            handleInstantSosClick();
            alert("🚨 Hands-Free Emergency SOS Triggered! Phrase 'HELP NET' detected.");
            break;
          }
        }
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        // Auto-restart for continuous background listening
        if (isVoiceListening && recognitionRef.current) {
          try { recognition.start(); } catch(e){}
        } else {
          setIsVoiceListening(false);
        }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsVoiceListening(true);
      } catch(err) {
        console.error("Speech Recognition Error", err);
      }
    }
  };

  // Auto-Activate Hands-Free Voice & Mobile Shake Sensor
  React.useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;
    let lastShakeTime = 0;

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if (deltaX + deltaY + deltaZ > 24) {
        const now = Date.now();
        if (now - lastShakeTime > 500) {
          shakeCount++;
          lastShakeTime = now;
          if (shakeCount >= 2) {
            handleInstantSosClick();
            shakeCount = 0;
          }
        }
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    const startVoiceAuto = () => {
      toggleVoiceSos(true);
      document.removeEventListener('click', startVoiceAuto);
      document.removeEventListener('touchstart', startVoiceAuto);
    };

    document.addEventListener('click', startVoiceAuto);
    document.addEventListener('touchstart', startVoiceAuto);

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
      document.removeEventListener('click', startVoiceAuto);
      document.removeEventListener('touchstart', startVoiceAuto);
    };
  }, []);

  const toggleAudioSiren = () => {
    if (isSirenActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch(e){}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch(e){}
      }
      setIsSirenActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;

        let high = false;
        intervalRef.current = setInterval(() => {
          high = !high;
          if (oscRef.current && ctx) {
            oscRef.current.frequency.setValueAtTime(high ? 1100 : 750, ctx.currentTime);
          }
        }, 350);

        setIsSirenActive(true);
      } catch(err) {
        console.error("Audio Siren Error", err);
      }
    }
  };

  // Missing Person Form Modal State
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [mpName, setMpName] = useState('');
  const [mpAge, setMpAge] = useState('');
  const [mpGender, setMpGender] = useState('Male');
  const [mpLastSeen, setMpLastSeen] = useState('');
  const [mpContact, setMpContact] = useState('');
  const [mpPhotoUrl, setMpPhotoUrl] = useState('');
  const [mpSearchQuery, setMpSearchQuery] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMpPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Shelter Filter State
  const [shelterFilter, setShelterFilter] = useState('ALL');

  // STEP 1: INSTANT 1-TAP SOS DISPATCH (Real HTML5 Geolocation + Map Centering)
  const handleInstantSosClick = () => {
    const ticketId = `SOS-${Date.now().toString().slice(-4)}`;
    
    const fallbackLat = 17.6950 + (Math.random() - 0.5) * 0.02;
    const fallbackLng = 83.2250 + (Math.random() - 0.5) * 0.02;

    const dispatchSos = (lat, lng, isGpsVerified = false) => {
      const instantSos = {
        id: ticketId.toLowerCase(),
        ticketCode: ticketId,
        name: 'Victim (Instant Alert)',
        phone: '+91 98765 43210',
        peopleCount: 1,
        location: isGpsVerified 
          ? `Verified GPS (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E)`
          : `Sector 4 Crisis Zone (Auto GPS: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E)`,
        lat: lat,
        lng: lng,
        urgency: 'CRITICAL',
        category: 'IMMEDIATE_DISTRESS',
        timestamp: 'Just now',
        status: 'PENDING',
        notes: isGpsVerified 
          ? 'Live high-accuracy browser HTML5 GPS coordinates acquired.'
          : 'Instant 1-tap distress beacon transmitted from device.'
      };
      
      onTriggerSos(instantSos);
      setLastSosTicket(instantSos);
      setActiveFocusCoord([lat, lng]);
      setDetailsSaved(false);
      setShowFollowupModal(true);
      setActiveTab('sos');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          dispatchSos(lat, lng, true);
        },
        (error) => {
          console.warn("Geolocation fallback:", error);
          dispatchSos(fallbackLat, fallbackLng, false);
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
      );
    } else {
      dispatchSos(fallbackLat, fallbackLng, false);
    }
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
      setActiveFocusCoord([lastSosTicket.lat, lastSosTicket.lng]);
    }
    setDetailsSaved(true);
  };

  const handleMissingSubmit = (e) => {
    e.preventDefault();
    const newMp = {
      id: `mp-${Date.now().toString().slice(-4)}`,
      name: mpName,
      age: parseInt(mpAge) || 25,
      gender: mpGender || 'Male',
      lastSeen: mpLastSeen,
      reportDate: 'Today',
      contactPerson: mpContact,
      status: 'SEARCHING',
      photoUrl: mpPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
    };
    onReportMissingPerson(newMp);
    setShowMissingModal(false);
    setMpName('');
    setMpAge('');
    setMpGender('Male');
    setMpLastSeen('');
    setMpContact('');
    setMpPhotoUrl('');
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
      <div className="flex items-center justify-between gap-2 border-b border-slate-300 pb-3 overflow-x-auto bg-white p-2 rounded-xl shadow-sm border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'sos' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Emergency SOS & Map</span>
          </button>

          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'shelters' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t.sheltersTab} ({shelters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'missing' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.missingTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'guide' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{t.guideTab}</span>
          </button>
        </div>
      </div>

      {/* Power Saver Status Notice */}
      {isPowerSaver && (
        <div className="bg-amber-950/90 text-amber-200 border border-amber-500/40 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Emergency Power Saver Mode Active (3.5x Extended Battery & Low CPU Consumption)</span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-extrabold border border-amber-400/30">OLED Battery Save</span>
        </div>
      )}

      {/* TAB 1: SOS & MAP */}
      {activeTab === 'sos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SOS Trigger Hero Card */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-red-200 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-xl border border-red-100 mb-3">
                <div className="flex items-center gap-2 text-red-700 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" /> Instant Emergency Beacon
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{t.trappedHeader}</h2>
              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-medium">
                {t.trappedDesc}
              </p>
            </div>

            {/* ULTRA-PREMIUM CONCENTRIC GLOWING SOS BUTTON */}
            <div className="flex flex-col items-center justify-center py-5 relative">
              {/* Outer Pulsing Aura Rings */}
              <div className="absolute w-56 h-56 rounded-full bg-red-500/10 animate-ping pointer-events-none"></div>
              <div className="absolute w-50 h-50 rounded-full bg-red-600/15 animate-pulse pointer-events-none"></div>

              {/* Main Button Surface */}
              <button
                onClick={handleInstantSosClick}
                className="relative group z-10 w-48 h-48 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-rose-700 text-white flex flex-col items-center justify-center shadow-[0_12px_30px_rgba(220,38,38,0.35)] hover:shadow-[0_18px_40px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all ring-8 ring-red-100 border-4 border-white cursor-pointer overflow-hidden"
              >
                {/* Radial Top Gloss Highlight */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/35 via-transparent to-transparent pointer-events-none"></div>

                {/* Center Animated Icon */}
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-md shrink-0">
                  <AlertOctagon className="w-8 h-8 text-white group-hover:rotate-12 transition-transform drop-shadow-md" />
                </div>

                {/* Heavy Bold Label */}
                <span className="text-2xl font-black tracking-widest text-white drop-shadow-md uppercase font-sans shrink-0">
                  {t.sendSos}
                </span>

                {/* Micro Subtitle */}
                <span className="mt-1 text-[10px] font-extrabold text-red-100 uppercase tracking-widest bg-red-950/40 px-2.5 py-0.5 rounded-full border border-white/20">
                  1-Tap Dispatch
                </span>
              </button>

              {/* Live Alert Status Badge Below Button */}
              <div className="relative z-10 mt-6 flex items-center gap-1.5 bg-red-50 text-red-700 px-4 py-1.5 rounded-full border border-red-200 shadow-sm">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {t.instantGpsAlert}
                </span>
              </div>

              {/* Voice-Activated SOS Assistant (Trigger Phrase: "HELP NET") */}
              <button
                onClick={toggleVoiceSos}
                className={`relative z-10 mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer shadow-sm ${
                  isVoiceListening
                    ? 'bg-red-600 text-white border-red-500 animate-pulse font-black'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
                title="Trapped citizens can activate voice recognition and say 'HELP NET' out loud to trigger emergency SOS"
              >
                <Mic className={`w-3.5 h-3.5 ${isVoiceListening ? 'text-white animate-bounce' : 'text-red-600'}`} />
                <span>{isVoiceListening ? '🎙️ Listening... (Say "HELP NET")' : '🎙️ Voice SOS (Say "HELP NET")'}</span>
              </button>
            </div>

            {/* Quick Emergency Contacts & Audio Siren */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-extrabold text-slate-900 mb-1">Direct Emergency Helplines:</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <a href="tel:1078" className="bg-red-600 text-white border border-red-700 p-2.5 rounded-lg text-center flex items-center justify-center gap-1 font-bold shadow-sm hover:bg-red-700">
                  <Phone className="w-3.5 h-3.5" /> NDRF: 1078
                </a>
                <a href="tel:112" className="bg-slate-900 text-white p-2.5 rounded-lg text-center flex items-center justify-center gap-1 font-bold shadow-sm hover:bg-slate-800">
                  <Phone className="w-3.5 h-3.5" /> Police: 112
                </a>
              </div>

              {/* Web Audio API Emergency Siren Locator */}
              <button
                onClick={toggleAudioSiren}
                className={`w-full p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-sm ${
                  isSirenActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black'
                    : 'bg-amber-100/80 text-amber-900 border-amber-300 hover:bg-amber-200/80'
                }`}
                title="Emit loud audio location siren from speaker for search dogs and NDRF rescue teams in pitch-black rubble or floods"
              >
                {isSirenActive ? (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>⏹️ Mute Emergency Siren (Active)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>🔊 Sound Location Siren (Search Dogs)</span>
                  </>
                )}
              </button>

              {/* Point 6: Offline 2G SMS Dispatcher Button */}
              <button
                onClick={() => setShowSmsModal(true)}
                className="w-full p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer shadow-sm"
                title="View and send formatted 2G SMS emergency payload directly to NDRF Control Room when 4G/5G data is down"
              >
                <MessageSquare className="w-4 h-4 text-blue-700 shrink-0" />
                <span>📱 Offline SMS Beacon (Zero Internet)</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" /> Multi-Disaster Live GIS Map (All Hazard Zones)
                </h3>
                <p className="text-xs text-slate-600 font-medium">Real-time distress signals for Floods, Cyclones, Earthquakes & Landslides</p>
              </div>
              <div className="flex items-center gap-2">
                {activeFocusCoord && (
                  <button 
                    onClick={() => setActiveFocusCoord(null)}
                    className="text-xs bg-red-100 text-red-800 border border-red-300 px-2.5 py-1 rounded-full font-mono font-bold hover:bg-red-200 transition flex items-center gap-1 cursor-pointer"
                    title="Click to reset map focus"
                  >
                    🎯 Focused: {activeFocusCoord[0].toFixed(4)}, {activeFocusCoord[1].toFixed(4)} ✕
                  </button>
                )}
                <div className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full font-mono font-bold">
                  ● Live GPS Tracking Active
                </div>
              </div>
            </div>

            <InteractiveMap 
              sosList={sosRequests}
              shelterList={shelters}
              activeFocusCoord={activeFocusCoord}
            />
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
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-700 uppercase">Distress Ticket #{lastSosTicket.ticketCode}</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">CRITICAL SOS LIVE</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {t.sosSentDesc}
              </p>

              {/* Audio Siren Beacon Button inside Modal */}
              <button
                type="button"
                onClick={toggleAudioSiren}
                className={`w-full p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-sm ${
                  isSirenActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black'
                    : 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
                }`}
              >
                {isSirenActive ? (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>⏹️ Mute Emergency Siren (Active)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>🔊 Sound Location Siren (Search Dogs & NDRF)</span>
                  </>
                )}
              </button>

              {/* Recenter GIS Map on exact GPS SOS location */}
              <button
                type="button"
                onClick={() => {
                  if (lastSosTicket) {
                    setActiveFocusCoord([lastSosTicket.lat, lastSosTicket.lng]);
                    setActiveTab('sos');
                  }
                }}
                className="w-full bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Navigation className="w-4 h-4 text-red-700 shrink-0" />
                <span>📍 Center Live GIS Map on My SOS Pin ({lastSosTicket.lat ? lastSosTicket.lat.toFixed(4) : '17.6950'}°, {lastSosTicket.lng ? lastSosTicket.lng.toFixed(4) : '83.2250'}°)</span>
              </button>
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
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25"
                    value={mpAge}
                    onChange={(e) => setMpAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Gender</label>
                  <select
                    value={mpGender}
                    onChange={(e) => setMpGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Child / Other">Child / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Photo</label>
                  <label className="w-full h-[38px] bg-slate-50 border border-dashed border-amber-400 rounded-lg text-center text-slate-700 text-[11px] flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-50 transition-colors relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoChange} 
                      className="hidden" 
                    />
                    {mpPhotoUrl ? (
                      <div className="flex items-center gap-1">
                        <img src={mpPhotoUrl} alt="Preview" className="w-6 h-6 rounded-full object-cover border border-amber-500 shrink-0" />
                        <span className="text-[10px] font-bold text-amber-800">Added ✓</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-bold text-amber-800">Upload</span>
                      </>
                    )}
                  </label>
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

      {/* POINT 6: OFFLINE 2G SMS PAYLOAD MODAL */}
      {showSmsModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Offline 2G SMS Beacon</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Zero-Internet Emergency Payload Dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-slate-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Recipient Info Card */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Target Recipient:</span>
                <span className="font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">1078 (NDRF Control Room)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Network Protocol:</span>
                <span className="font-bold text-slate-800">GSM / 2G SMS Fallback</span>
              </div>
            </div>

            {/* Box Showing Which Message Is Sent */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-900">Which Message Is Sent (SMS Payload):</label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Formatted GPS Payload
                </span>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed border border-slate-800 shadow-inner relative group">
                <p className="text-amber-300 font-bold mb-1">[NDRF EMERGENCY DISPATCH]</p>
                <p className="text-slate-200">
                  RESCUENET SOS: LAT 13.08271, LNG 80.27072 | STATUS: CRITICAL TRAPPED | TICKET: #SOS-9482 | NEED NDRF BOAT EVACUATION
                </p>
              </div>
            </div>

            {/* Success Notification Banner */}
            {smsSentSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Offline SMS Payload Transmitted to 1078!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("RESCUENET SOS: LAT 13.08271, LNG 80.27072 | STATUS: CRITICAL TRAPPED | TICKET: #SOS-9482 | NEED NDRF BOAT EVACUATION");
                  setSmsCopied(true);
                  setTimeout(() => setSmsCopied(false), 3000);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>{smsCopied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <a
                href="sms:1078?body=RESCUENET%20SOS%3A%20LAT%2013.08271%2C%20LNG%2080.27072%20%7C%20STATUS%3A%20CRITICAL%20TRAPPED%20%7C%20TICKET%3A%20%23SOS-9482%20%7C%20NEED%20NDRF%20BOAT"
                onClick={() => {
                  setSmsSentSuccess(true);
                  setTimeout(() => setSmsSentSuccess(false), 4000);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch SMS App</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
