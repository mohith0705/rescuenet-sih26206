import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Home, Shield, Phone, Users, MapPin, Navigation, ExternalLink } from 'lucide-react';

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && typeof center[1] === 'number') {
      map.flyTo(center, 15, { animate: true, duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export default function InteractiveMap({ sosList = [], shelterList = [], teamList = [], activeFocusCoord, onSelectFocus }) {
  const [mapError, setMapError] = useState(false);

  // Safely create icons inside useMemo so Leaflet is fully initialized
  const icons = useMemo(() => {
    try {
      const makeIcon = (color) => {
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
            <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="2.5"/>
            <circle cx="12" cy="12" r="5" fill="${color}"/>
          </svg>
        `;
        return L.divIcon({
          html: svg,
          className: 'custom-leaflet-marker cursor-pointer',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -17]
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

        {/* SOS Markers (Circles) */}
        {sosList.map(sos => {
          const icon = sos.urgency === 'CRITICAL' ? icons.red : (sos.urgency === 'HIGH' ? icons.amber : icons.blue);
          return (
            <Marker 
              key={sos.id} 
              position={[sos.lat, sos.lng]} 
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectFocus) onSelectFocus([sos.lat, sos.lng]);
                }
              }}
            >
              <Popup>
                <div className="p-1.5 min-w-[220px] space-y-1.5">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                      sos.urgency === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {sos.urgency} SOS #{sos.ticketCode || sos.id}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{sos.timestamp}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{sos.name}</h4>
                  <div className="bg-red-50 border border-red-200 text-red-900 text-[10px] font-mono p-1 rounded font-bold flex items-center justify-between">
                    <span>📍 GPS: {sos.lat ? sos.lat.toFixed(5) : '17.6950'}°, {sos.lng ? sos.lng.toFixed(5) : '83.2250'}°</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{sos.location}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 font-bold text-slate-800">
                    <span>👥 Trapped: {sos.peopleCount}</span>
                    <span className="text-blue-600">{sos.status}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectFocus && onSelectFocus([sos.lat, sos.lng])}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 shrink-0" />
                      <span>📍 Fly / Center Map to Spot</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${sos.lat},${sos.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold py-1 px-2 rounded flex items-center justify-center gap-1 border border-slate-300 text-center"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-600 shrink-0" />
                      <span>🧭 Open Directions (Google Maps)</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelter Markers (Circles) */}
        {shelterList.map(shelter => (
          <Marker 
            key={shelter.id} 
            position={[shelter.lat, shelter.lng]} 
            icon={icons.green}
            eventHandlers={{
              click: () => {
                if (onSelectFocus) onSelectFocus([shelter.lat, shelter.lng]);
              }
            }}
          >
            <Popup>
              <div className="p-1.5 min-w-[210px] space-y-1.5">
                <div className="text-emerald-600 font-bold text-xs border-b pb-0.5">RELIEF SHELTER & SAFE CAMP</div>
                <h4 className="font-extrabold text-slate-900 text-xs">{shelter.name}</h4>
                <p className="text-[11px] text-slate-600 font-medium">{shelter.address}</p>
                <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 p-1 rounded">
                  Occupancy: {shelter.occupied} / {shelter.capacity}
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectFocus && onSelectFocus([shelter.lat, shelter.lng])}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 shrink-0" />
                    <span>📍 Fly / Center Map to Shelter</span>
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold py-1 px-2 rounded flex items-center justify-center gap-1 border border-slate-300 text-center"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-600 shrink-0" />
                    <span>🧭 Open Directions (Google Maps)</span>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rescue Team Markers (Circles) */}
        {teamList.map(team => {
          const teamLat = team.lat || 17.7100;
          const teamLng = team.lng || 83.2600;
          return (
            <Marker 
              key={team.id} 
              position={[teamLat, teamLng]} 
              icon={icons.blue}
              eventHandlers={{
                click: () => {
                  if (onSelectFocus) onSelectFocus([teamLat, teamLng]);
                }
              }}
            >
              <Popup>
                <div className="p-1.5 min-w-[180px] space-y-1">
                  <div className="text-blue-600 font-bold text-xs border-b pb-0.5">{team.unitName}</div>
                  <p className="text-[11px] text-slate-700 font-medium">Leader: {team.leader}</p>
                  <p className="text-[10px] font-mono text-slate-500">Status: {team.status}</p>
                  <button
                    type="button"
                    onClick={() => onSelectFocus && onSelectFocus([teamLat, teamLng])}
                    className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1 px-2 rounded flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 shrink-0" />
                    <span>📍 Center Map to Unit</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
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
