import React, { useState } from 'react';
import Navbar from './components/Navbar';
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

export default function App() {
  const [activeRole, setActiveRole] = useState('citizen'); // 'citizen' | 'rescue' | 'admin'
  const [currentLang, setCurrentLang] = useState('EN'); // 'EN' | 'HI' | 'TE' | 'TA' | 'BN'

  // Emergency Power Saver & PWA Offline State
  const [isPowerSaver, setIsPowerSaver] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [shelters, setShelters] = useState(INITIAL_SHELTERS);
  const [sosRequests, setSosRequests] = useState(INITIAL_SOS_REQUESTS);
  const [rescueTeams, setRescueTeams] = useState(INITIAL_RESCUE_TEAMS);
  const [missingPersons, setMissingPersons] = useState(INITIAL_MISSING_PERSONS);
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);

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

  const handleInjectSimulation = () => {
    const simulatedSignals = [
      {
        id: `sos-sim-${Date.now()}-1`,
        ticketCode: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        victimName: 'Ramesh Kumar & Family (3 Trapped)',
        category: 'FLOOD_TRAPPED',
        locationName: 'Sector 4 River Bank, Chennai',
        lat: 13.0827,
        lng: 80.2707,
        timestamp: 'Just Now (Simulated)',
        status: 'PENDING',
        details: 'Water rising up to 1st floor. Urgent boat evacuation required.',
        assignedTeam: 'Unassigned'
      },
      {
        id: `sos-sim-${Date.now()}-2`,
        ticketCode: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        victimName: 'Priya Sharma (5 Trapped)',
        category: 'CYCLONE_DAMAGE',
        locationName: 'Fishermen Colony, Vizag',
        lat: 17.6868,
        lng: 83.2185,
        timestamp: 'Just Now (Simulated)',
        status: 'PENDING',
        details: 'Roof collapse during cyclone winds. Immediate medical team needed.',
        assignedTeam: 'Unassigned'
      },
      {
        id: `sos-sim-${Date.now()}-3`,
        ticketCode: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        victimName: 'Anil Varma (2 Trapped)',
        category: 'LANDSLIDE_BLOCK',
        locationName: 'Hill Road Sector 2, Wayanad',
        lat: 11.6854,
        lng: 76.1320,
        timestamp: 'Just Now (Simulated)',
        status: 'DISPATCHED',
        details: 'Debris blocking exit. NDRF team deployed.',
        assignedTeam: 'NDRF Unit 4 - Bravo'
      },
      {
        id: `sos-sim-${Date.now()}-4`,
        ticketCode: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        victimName: 'Suresh Patel (4 Trapped)',
        category: 'EARTHQUAKE_CRACK',
        locationName: 'Market Square, Bhuj',
        lat: 23.2420,
        lng: 69.6669,
        timestamp: 'Just Now (Simulated)',
        status: 'PENDING',
        details: 'Building structural crack after tremor. Requires evacuation.',
        assignedTeam: 'Unassigned'
      }
    ];

    setSosRequests(prev => [...simulatedSignals, ...prev]);
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

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isPowerSaver ? 'bg-slate-950 text-slate-100 grayscale-[20%]' : 'bg-slate-100 text-slate-900'}`}>
      {/* Top Header Navbar with Language Switcher */}
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        activeSosCount={activeSosCount}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        isPowerSaver={isPowerSaver}
        setIsPowerSaver={setIsPowerSaver}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeRole === 'citizen' && (
          <CitizenPortal 
            shelters={shelters}
            sosRequests={sosRequests}
            missingPersons={missingPersons}
            onTriggerSos={handleTriggerSos}
            onReportMissingPerson={handleReportMissingPerson}
            currentLang={currentLang}
            isPowerSaver={isPowerSaver}
            isOnline={isOnline}
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
            onInjectSimulatedSos={handleInjectSimulation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-mono font-medium shadow-inner">
        RescuENet Platform &bull; Smart India Hackathon (SIH 2026) &bull; Problem Statement #26206
      </footer>
    </div>
  );
}
