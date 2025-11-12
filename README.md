# 🌍 Monitoring Kualitas Udara

![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-FFCA28?logo=firebase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Online-green.svg)

> Proyek ini digunakan untuk **memantau kualitas udara secara real-time** menggunakan sensor (suhu, kelembaban, partikel, dan CO₂) yang dikirimkan ke **Firebase Realtime Database**, lalu ditampilkan melalui website berbasis **HTML + JavaScript**.

---

## 🚀 Demo Langsung

🔗 **[🌐 Lihat Website Monitoring](https://pandrean051-ai.github.io/Monitoring-Kualitas-Udara/)**

---

## 📊 Data yang Ditampilkan
| Parameter | Keterangan | Contoh Nilai |
|------------|-------------|---------------|
| 🌡️ **Suhu** | Suhu udara dalam derajat Celsius | `25.6 °C` |
| 💧 **Kelembaban** | Kelembaban relatif udara | `61.7 %` |
| ☁️ **Debu / Partikel** | Tingkat debu di udara | `0.48 mg/m³` |
| 🏭 **CO₂** | Konsentrasi karbon dioksida | `415 ppm` |
| 🧭 **Status Udara** | Kualitas udara keseluruhan | `Buruk`, `Baik`, `Sedang` |

---

## ⚙️ Konfigurasi Firebase

Tambahkan konfigurasi Firebase kamu di bagian:
```js
const firebaseConfig = {
  apiKey: "AIzaSyAD1QPvINjWitgo_Rrj44s47Pr4S1BU_lM",
  authDomain: "monitoring-kualitas-udar-8ad9d.firebaseapp.com",
  databaseURL: "https://monitoring-kualitas-udar-8ad9d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoring-kualitas-udar-8ad9d",
  storageBucket: "monitoring-kualitas-udar-8ad9d.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
