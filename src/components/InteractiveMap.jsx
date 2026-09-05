import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Home, Shield, Phone, Users, MapPin } from 'lucide-react';

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function InteractiveMap({ sosList = [], shelterList = [], teamList = [], activeFocusCoord }) {
  const [mapError, setMapError] = useState(false);

  // Safely create icons inside useMemo so Leaflet is fully initialized
  const icons = useMemo(() => {
    try {
      const makeIcon = (color) => {
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" fill="${color}"/>
          </svg>
        `;
        return L.divIcon({
          html: svg,
          className: 'custom-leaflet-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });
      };

      return {
        red: makeIcon('#ef4444'),
        amber: makeIcon('#f59e0b'),
        green: makeIcon('#10b981'),
        blue: makeIcon('#3b82f6')
      };
    } catch (err) {
      console.warn("Leaflet icon init fallback:", err);
      return null;
    }
  }, []);

  const defaultCenter = activeFocusCoord || [17.7050, 83.2500];

  if (mapError || !icons) {
    return (
      <div className="relative w-full h-[480px] bg-slate-900 rounded-xl border border-slate-200 p-6 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-10">
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
            <MapPin className="w-4 h-4" /> Tactical Disaster Grid View
          </div>
          <span className="text-xs text-slate-400 font-mono">Coastal Sector Grid</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto z-10">
          {sosList.slice(0, 6).map(sos => (
            <div key={sos.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${sos.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'}`}>
                  {sos.urgency}
                </span>
                <span className="text-[10px] text-slate-500">{sos.timestamp}</span>
              </div>
              <div className="font-bold text-white text-xs truncate">{sos.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{sos.location}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-500 flex justify-between items-center z-10 border-t border-slate-800 pt-3">
          <span>● Active Distress Tracking Enabled</span>
          <button onClick={() => setMapError(false)} className="text-blue-400 hover:underline">Reload Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[480px] bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-md">
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
        {sosList.map(sos => {
          const icon = sos.urgency === 'CRITICAL' ? icons.red : (sos.urgency === 'HIGH' ? icons.amber : icons.blue);
          return (
            <Marker key={sos.id} position={[sos.lat, sos.lng]} icon={icon}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between border-b pb-1 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                      sos.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {sos.urgency} SOS
                    </span>
                    <span className="text-[10px] text-slate-500">{sos.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{sos.name}</h4>
                  <p className="text-[11px] text-slate-600 font-mono mt-0.5">{sos.location}</p>
                  <p className="text-[11px] text-slate-700 font-bold mt-1">{sos.peopleCount} People trapped</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelter Markers */}
        {shelterList.map(shelter => (
          <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={icons.green}>
            <Popup>
              <div className="p-1 min-w-[200px]">
                <div className="text-emerald-600 font-bold text-xs mb-0.5">RELIEF SHELTER</div>
                <h4 className="font-bold text-slate-900 text-xs">{shelter.name}</h4>
                <p className="text-[11px] text-slate-600">{shelter.address}</p>
                <div className="text-[11px] text-emerald-800 font-bold mt-1">
                  Occupancy: {shelter.occupied} / {shelter.capacity}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rescue Team Markers */}
        {teamList.map(team => (
          <Marker key={team.id} position={[17.7100 + (Math.random() - 0.5) * 0.05, 83.2600 + (Math.random() - 0.5) * 0.05]} icon={icons.blue}>
            <Popup>
              <div className="p-1">
                <div className="text-blue-600 font-bold text-xs">{team.unitName}</div>
                <p className="text-[11px] text-slate-700">{team.leader}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Key Overlay - Lower z-index so popups and modals appear cleanly on top */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg text-[11px] text-slate-200 shadow-xl space-y-1">
        <div className="font-bold text-slate-400 text-[10px] uppercase">Map Key</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span><span>Critical SOS</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Shelter</span></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span>NDRF Unit</span></div>
      </div>
    </div>
  );
}
