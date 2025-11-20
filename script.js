// ======================= FIREBASE CONFIG =======================
const firebaseConfig = {
  apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
  databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ======================= DATA TERKINI =======================
function loadRealtime() {
  db.ref("IAQ").on("value", snapshot => {
    const d = snapshot.val();
    if (!d) return;

    document.getElementById("tanggal").innerHTML = `<b>Tanggal:</b> ${d.waktu}`;
    document.getElementById("suhu").innerText = `Suhu: ${d.suhu} °C`;
    document.getElementById("kelembaban").innerText = `Kelembaban: ${d.kelembaban} %`;
    document.getElementById("co2").innerText = `CO2: ${d.CO2} ppm`;
    document.getElementById("debu").innerText = `Debu: ${d.debu} mg/m³`;
    document.getElementById("status").innerText = `Status: ${d.status}`;
  });
}

// ======================= GRAFIK =======================
function loadChart(path, canvasId) {
  db.ref(path).on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    let labels = [], suhu = [], lembab = [], co2 = [], debu = [];

    Object.keys(data).forEach(key => {
      labels.push(key);
      suhu.push(data[key].suhu);
      lembab.push(data[key].kelembaban);
      co2.push(data[key].CO2);
      debu.push(data[key].debu);
    });

    new Chart(document.getElementById(canvasId), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          { label: "Suhu", data: suhu, borderWidth: 2, fill: false },
          { label: "Kelembaban", data: lembab, borderWidth: 2, fill: false },
          { label: "CO2", data: co2, borderWidth: 2, fill: false },
          { label: "Debu", data: debu, borderWidth: 2, fill: false }
        ]
      }
    });
  });
}

// ======================= LOAD ALL =======================
loadRealtime();

const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, '0');
const d = String(today.getDate()).padStart(2, '0');

loadChart(`IAQ_PER_JAM/${y}/${m}/${d}`, "chartJam");
loadChart(`IAQ_PER_HARI/${y}/${m}/${d}`, "chartHari");
loadChart(`IAQ_PER_BULAN/${y}/${m}`, "chartBulan");
