
# 🌤️ Monitoring Kualitas Udara

Proyek ini bertujuan untuk **memantau kualitas udara secara real-time** menggunakan sensor berbasis **ESP32 / ESP8266** yang terhubung ke **Firebase Realtime Database**.  
Data yang dikirimkan mencakup suhu, kelembaban, CO₂, partikel debu (PM2.5 & PM10), serta status kualitas udara.  
Hasil monitoring ditampilkan secara langsung melalui halaman web menggunakan **GitHub Pages**.

---

## 🔧 Fitur
- Menampilkan data suhu dan kelembaban secara real-time  
- Menampilkan kadar CO₂ (ppm)  
- Menampilkan konsentrasi partikel PM2.5 dan PM10  
- Status udara otomatis berubah berdasarkan kualitas udara  
- Tampilan web responsif dan ringan  
- Dapat diakses melalui GitHub Pages

---

## 🧠 Arsitektur Sistem

**Perangkat keras:**
- ESP32 / ESP8266  
- Sensor MQ-135 (CO₂)  
- Sensor DHT11 / DHT22 (Suhu & Kelembaban)  
- Sensor SDS011 / PMS5003 (PM2.5 & PM10)  

**Perangkat lunak:**
- Arduino IDE  
- Firebase Realtime Database  
- HTML + JavaScript (Firebase SDK 11.x)  
- GitHub Pages untuk menampilkan data

---

## 📁 Struktur Database di Firebase

```bash
IAQ/
 ├── suhu: 25.6
 ├── kelembaban: 61.7
 ├── CO2: 420
 ├── PM25: 12
 ├── PM10: 20
 ├── status: "Baik"
 └── Histori/
      ├── 2025-11-12_10-44-30/
      │     ├── suhu: 25.6
      │     ├── kelembaban: 61.7
      │     ├── CO2: 420
      │     ├── PM25: 12
      │     ├── PM10: 20
      │     └── status: "Baik"
