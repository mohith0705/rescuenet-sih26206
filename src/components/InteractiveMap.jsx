import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Home, Shield, Phone, Users, Navigation } from 'lucide-react';

// Custom Leaflet Markers using SVG Data URIs
const createCustomIcon = (color, type) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const redIcon = createCustomIcon('#ef4444', 'sos');
const amberIcon = createCustomIcon('#f59e0b', 'sos-high');
const greenIcon = createCustomIcon('#10b981', 'shelter');
const blueIcon = createCustomIcon('#3b82f6', 'team');

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function InteractiveMap({ sosList, shelterList, teamList, activeFocusCoord, onAssignTeam }) {
  const defaultCenter = activeFocusCoord || [17.7050, 83.2500];

  return (
    <div className="relative w-full h-[480px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={activeFocusCoord} />

        {/* SOS Markers */}
        {sosList && sosList.map(sos => {
          const icon = sos.urgency === 'CRITICAL' ? redIcon : (sos.urgency === 'HIGH' ? amberIcon : blueIcon);
          return (
            <Marker key={sos.id} position={[sos.lat, sos.lng]} icon={icon}>
              <Popup className="disaster-popup">
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
                      sos.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {sos.urgency} SOS
                    </span>
                    <span className="text-xs text-slate-500">{sos.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{sos.name}</h4>
                  <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" /> {sos.peopleCount} People trapped
                  </p>
                  <p className="text-xs text-slate-700 bg-slate-100 p-1.5 rounded mb-2 font-mono">
                    {sos.location}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t">
                    <span className="font-medium text-slate-600">{sos.status}</span>
                    {sos.phone && (
                      <a href={`tel:${sos.phone}`} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelter Markers */}
        {shelterList && shelterList.map(shelter => (
          <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={greenIcon}>
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs mb-1">
                  <Home className="w-3.5 h-3.5" /> RELIEF SHELTER
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{shelter.name}</h4>
                <p className="text-xs text-slate-600 mb-2">{shelter.address}</p>
                <div className="bg-emerald-50 text-emerald-800 p-2 rounded text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="font-bold">{shelter.occupied} / {shelter.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food Supply:</span>
                    <span className="font-bold">{shelter.foodSupplyDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Staff:</span>
                    <span className="font-bold">{shelter.medicalDoctorPresent ? 'Available' : 'On Call'}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rescue Team Markers */}
        {teamList && teamList.map(team => (
          <Marker key={team.id} position={[17.7100 + (Math.random() - 0.5) * 0.05, 83.2600 + (Math.random() - 0.5) * 0.05]} icon={blueIcon}>
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-1 text-blue-600 font-bold text-xs mb-1">
                  <Shield className="w-3.5 h-3.5" /> {team.unitName}
                </div>
                <p className="text-xs text-slate-700 font-semibold">{team.leader}</p>
                <p className="text-xs text-slate-500">{team.equipment}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg text-xs text-slate-200 shadow-xl space-y-1.5">
        <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">Map Key</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>Critical SOS Alert</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>High Priority SOS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Relief Shelter / Camp</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Rescue NDRF Unit</span>
        </div>
      </div>
    </div>
  );
}
