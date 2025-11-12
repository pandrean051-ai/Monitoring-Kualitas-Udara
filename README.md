# 🌤️ Monitoring Kualitas Udara (ESP32 + Firebase)

Proyek ini memantau suhu, kelembaban, partikel debu, dan kadar CO₂ secara real-time menggunakan ESP32 dan Firebase.  
Data dari sensor dikirim ke **Firebase Realtime Database**, lalu ditampilkan secara langsung di halaman web.

---

## 🚀 Fitur
- Monitoring suhu, kelembaban, partikel, dan CO₂ real-time  
- Dashboard web interaktif (HTML + JS + Firebase SDK v11)
- Data otomatis diperbarui tanpa reload halaman  
- Integrasi dengan ESP32

---

## ⚙️ Struktur Firebase
Data disimpan di path berikut:
```
IAQ/
 └── Histori/
      └── 2025-11-12_11:33:47/
           ├── suhu: 25.6
           ├── kelembaban: 59.5
           ├── Partikel: 0.48
           ├── CO2: 3.75
           └── status: "Buruk"
```

---

## 🧩 File Penting
| File | Fungsi |
|------|---------|
| `index.html` | Dashboard untuk menampilkan data dari Firebase |
| `README.md` | Dokumentasi proyek |
| `esp32_code.ino` | Program mikrokontroler untuk kirim data |

---

## 🔧 Cara Menjalankan
1. **Buka file `index.html`** di browser.  
2. Pastikan Firebase sudah diatur seperti berikut di dalam file:
   ```js
   const latestRef = ref(db, "IAQ/Histori");
   ```
3. Pastikan nama variabel data cocok dengan Firebase:
   ```js
   latest.CO2
   latest.Partikel
   latest.suhu
   latest.kelembaban
   ```
4. Jika data `undefined`, cek di Realtime Database apakah huruf besar–kecil sama persis.

---

## 📷 Contoh Tampilan
(Tambahkan tangkapan layar di sini)

---

## 👨‍💻 Pengembang
Dibuat oleh **Andrean** — Monitoring IoT Kualitas Udara (2025)

---

## 🧠 Lisensi
Open Source Project — silakan gunakan untuk penelitian dan pembelajaran.
