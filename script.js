// script.js - Full Firebase RTDB + Chart integration for IAQ dashboard
// ---- CONFIG: ganti sesuai Firebase Anda jika perlu ----
var firebaseConfig = {
  apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
  authDomain: "monitoring-kualitas-udar-8ad9d.firebaseapp.com",
  databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoring-kualitas-udar-8ad9d",
  storageBucket: "monitoring-kualitas-udar-8ad9d.appspot.com",
  messagingSenderId: "123456",
  appId: "1:xxxx:web:xxxx"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM refs
const el = {
  suhu: document.getElementById('suhu'),
  humid: document.getElementById('humid'),
  debu: document.getElementById('debu'),
  co2: document.getElementById('co2'),
  status: document.getElementById('status'),
  statusPill: document.getElementById('statusPill'),
  summary: document.getElementById('summary'),
  suhuDelta: document.getElementById('suhuDelta'),
  humidDelta: document.getElementById('humidDelta'),
  debuDelta: document.getElementById('debuDelta'),
  co2Delta: document.getElementById('co2Delta'),
};

// small state for deltas
let lastValues = { suhu: null, humid: null, debu: null, co2: null };

// Chart instances
const chartHour = new Chart(document.getElementById('chartHour').getContext('2d'), {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Suhu (°C)', data: [], fill:false, tension:0.3 }] },
  options: { responsive:true, maintainAspectRatio:false }
});
const chartDay = new Chart(document.getElementById('chartDay').getContext('2d'), {
  type: 'bar',
  data: { labels: [], datasets: [{ label: 'Suhu (°C)', data: [] }] },
  options: { responsive:true, maintainAspectRatio:false }
});
const chartMonth = new Chart(document.getElementById('chartMonth').getContext('2d'), {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Suhu (°C)', data: [], fill:false, tension:0.3 }] },
  options: { responsive:true, maintainAspectRatio:false }
});

// utility: format number
function f(n, d=1){ return (typeof n === 'number') ? n.toFixed(d) : '--'; }

// threshold function for status color
function statusClass(co2, dust){
  if (co2 === null || dust === null) return {text:'—', cls:''};
  if (co2 < 800 && dust < 0.05) return {text:'Bersih', cls:'good'};
  if (co2 < 1500 && dust < 0.15) return {text:'Normal', cls:'normal'};
  return {text:'Buruk', cls:'bad'};
}

// update real-time UI
function updateRealtime(d){
  if (!d) return;
  const suhu = d.suhu; const humid = d.kelembaban || d.hum || d.humidity;
  const dust = d.debu; const co2 = d.CO2 || d.co2;

  el.suhu.textContent = f(suhu,1) + ' °C';
  el.humid.textContent = f(humid,1) + ' %';
  el.debu.textContent = f(dust,3) + ' mg/m³';
  el.co2.textContent = f(co2,0) + ' ppm';

  // deltas
  ['suhu','humid','debu','co2'].forEach(k => {
    const cur = (k==='humid') ? humid : (k==='debu' ? dust : (k==='co2'?co2:suhu));
    const last = lastValues[k];
    if (last === null) {
      el[k+'Delta'].textContent = '—';
    } else {
      const diff = cur - last;
      el[k+'Delta'].textContent = (diff>0?'+':'') + (typeof diff==='number'?diff.toFixed(1):'—');
    }
    lastValues[k] = cur;
  });

  // status pill
  const st = statusClass(co2, dust);
  el.status.textContent = st.text;
  el.statusPill.innerHTML = '<span class="status-pill '+st.cls+'">'+st.text+'</span>';

  el.summary.textContent = `Suhu ${f(suhu,1)}°C • Kelembaban ${f(humid,1)}% • Debu ${f(dust,3)} mg/m³ • CO₂ ${f(co2,0)} ppm`;
}

// Listen to IAQ realtime node
db.ref('/IAQ').on('value', snap => {
  const d = snap.val();
  if (!d) return;
  updateRealtime(d);
}, err => {
  console.error('Firebase IAQ read failed', err);
});

// Load aggregate LOG data for charts
// Expect LOG structure: /LOG/YYYY/MM/DD/HH/... with avg_suhu
db.ref('/LOG').on('value', snap => {
  const log = snap.val();
  if (!log) return;

  const perHour = {}; // label: value
  const perDay = {};
  const perMonth = {};

  // iterate years/months/days/hours
  Object.keys(log).forEach(year => {
    const months = log[year] || {};
    Object.keys(months).forEach(month => {
      const days = months[month] || {};
      const monthKey = year + '-' + month;
      if (!perMonth[monthKey]) perMonth[monthKey] = [];

      Object.keys(days).forEach(day => {
        const hours = days[day] || {};
        const dayKey = year + '-' + month + '-' + day;
        if (!perDay[dayKey]) perDay[dayKey] = [];

        Object.keys(hours).forEach(hour => {
          const node = hours[hour] || {};
          if ('avg_suhu' in node){
            const label = dayKey + ' ' + hour + ':00';
            perHour[label] = node.avg_suhu;
            perDay[dayKey].push(node.avg_suhu);
            perMonth[monthKey].push(node.avg_suhu);
          } else {
            // also support minute entries where nodes are minute -> {suhu:..}
            // if node contains minute keys, iterate them
            Object.keys(node).forEach(mink => {
              const mnode = node[mink];
              if (mnode && typeof mnode === 'object' && 'suhu' in mnode){
                // compute intermediate label
                const label = `${year}-${month}-${day} ${hour}:${mink}`;
                // store in perHour under hour label (approx)
                // skip minute-level for perHour average because ESP32 already stores avg_suhu per hour separately
              }
            });
          }
        });
      });
    });
  });

  // calc average perDay/perMonth
  function avgArray(arr){ return arr.length? arr.reduce((a,b)=>a+b,0)/arr.length : null; }
  const perDayAvg = {}; const perMonthAvg = {};
  Object.keys(perDay).forEach(k => { const v = avgArray(perDay[k]); if (v!==null) perDayAvg[k]=v; });
  Object.keys(perMonth).forEach(k => { const v = avgArray(perMonth[k]); if (v!==null) perMonthAvg[k]=v; });

  // update charts
  updateChart(chartHour, perHour);
  updateChart(chartDay, perDayAvg);
  updateChart(chartMonth, perMonthAvg);
});

// helper to update Chart.js chart from object map
function updateChart(chart, obj){
  const labels = Object.keys(obj).slice(-48); // limit to last N points
  const data = labels.map(l => obj[l]);
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// Dark/light mode toggle
const modeBtn = document.getElementById('modeBtn');
const modeLabel = document.getElementById('modeLabel');
function setMode(m){
  if (m==='light'){ document.body.classList.add('light'); modeLabel.textContent='Light'; }
  else { document.body.classList.remove('light'); modeLabel.textContent='Dark'; }
  localStorage.setItem('mode', m);
}
modeBtn.addEventListener('click', ()=>{
  const isLight = document.body.classList.contains('light');
  setMode(isLight? 'dark' : 'light');
});
// initialize mode from storage or system prefer
(function(){ const saved = localStorage.getItem('mode'); if(saved) setMode(saved); else setMode('dark'); })();

// auto-refresh interval (we use realtime listeners; chart updates on LOG changes)
// but you can change this logic to poll if necessary.
