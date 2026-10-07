# 🌪️ Atmos

**Atmos** is a premium, high-fidelity weather dashboard built with Next.js. It delivers real-time meteorological data through an immersive, dynamic glassmorphic interface that responds directly to current weather conditions.

Designed for both striking aesthetics and deep technical utility, Atmos seamlessly scales from massive desktop data terminals down to compact, mobile-friendly mobile views.

![Atmos Architecture](https://img.shields.io/badge/Architecture-Next.js_Fullstack-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/Frontend-React_18-blue?style=for-the-badge&logo=react)
![Deployment](https://img.shields.io/badge/Deployment-Vercel_Ready-000000?style=for-the-badge&logo=vercel)

## ✨ Core Features

* **Liquid Glassmorphism UI**: A cutting-edge CSS architecture featuring deep backdrop blurs, dynamic shadows, and hardware-accelerated animations.
* **Atmospheric Engine**: The background and color palette completely morphs depending on the time of day and the current weather state (e.g., dynamic snow/rain particles, sun arcs).
* **High-Density Data Cards**:
  * Real-time Air Quality Index (AQI) with granular pollutant breakdowns (PM2.5, PM10, O3, NO2).
  * Interactive Precipitation & Temperature trend charts via dual-axis graphing.
  * 5-Day and Hourly forecast tracking.
  * Critical Weather Event Banners (e.g., Extreme Heat, Freezing Warnings).
* **Fully Responsive**: A highly resilient flexbox and CSS Grid layout that elegantly degrades from a multi-column desktop command center down to a single-column mobile feed.
* **Serverless Backend**: Built completely on Next.js API Routes. No separate backend server required.

## 🛠️ Tech Stack

* **Framework**: Next.js (Pages Router)
* **Styling**: Vanilla CSS (CSS Modules & Global Tokens)
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **APIs**: OpenWeatherMap (Current, Forecast, Air Pollution, Reverse Geocoding)

## 🚀 Quick Start (Local Development)

Because Atmos uses Next.js API Routes, the entire fullstack application lives inside the `frontend/` directory. 

### 1. Clone & Install
```bash
git clone https://github.com/RohanCodesDev/Atmos.git
cd Atmos/frontend
npm install
```

### 2. Environment Variables
Create a `.env.local` file inside the `frontend/` directory:
```env
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

### 3. Spin up the Atmosphere
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the dashboard.

## ☁️ Vercel Deployment (Production)

Atmos is completely optimized for zero-config Vercel deployment. 

1. Push your code to a GitHub repository.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. **Important**: Set the **Root Directory** to `frontend`.
4. Add your `OPENWEATHER_API_KEY` to the Vercel Environment Variables.
5. Click **Deploy**. Vercel will automatically provision the React UI and map the `/api/weather` endpoints to edge functions.

---
*Note: The legacy `backend/` directory is retained for reference but is no longer actively required for deployment, as its Express routing has been successfully ported into the Next.js API infrastructure.*
