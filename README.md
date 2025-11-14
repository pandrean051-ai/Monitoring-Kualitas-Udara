# 🌌 IAQ Monitoring Dashboard (Firebase + ESP32 + ST7789)

Dashboard ini menampilkan data kualitas udara dari Firebase Realtime Database,
terhubung dengan ESP32 multi sensor (DHT22, MQ135, GP2Y1010, RTC, ST7789).

## ⚙️ Fitur
- Realtime monitoring suhu, kelembaban, CO₂, dan partikel debu.
- Tampilan neon dark (cyber style).
- Grafik histori waktu (dari node `/IAQ/Histori` di Firebase).
- Kompatibel dengan GitHub Pages.

## 🚀 Cara Menjalankan
1. Buat project Firebase dan salin konfigurasi ke `script.js`.
2. Upload file `index.html`, `style.css`, dan `script.js` ke GitHub repo.
3. Aktifkan **GitHub Pages** dari Settings → Pages → branch `main`.
4. Buka dashboard dari link GitHub Pages yang muncul.
