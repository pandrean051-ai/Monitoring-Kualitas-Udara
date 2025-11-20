// app.js — Dashboard IAQ (Firebase Realtime DB)
// 1) Isi konfigurasi Firebase pada bagian firebaseConfig
// 2) Struktur DB yang diharapkan:
//    /IAQ (realtime current values)
//    /IAQ_LOG/YYYY/MM/DD/HH:MM:SS/...  (log per timestamp)
//    /IAQ_PER_JAM/YYYY/MM/DD/HH/...
//    /IAQ_PER_HARI/YYYY/MM/DD/...
//    /IAQ_PER_BULAN/YYYY/MM

// --------------------
// CONFIGURE FIREBASE
// --------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "",
  databaseURL: "https://YOUR_DB.firebaseio.com",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --------------------
// HELPERS
// --------------------
function setText(id, txt){ const el=document.getElementById(id); if(el) el.innerText = txt; }

// simple formatter
function pad(n){ return n<10? '0'+n : n }

// --------------------
// CHARTS SETUP
// --------------------
const ctxHour = document.getElementById('chartHour').getContext('2d');
const ctxDay = document.getElementById('chartDay').getContext('2d');
const ctxMonth = document.getElementById('chartMonth').getContext('2d');

const hourChart = new Chart(ctxHour, {
  type:'line',
  data:{ labels:[], datasets:[
    {label:'CO₂ (ppm)', data:[], borderWidth:2, tension:0.3},
    {label:'Debu (µg/m³)', data:[], borderWidth:2, tension:0.3}
  ]},
  options:{responsive:true,scales:{y:{beginAtZero:true}}}
});
const dayChart = new Chart(ctxDay, {
  type:'line',
  data:{ labels:[], datasets:[
    {label:'CO₂ (ppm)', data:[], borderWidth:2, tension:0.3},
    {label:'Debu (µg/m³)', data:[], borderWidth:2, tension:0.3}
  ]},
  options:{responsive:true,scales:{y:{beginAtZero:true}}}
});
const monthChart = new Chart(ctxMonth, {
  type:'bar',
  data:{ labels:[], datasets:[
    {label:'IAQ Index', data:[], borderWidth:1}
  ]},
  options:{responsive:true,scales:{y:{beginAtZero:true}}}
});

// --------------------
// FETCH CURRENT VALUES (realtime)
// --------------------
function watchRealtime(){
  const ref = db.ref('/IAQ');
  ref.on('value', snap=>{
    const v = snap.val();
    if(!v) return;
    if(v.suhu!==undefined) setText('suhu', v.suhu.toFixed? v.suhu.toFixed(1)+' °C' : v.suhu+' °C');
    if(v.kelembaban!==undefined) setText('kelembapan', v.kelembaban.toFixed? v.kelembaban.toFixed(1)+' %' : v.kelembaban+' %');
    if(v.CO2!==undefined) setText('co2', v.CO2.toFixed? v.CO2.toFixed(0)+' ppm' : v.CO2+' ppm');
    if(v.debu!==undefined) setText('debu', v.debu.toFixed? v.debu.toFixed(3)+' µg/m³' : v.debu+' µg/m³');
    const now = new Date();
    document.getElementById('lastUpdated').innerText = 'Last update: '+ now.toLocaleString();
  });
}

// --------------------
// LOAD HISTORICAL: PER HOUR (last 24 hours) from /IAQ_PER_JAM
// --------------------
async function loadPerHour(){
  const now = new Date();
  const labels=[], co2s=[], dusts=[];
  for(let i=23;i>=0;i--){
    const d = new Date(now.getTime() - i*3600*1000);
    const YYYY = d.getFullYear();
    const MM = pad(d.getMonth()+1);
    const DD = pad(d.getDate());
    const HH = pad(d.getHours());
    const path = `/IAQ_PER_JAM/${YYYY}/${MM}/${DD}/${HH}`;
    try{
      const snap = await db.ref(path).once('value');
      const val = snap.val();
      labels.push(HH+':00');
      if(val){
        co2s.push(val.CO2 || val['MQ-135'] || 0);
        dusts.push(val.debu || val.Partikel || 0);
      } else { co2s.push(null); dusts.push(null); }
    }catch(e){ labels.push(HH+':00'); co2s.push(null); dusts.push(null); }
  }
  hourChart.data.labels = labels;
  hourChart.data.datasets[0].data = co2s;
  hourChart.data.datasets[1].data = dusts;
  hourChart.update();
}

// --------------------
// LOAD HISTORICAL: PER DAY (30 days) from /IAQ_PER_HARI
// --------------------
async function loadPerDay(){
  const now = new Date();
  const labels=[], co2s=[], dusts=[];
  for(let i=29;i>=0;i--){
    const d = new Date(now.getTime() - i*24*3600*1000);
    const YYYY = d.getFullYear();
    const MM = pad(d.getMonth()+1);
    const DD = pad(d.getDate());
    const path = `/IAQ_PER_HARI/${YYYY}/${MM}/${DD}`;
    try{
      const snap = await db.ref(path).once('value');
      const val = snap.val();
      labels.push(DD + '/' + MM);
      if(val){ co2s.push(val.CO2 || val['MQ-135'] || 0); dusts.push(val.debu || val.Partikel || 0); }
      else { co2s.push(null); dusts.push(null); }
    }catch(e){ labels.push(DD + '/' + MM); co2s.push(null); dusts.push(null); }
  }
  dayChart.data.labels = labels;
  dayChart.data.datasets[0].data = co2s;
  dayChart.data.datasets[1].data = dusts;
  dayChart.update();
}

// --------------------
// LOAD HISTORICAL: PER MONTH (12 months) from /IAQ_PER_BULAN
// --------------------
async function loadPerMonth(){
  const now = new Date();
  const labels=[], iaqIndex=[];
  for(let i=11;i>=0;i--){
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const YYYY = d.getFullYear();
    const MM = pad(d.getMonth()+1);
    const path = `/IAQ_PER_BULAN/${YYYY}/${MM}`;
    try{
      const snap = await db.ref(path).once('value');
      const val = snap.val();
      labels.push(d.toLocaleString('default',{month:'short'}));
      if(val){
        // compute simple IAQ index from co2 + dust
        const c = val.CO2 || val['MQ-135'] || 0;
        const p = val.debu || val.Partikel || 0;
        const index = Math.round((c/1000)*50 + Math.min(p/0.2*50,50)); // example formula
        iaqIndex.push(index);
      } else iaqIndex.push(null);
    }catch(e){ labels.push(d.toLocaleString('default',{month:'short'})); iaqIndex.push(null); }
  }
  monthChart.data.labels = labels;
  monthChart.data.datasets[0].data = iaqIndex;
  monthChart.update();
}

// --------------------
// Initialize dashboard
// --------------------
async function init(){
  watchRealtime();
  await loadPerHour();
  await loadPerDay();
  await loadPerMonth();
  // refresh every 5 minutes
  setInterval(()=>{ loadPerHour(); loadPerDay(); loadPerMonth(); }, 5*60*1000);
}

init();
