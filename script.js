// =============================
// FIREBASE CONFIG
// =============================
const firebaseConfig = {
    apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
    authDomain: "monitoring-kualitas-udar-8ad9d.firebaseapp.com",
    databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "monitoring-kualitas-udar-8ad9d",
    storageBucket: "monitoring-kualitas-udar-8ad9d.appspot.com",
    messagingSenderId: "123456",
    appId: "1:xxxx:web:xxxx"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =============================
// REALTIME DATA
// =============================
db.ref("IAQ").on("value", snap => {
    let d = snap.val();
    document.getElementById("suhu").innerHTML = d.suhu.toFixed(1);
    document.getElementById("kelembaban").innerHTML = d.kelembaban.toFixed(1);
    document.getElementById("debu").innerHTML = d.debu.toFixed(3);
    document.getElementById("co2").innerHTML = d.CO2.toFixed(0);

    let st = document.getElementById("status");
    st.innerHTML = d.status;
    st.className = d.status === "Bersih" || d.status === "Normal" ? "status-green" : "status-red";
});

// =============================
// CHART INIT
// =============================
let chartHour = new Chart(document.getElementById("chartHour"), {
    type: "line",
    data: { labels: [], datasets: [{ label: "Suhu (per jam)", data: [] }] }
});

let chartDay = new Chart(document.getElementById("chartDay"), {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Suhu (per hari)", data: [] }] }
});

let chartMonth = new Chart(document.getElementById("chartMonth"), {
    type: "line",
    data: { labels: [], datasets: [{ label: "Suhu (per bulan)", data: [] }] }
});

// =============================
// LOAD LOG DATA
// =============================
db.ref("LOG").on("value", snap => {
    const log = snap.val();
    if (!log) return;

    let perJam = {};
    let perHari = {};
    let perBulan = {};

    for (let year in log){
        for (let month in log[year]){

            let bulanKey = `${year}-${month}`;
            if (!perBulan[bulanKey]) perBulan[bulanKey] = [];

            for (let day in log[year][month]){

                let hariKey = `${year}-${month}-${day}`;
                if (!perHari[hariKey]) perHari[hariKey] = [];

                for (let hour in log[year][month][day]){

                    let jamData = log[year][month][day][hour];

                    if ("avg_suhu" in jamData){
                        let jamKey = `${year}-${month}-${day} ${hour}:00`;

                        perJam[jamKey] = jamData.avg_suhu;
                        perHari[hariKey].push(jamData.avg_suhu);
                        perBulan[bulanKey].push(jamData.avg_suhu);
                    }
                }
            }
        }
    }

    updateChart(chartHour, perJam);
    updateChart(chartDay, calcAvg(perHari));
    updateChart(chartMonth, calcAvg(perBulan));
});

function calcAvg(obj){
    let result = {};
    for (let key in obj){
        let arr = obj[key];
        result[key] = arr.reduce((a,b)=>a+b) / arr.length;
    }
    return result;
}

function updateChart(chart, data){
    chart.data.labels = Object.keys(data);
    chart.data.datasets[0].data = Object.values(data);
    chart.update();
}
