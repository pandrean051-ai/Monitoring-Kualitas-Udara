<!DOCTYPE html>
<html>
<head>
  <title>Monitoring Kualitas Udara</title>
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
      authDomain: "monitoring-kualitas-udar-8ad9d.firebaseapp.com",
      databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "monitoring-kualitas-udar-8ad9d",
      storageBucket: "monitoring-kualitas-udar-8ad9d.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const latestRef = ref(db, "IAQ/Histori");

    onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      const latest = data[keys[keys.length - 1]];

      document.getElementById("suhu").innerText = latest.suhu + " °C";
      document.getElementById("kelembaban").innerText = latest.kelembaban + " %";
      document.getElementById("co2").innerText = latest.CO2 + " ppm";
      document.getElementById("status").innerText = latest.status;
    });
  </script>
</head>
<body style="font-family:sans-serif; text-align:center; background:#eef2f3; color:#222;">
  <h1>📊 Monitoring Kualitas Udara</h1>
  <p><strong>Suhu:</strong> <span id="suhu">Memuat...</span></p>
  <p><strong>Kelembaban:</strong> <span id="kelembaban">Memuat...</span></p>
  <p><strong>CO₂:</strong> <span id="co2">Memuat...</span></p>
  <p><strong>Status Udara:</strong> <span id="status">Memuat...</span></p>
</body>
</html>
