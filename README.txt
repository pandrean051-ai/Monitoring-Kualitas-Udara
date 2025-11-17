IAQ Monitoring Dashboard (Dark/Light + Icons + Firebase Realtime)
---------------------------------------------------------------
Files:
- index.html    => UI (dark/light mode, icons, layout)
- script.js     => Firebase Realtime DB logic + Chart.js charts

How to use:
1. Upload both files to a GitHub repo and enable GitHub Pages (branch: main, folder: root or docs).
2. Edit script.js firebaseConfig with your project's real API key / databaseURL if different.
3. Make sure your Realtime Database rules allow read access for testing, or configure auth.
4. Your ESP32 code already writes to:
   /IAQ  (realtime current values)
   /LOG/... (hourly averages)

Structure expected (examples):
/IAQ:
  { suhu: 27.1, kelembaban: 70, debu: 0.034, CO2: 800, status: "Normal" }

/LOG/YYYY/MM/DD/HH/avg_suhu
/LOG/YYYY/MM/DD/HH/avg_kelembaban
/LOG/YYYY/MM/DD/HH/avg_debu
/LOG/YYYY/MM/DD/HH/avg_co2

If you want me to also commit these files to your GitHub repo or generate a zip with a README and icons, tell me.
