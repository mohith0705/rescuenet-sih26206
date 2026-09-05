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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        activeSosCount={activeSosCount}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-600 font-mono">
        RescuENet Platform &bull; Smart India Hackathon (SIH 2026) &bull; Problem Statement #26206
      </footer>
    </div>
  );
}
