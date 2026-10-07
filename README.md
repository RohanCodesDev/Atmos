# 🌪️ Atmos

**Atmos** is a premium, high-fidelity weather dashboard built with Next.js and Express. It delivers real-time meteorological data through an immersive, dynamic glassmorphic interface that responds directly to current weather conditions.

Designed for both striking aesthetics and deep technical utility, Atmos seamlessly scales from massive desktop data terminals down to compact, mobile-friendly mobile views.

![Atmos Architecture](https://img.shields.io/badge/Architecture-Next.js_+_Express-black?style=for-the-badge&logo=nodedotjs)
![React](https://img.shields.io/badge/Frontend-React_18-blue?style=for-the-badge&logo=react)

## ✨ Core Features

* **Liquid Glassmorphism UI**: A cutting-edge CSS architecture featuring deep backdrop blurs, dynamic shadows, and hardware-accelerated animations.
* **Atmospheric Engine**: The background and color palette completely morphs depending on the time of day and the current weather state (e.g., dynamic snow/rain particles, sun arcs).
* **High-Density Data Cards**:
  * Real-time Air Quality Index (AQI) with granular pollutant breakdowns (PM2.5, PM10, O3, NO2).
  * Interactive Precipitation & Temperature trend charts via dual-axis graphing.
  * 5-Day and Hourly forecast tracking.
  * Critical Weather Event Banners (e.g., Extreme Heat, Freezing Warnings).
* **Fully Responsive**: A highly resilient flexbox and CSS Grid layout that elegantly degrades from a multi-column desktop command center down to a single-column mobile feed.
* **Robust Express API**: A dedicated Express.js backend that securely wraps OpenWeatherMap APIs, handles geocoding, and streams formatted data to the client.

## 🛠️ Tech Stack

* **Frontend**: Next.js (Pages Router), React, Recharts, Lucide React
* **Styling**: Vanilla CSS (CSS Modules & Global Tokens)
* **Backend**: Node.js, Express.js
* **APIs**: OpenWeatherMap (Current, Forecast, Air Pollution, Reverse Geocoding)

## 🚀 Quick Start (Local Development)

The repository is split into two directories: `frontend/` (Next.js) and `backend/` (Express API). You will need to run both concurrently.

### 1. Clone the Repository
```bash
git clone https://github.com/RohanCodesDev/Atmos.git
cd Atmos
```

### 2. Set Up the Backend
Navigate to the `backend/` directory, install dependencies, and create an environment file.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### 3. Set Up the Frontend
Open a new terminal window, navigate to the `frontend/` directory, and install dependencies.
```bash
cd frontend
npm install
```
Start the frontend server:
```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the dashboard! The frontend will automatically communicate with the Express backend running on `http://localhost:5000`.

## ☁️ Deployment

To deploy this application, you must host both the frontend and the backend.

- **Frontend**: Can be deployed seamlessly to [Vercel](https://vercel.com/) by connecting the repository and setting the Root Directory to `frontend`.
- **Backend**: Can be deployed to services like Render, Heroku, or DigitalOcean Apps. Ensure you set the `OPENWEATHER_API_KEY` environment variable on your hosting provider, and update the frontend's fetch URL to point to your deployed backend URL.
