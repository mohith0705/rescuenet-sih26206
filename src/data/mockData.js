export const INITIAL_SHELTERS = [
  {
    id: 'sh-1',
    name: 'St. Xavier School Relief Camp',
    type: 'Primary Shelter',
    address: 'Sector 4, Main Road, Coastal Zone',
    capacity: 500,
    occupied: 340,
    foodSupplyDays: 4,
    waterLiters: 1200,
    medicalDoctorPresent: true,
    contact: '+91 98765 43210',
    lat: 17.6868,
    lng: 83.2185,
    status: 'ACTIVE'
  },
  {
    id: 'sh-2',
    name: 'District Community Hall Flood Relief',
    type: 'Emergency Shelter',
    address: 'Near Old Bus Stand, High Ground Area',
    capacity: 300,
    occupied: 285,
    foodSupplyDays: 2,
    waterLiters: 450,
    medicalDoctorPresent: false,
    contact: '+91 98765 43211',
    lat: 17.7231,
    lng: 83.3012,
    status: 'HIGH_CAPACITY'
  },
  {
    id: 'sh-3',
    name: 'Apollo Medical & Emergency Camp',
    type: 'Medical Camp',
    address: 'Green Valley Stadium Premises',
    capacity: 200,
    occupied: 90,
    foodSupplyDays: 7,
    waterLiters: 3000,
    medicalDoctorPresent: true,
    contact: '+91 98765 43212',
    lat: 17.7011,
    lng: 83.2544,
    status: 'ACTIVE'
  },
  {
    id: 'sh-4',
    name: 'Government Polytechnic Evacuation Center',
    type: 'Primary Shelter',
    address: 'NH-16 Bypass, Inland Zone',
    capacity: 800,
    occupied: 410,
    foodSupplyDays: 5,
    waterLiters: 4500,
    medicalDoctorPresent: true,
    contact: '+91 98765 43213',
    lat: 17.7450,
    lng: 83.2200,
    status: 'ACTIVE'
  }
];

export const INITIAL_SOS_REQUESTS = [
  {
    id: 'sos-101',
    name: 'Rajesh Kumar',
    phone: '+91 91234 56789',
    peopleCount: 4,
    location: 'Plot 42, Beach Road Colony (Flooded area, 4ft water)',
    lat: 17.6910,
    lng: 83.2290,
    urgency: 'CRITICAL',
    category: 'FLOOD_TRAPPED',
    timestamp: '10 mins ago',
    status: 'PENDING',
    assignedTeam: null,
    notes: 'Elderly person with diabetic emergency needing immediate evacuation.'
  },
  {
    id: 'sos-102',
    name: 'Sunita Sharma',
    phone: '+91 98761 12345',
    peopleCount: 2,
    location: 'Subhash Nagar, Roof Top of Building 7',
    lat: 17.7120,
    lng: 83.2840,
    urgency: 'HIGH',
    category: 'MEDICAL_EMERGENCY',
    timestamp: '25 mins ago',
    status: 'DISPATCHED',
    assignedTeam: 'NDRF Alpha Unit',
    notes: 'Severe injury from falling debris during cyclone.'
  },
  {
    id: 'sos-103',
    name: 'Anil Rao',
    phone: '+91 93456 78901',
    peopleCount: 6,
    location: 'Fishermen Colony, Near Old Dock',
    lat: 17.6780,
    lng: 83.2010,
    urgency: 'CRITICAL',
    category: 'STRUCTURE_COLLAPSE',
    timestamp: '40 mins ago',
    status: 'PENDING',
    assignedTeam: null,
    notes: 'Wall partially collapsed. Children stranded.'
  },
  {
    id: 'sos-104',
    name: 'Pooja Verma',
    phone: '+91 97654 32109',
    peopleCount: 3,
    location: 'RTC Complex, 2nd Floor Apartment',
    lat: 17.7300,
    lng: 83.3100,
    urgency: 'MODERATE',
    category: 'FOOD_WATER_SHORTAGE',
    timestamp: '1 hour ago',
    status: 'RESCUED',
    assignedTeam: 'SDRF Bravo Unit',
    notes: 'Safely evacuated to St. Xavier Relief Camp.'
  }
];

export const INITIAL_RESCUE_TEAMS = [
  {
    id: 'team-1',
    unitName: 'NDRF Alpha Unit (Boats & Divers)',
    leader: 'Commander V. Singh',
    phone: '+91 90000 11111',
    personnel: 12,
    equipment: '2 Rescue Boats, 4 Life Jackets, Satellite Comm',
    status: 'ON_MISSION',
    currentLocation: 'Subhash Nagar'
  },
  {
    id: 'team-2',
    unitName: 'SDRF Bravo Unit (Medical Fast Response)',
    leader: 'Dr. K. R. Naidu',
    phone: '+91 90000 22222',
    personnel: 8,
    equipment: '1 Ambulance, Emergency Medical Kits, Oxygen Tanks',
    status: 'AVAILABLE',
    currentLocation: 'District Control Room'
  },
  {
    id: 'team-3',
    unitName: 'Civil Defense Rescue Charlie',
    leader: 'Capt. R. Deshmukh',
    phone: '+91 90000 33333',
    personnel: 15,
    equipment: 'Debris Cutter, Ropes, High-Power Searchlights',
    status: 'AVAILABLE',
    currentLocation: 'Polytechnic Evacuation Center'
  }
];

export const INITIAL_MISSING_PERSONS = [
  {
    id: 'mp-1',
    name: 'Aarav Patel',
    age: 9,
    gender: 'Male',
    lastSeen: 'Near Beach Road Sector 4 during evacuation evacuation rush',
    reportDate: '05 Sep 2026',
    contactPerson: 'Ramesh Patel (Father) - +91 99887 76655',
    status: 'SEARCHING',
    photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'mp-2',
    name: 'Kamla Devi',
    age: 68,
    gender: 'Female',
    lastSeen: 'Old Railway Colony, wearing green saree',
    reportDate: '05 Sep 2026',
    contactPerson: 'Suresh Kumar (Son) - +91 99887 11223',
    status: 'LOCATED_SAFE',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BROADCASTS = [
  {
    id: 'bc-1',
    level: 'RED_ALERT',
    title: 'SEVERE CYCLONIC STORM WARNING',
    message: 'High tide & coastal flooding expected within next 3 hours. Residents of coastal sectors 1 to 5 move immediately to St. Xavier or Polytechnic Relief Camps.',
    targetArea: 'Coastal Belt (Sectors 1-5)',
    timestamp: '05 Sep, 22:30 IST'
  },
  {
    id: 'bc-2',
    level: 'ADVISORY',
    title: 'Drinking Water Distribution Points Active',
    message: 'Clean drinking water tankers have arrived at District Community Hall and Polytechnic Evacuation Center.',
    targetArea: 'All Districts',
    timestamp: '05 Sep, 20:15 IST'
  }
];
