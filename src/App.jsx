import React, { useState, useEffect } from 'react';
import MobileTopBar from './components/MobileTopBar';
import MobileBottomNav from './components/MobileBottomNav';
import RoleSwitcherModal from './components/RoleSwitcherModal';
import CitizenPortal from './components/CitizenPortal';
import RescuePortal from './components/RescuePortal';
import AdminDashboard from './components/AdminDashboard';
import { 
  INITIAL_SHELTERS, 
  INITIAL_SOS_REQUESTS, 
  INITIAL_RESCUE_TEAMS, 
  INITIAL_MISSING_PERSONS, 
  INITIAL_BROADCASTS 
} from './data/mockData';
import { Smartphone, Monitor, ChevronLeft, Shield } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('citizen'); // 'citizen' | 'rescue' | 'admin'
  const [currentLang, setCurrentLang] = useState('EN'); // 'EN' | 'HI' | 'TE' | 'TA' | 'BN'
  const [mobileTab, setMobileTab] = useState('sos'); // 'sos' | 'shelters' | 'missing' | 'guide'
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPhoneMockup, setIsPhoneMockup] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [shelters, setShelters] = useState(INITIAL_SHELTERS);
  const [sosRequests, setSosRequests] = useState(INITIAL_SOS_REQUESTS);
  const [rescueTeams, setRescueTeams] = useState(INITIAL_RESCUE_TEAMS);
  const [missingPersons, setMissingPersons] = useState(INITIAL_MISSING_PERSONS);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);

  // Network connectivity listener for offline disaster scenarios
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handlers for state updates
  const handleTriggerSos = (newSos) => {
    setSosRequests(prev => [newSos, ...prev]);
  };

  const handleReportMissingPerson = (newMp) => {
    setMissingPersons(prev => [newMp, ...prev]);
  };

  const handleUpdateSosStatus = (sosId, newStatus) => {
    setSosRequests(prev => prev.map(sos => {
      if (sos.id === sosId) {
        return { ...sos, status: newStatus };
      }
      return sos;
    }));
  };

  const handleAssignTeam = (sosId, teamName) => {
    setSosRequests(prev => prev.map(sos => {
      if (sos.id === sosId) {
        return { ...sos, assignedTeam: teamName, status: sos.status === 'PENDING' ? 'DISPATCHED' : sos.status };
      }
      return sos;
    }));

    setRescueTeams(prev => prev.map(t => {
      if (t.unitName === teamName) {
        return { ...t, status: 'ON_MISSION' };
      }
      return t;
    }));
  };

  const handleSendBroadcast = (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev]);
  };

  const handleUpdateShelterSupply = (shelterId, field, newValue) => {
    setShelters(prev => prev.map(s => {
      if (s.id === shelterId) {
        return { ...s, [field]: newValue };
      }
      return s;
    }));
  };

  const activeSosCount = sosRequests.filter(s => s.status === 'PENDING').length;

  const appContent = (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      {/* Mobile Top App Bar */}
      <MobileTopBar 
        isOnline={isOnline}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        activeRole={activeRole}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        activeSosCount={activeSosCount}
      />

      {/* Sub-header banner when in Responder or Command Mode */}
      {activeRole !== 'citizen' && (
        <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              activeRole === 'rescue' ? 'bg-blue-600 animate-ping' : 'bg-emerald-600'
            }`} />
            <span className="text-xs font-extrabold text-slate-800">
              {activeRole === 'rescue' ? 'NDRF Field Triage Terminal' : 'Disaster HQ Command Console'}
            </span>
          </div>
          <button
            onClick={() => setActiveRole('citizen')}
            className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg touch-press"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Citizen Mode</span>
          </button>
        </div>
      )}

      {/* Main Content Scroll Area */}
      <main className="flex-1 pb-28">
        {activeRole === 'citizen' && (
          <CitizenPortal 
            shelters={shelters}
            sosRequests={sosRequests}
            missingPersons={missingPersons}
            onTriggerSos={handleTriggerSos}
            onReportMissingPerson={handleReportMissingPerson}
            currentLang={currentLang}
            activeTab={mobileTab}
            onTabChange={setMobileTab}
          />
        )}

        {activeRole === 'rescue' && (
          <RescuePortal 
            sosRequests={sosRequests}
            rescueTeams={rescueTeams}
            onUpdateSosStatus={handleUpdateSosStatus}
            onAssignTeam={handleAssignTeam}
          />
        )}

        {activeRole === 'admin' && (
          <AdminDashboard 
            shelters={shelters}
            sosRequests={sosRequests}
            rescueTeams={rescueTeams}
            broadcasts={broadcasts}
            onSendBroadcast={handleSendBroadcast}
            onUpdateShelterSupply={handleUpdateShelterSupply}
          />
        )}
      </main>

      {/* Docked Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeTab={mobileTab}
        setActiveTab={(tab) => {
          if (activeRole !== 'citizen') {
            setActiveRole('citizen');
          }
          setMobileTab(tab);
        }}
        activeRole={activeRole}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        activeSosCount={activeSosCount}
        currentLang={currentLang}
      />

      {/* Role Switcher Action Sheet */}
      <RoleSwitcherModal 
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeSosCount={activeSosCount}
        currentLang={currentLang}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center">
      {/* Floating Demo Mode Switcher (visible on desktop screens for hackathon presentations) */}
      <div className="hidden lg:flex fixed top-3 right-4 z-[99] items-center gap-1.5 bg-white/90 backdrop-blur border border-slate-300 px-2.5 py-1.5 rounded-full shadow-lg">
        <span className="text-[11px] font-mono text-slate-500 font-semibold mr-1">Demo View:</span>
        <button
          onClick={() => setIsPhoneMockup(true)}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold transition-all touch-press ${
            isPhoneMockup
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone Frame</span>
        </button>
        <button
          onClick={() => setIsPhoneMockup(false)}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold transition-all touch-press ${
            !isPhoneMockup
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Screen</span>
        </button>
      </div>

      {/* Render simulated iPhone hardware frame for citizen/field ops, or full-width layout for admin command */}
      {isPhoneMockup && activeRole !== 'admin' ? (
        <div className="py-6 w-full flex items-center justify-center">
          <div className="mobile-device-frame relative flex flex-col bg-slate-50">
            <div className="mobile-notch">
              <div className="mobile-notch-camera" />
            </div>
            <div className="flex-1 overflow-y-auto pt-4 scrollbar-none">
              {appContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {appContent}
        </div>
      )}
    </div>
  );
}
