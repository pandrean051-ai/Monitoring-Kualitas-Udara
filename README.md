# IAQ Monitoring Dashboard

This repository contains a simple **Indoor Air Quality (IAQ) Monitoring Dashboard** built with plain HTML/JS, Tailwind (CDN), Firebase Realtime Database (v8 SDK) and Chart.js.

## Included files
- `index.html` — Main dashboard page (realtime + recap + simulated trends).
- `styles.css` — External CSS for small overrides and dark theme.
- `README.md` — This file.

## Quick start (local)
1. Unzip the project (if zipped).
2. Open `index.html` in a modern browser (Chrome/Edge/Firefox).
3. Replace the Firebase configuration at the top of `index.html` with your Firebase Realtime Database config:
```js
let firebaseConfig = {
  apiKey: "...",
  databaseURL: "https://your-project-default-rtdb.../",
  projectId: "your-project-id",
};
```
4. Ensure your ESP32 (or data source) writes to the Realtime Database at path `/IAQ` with keys matching the dashboard:
```
{
  "suhu": 26.4,
  "kelembaban": 66.0,
  "debu": 0.027,
  "co2": 400,
  "status": "Normal"
}
```

## Features
- Realtime updates from Firebase.
- Simulated recap data & trends (useful if you don't have live data).
- CSV download for recap period.
- Dark theme UI ready for GitHub Pages.

## Deploy
To deploy on GitHub Pages:
1. Create a new repository and push this folder.
2. In repo settings → Pages, set branch to `main` and folder to `/ (root)`.
3. Visit `https://<username>.github.io/<repo>/`

## Notes & tips
- The dashboard expects keys matching `suhu`, `kelembaban`, `debu`, `co2`, `status`. Adjust either the ESP32 code or the dashboard if your key names differ (e.g. `MQ135`, `Partikel`).
- For production use, consider upgrading Firebase SDK and securing read/write rules.

If you want, I can:
- Create a GitHub-ready repo and push files for you.
- Produce a ZIP containing the project (ready to upload).
- Replace simulated trends with real aggregated data from your DB (if you allow me to access sample data).

