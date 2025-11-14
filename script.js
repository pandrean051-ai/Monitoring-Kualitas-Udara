import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
  authDomain: "monitoring-kualitas-udar-8ad9d.firebaseapp.com",
  databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoring-kualitas-udar-8ad9d",
  storageBucket: "monitoring-kualitas-udar-8ad9d.appspot.com",
  messagingSenderId: "601022927315",
  appId: "1:601022927315:web:8bfb3efb4567db4fda03a8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const suhuEl = document.getElementById('suhu');
const kelembabanEl = document.getElementById('kelembaban');
const mq135El = document.getElementById('mq135');
const partikelEl = document.getElementById('partikel');
const statusEl = document.getElementById('status');

const chartSuhu = new Chart(document.getElementById("chartSuhu"), {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Suhu (°C)', data: [], borderColor: '#0ff' }] },
  options: { scales: { x: { ticks: { color: "#ccc" } }, y: { ticks: { color: "#ccc" } } } }
});

const chartCO2 = new Chart(document.getElementById("chartCO2"), {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'CO₂ (ppm)', data: [], borderColor: '#ff0' }] },
  options: { scales: { x: { ticks: { color: "#ccc" } }, y: { ticks: { color: "#ccc" } } } }
});

onValue(ref(db, '/IAQ/'), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  suhuEl.textContent = `${data.suhu?.toFixed(1)} °C`;
  kelembabanEl.textContent = `${data.kelembaban?.toFixed(1)} %`;
  mq135El.textContent = `${data["MQ-135"]?.toFixed(0)} ppm`;
  partikelEl.textContent = `${data.Partikel?.toFixed(3)} mg/m³`;
  statusEl.textContent = data.status;

  if (data.Histori) {
    const waktu = Object.keys(data.Histori).slice(-10);
    const suhuHist = waktu.map(k => data.Histori[k].suhu);
    const co2Hist = waktu.map(k => data.Histori[k]["MQ-135"]);

    chartSuhu.data.labels = waktu;
    chartSuhu.data.datasets[0].data = suhuHist;
    chartSuhu.update();

    chartCO2.data.labels = waktu;
    chartCO2.data.datasets[0].data = co2Hist;
    chartCO2.update();
  }
});
