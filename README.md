# RescuENet - AI-Powered Unified Disaster Command & Emergency Response Platform

> **Smart India Hackathon (SIH 2026)**  
> **Problem Statement ID**: 26206  
> **Theme**: Disaster Management  
> **Category**: Software  
> **Organization**: AICTE (Student Innovation)

---

## 📌 Overview
**RescuENet** is a real-time emergency disaster management platform designed to connect **Citizens/Victims**, **NDRF/SDRF Rescue Units**, and **Government Disaster Command Centers** during natural crises such as floods, cyclones, earthquakes, and landslides.

---

## ✨ Key Features

### 🚨 1. Citizen & Victim Portal
- **1-Tap Geolocated Emergency SOS**: Instant emergency signal dispatch with GPS coordinates, distress category, headcount, and medical priority tagging.
- **Relief Shelters & Hospitals Finder**: Interactive map & list with live capacity indicators, food supply days, water reserves, and medical staff presence.
- **Missing Persons Registry**: Report missing family members with photo upload and search filter for automated rescue matching.
- **Offline & Low-Bandwidth Guide**: Instructions for compressed SMS beacons and Bluetooth mesh relay when cellular towers fail.

### 🛟 2. NDRF / SDRF Rescue Worker Portal
- **Tactical Distress Stream**: Real-time queue color-coded by priority (*Critical*, *High*, *Moderate*).
- **GIS Map Focus**: Centered map navigation for victim pinpoints.
- **Fleet & Unit Assignment**: Assign rescue boats, divers, and medical teams with live status updates (*Pending* → *Dispatched* → *Rescued*).

### 🏛️ 3. Admin Command Center
- **Executive Command KPIs**: Real-time metrics on total affected citizens, shelter occupancy rates, active rescue units, and alerts.
- **Relief Logistics Manager**: Dynamic controls to allocate food rations, water tankers, and medical doctors across camps.
- **Mass Emergency Broadcast Engine**: Send instant regional push alerts and evacuation warnings directly to citizen devices.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **GIS / Mapping**: Leaflet Maps API, OpenStreetMap
- **Styling**: Tailwind CSS with custom disaster dark theme
- **State Management**: Reactive React Context & Mock Real-time Data Engine

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/mohith0705/rescuenet-sih26206.git
   cd rescuenet-sih26206
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`.

---

## 📄 License
This project is created for Smart India Hackathon (SIH 2026) under open student innovation guidelines.
