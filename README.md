# IAQ Dashboard — Monitoring Kualitas Udara

This is a simple web dashboard to visualize IAQ (Indoor Air Quality) data stored in Firebase Realtime Database.

## Features
- Live values: temperature, humidity, CO2, dust (reads from `/IAQ`)
- Historical charts:
  - Per hour (reads `/IAQ_PER_JAM/YYYY/MM/DD/HH`)
  - Per day (reads `/IAQ_PER_HARI/YYYY/MM/DD`)
  - Per month (reads `/IAQ_PER_BULAN/YYYY/MM`)

## Setup
1. Fill Firebase configuration in `app.js` (firebaseConfig).
2. Upload files to any static host (GitHub Pages, Netlify, etc.) or open `index.html` locally.
3. Make sure your Firebase DB rules allow read access for your site (or implement auth).

## Expected Firebase structure (examples)
- `/IAQ` — current values: `{ suhu: 25.1, kelembaban: 60, CO2: 450, debu: 0.01 }`
- `/IAQ_PER_JAM/2025/11/19/10` — hourly summary
- `/IAQ_PER_HARI/2025/11/19` — daily summary
- `/IAQ_PER_BULAN/2025/11` — monthly summary

## Files
- `index.html` — main page
- `styles.css` — styling
- `app.js` — firebase + charts logic
