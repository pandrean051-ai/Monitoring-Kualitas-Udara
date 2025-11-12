<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monitoring Kualitas Udara</title>
  <script type="module">
    // Import Firebase SDK
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    // Konfigurasi Firebase (ganti dengan punyamu)
    const firebaseConfig = {
      apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
      authDomain: "monitoring-kualitas-udar-8ad9d.firebaseapp.com",
      databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "monitoring-kualitas-udar-8ad9d",
      storageBucket: "monitoring-kualitas-udar-8ad9d.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdefgh123456"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Referensi data
    const iaqRef = ref(db, "IAQ");

    // Ambil data real-time
    onValue(iaqRef, (snapshot) => {
      const data = snapshot.val();
      document.getElementById("suhu").innerText = data.suhu + " °C";
      document.getElementById("kelembaban").innerText = data.kelembaban + " %";
      document.getElementById("debu").innerText = data.debu + " mg/m³";
      document.getElementById("co2").innerText = data.CO2 + " ppm";
      document.getElementById("status").innerText = data.status;
      document.getElementById("waktu").innerText = data.waktu;
    });
  </script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0b132b;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #1c2541;
      border-radius: 12px;
      padding: 20px;
      margin: 10px auto;
      width: 300px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    h2 { color: #5bc0be; }
  </style>
</head>
<body>
  <h1>📊 Monitoring Kualitas Udara</h1>
  <div class="card"><h2 id="status">Loading...</h2></div>
  <div class="card">Suhu: <span id="suhu">--</span></div>
  <div class="card">Kelembaban: <span id="kelembaban">--</span></div>
  <div class="card">Debu: <span id="debu">--</span></div>
  <div class="card">CO₂: <span id="co2">--</span></div>
  <div class="card">Waktu: <span id="waktu">--</span></div>
</body>
</html>
