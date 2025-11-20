// Firebase Config (isi sesuai milikmu)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ---- Ambil Data Terbaru ----
db.ref("iaq/latest").on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    document.getElementById("latestData").innerHTML = `
        Suhu: ${data.temp} °C<br>
        Kelembapan: ${data.hum}%<br>
        CO₂: ${data.co2} ppm<br>
        Debu: ${data.dust} µg/m³
    `;
});

// ---- Grafik Per Jam ----
const ctxHour = document.getElementById("chartHour").getContext("2d");
const chartHour = new Chart(ctxHour, {
    type: "line",
    data: { labels: [], datasets: [{ label: "CO2 (ppm)", data: [] }] },
    options: {}
});

db.ref("iaq/hourly").on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    const labels = Object.keys(data);
    const values = labels.map(k => data[k].co2);

    chartHour.data.labels = labels;
    chartHour.data.datasets[0].data = values;
    chartHour.update();
});

// ---- Grafik Per Hari ----
const ctxDay = document.getElementById("chartDay").getContext("2d");
const chartDay = new Chart(ctxDay, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Debu (µg/m³)", data: [] }] },
    options: {}
});

db.ref("iaq/daily").on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    const labels = Object.keys(data);
    const values = labels.map(k => data[k].dust);

    chartDay.data.labels = labels;
    chartDay.data.datasets[0].data = values;
    chartDay.update();
});
