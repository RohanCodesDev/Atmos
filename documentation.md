# ☁️ Atmos — Weather App Documentation

---

## TASK 1 - Weather App (Fetch API)

**Objective:**
Build a dynamic weather application that fetches and displays real-time weather information for any city using the OpenWeather API, with interactive icons and temperature unit options.

**Functional Requirements:**
- City search feature to retrieve live weather data dynamically.
- Display temperature, humidity, wind speed, pressure, visibility.
- Show weather condition icons based on API data.
- Toggle between Celsius and Fahrenheit.
- Graceful error handling for invalid cities or network failures.
- Responsive across all device sizes.
- Dynamic background themes based on weather conditions.

**Architecture:**
- **Frontend**: Next.js (`src/` dir, Pages Router, Tailwind CSS, TypeScript)
- **Backend**: Express.js
- Separated into `frontend/` and `backend/` folders.

---

## ⚙️ Technical Implementation Plan

### Phase 1: Setup and Configuration ✅ Completed
1. Created `frontend/` (Next.js) and `backend/` (Express) folders.
2. Backend: `express`, `cors`, `dotenv` installed. Basic `server.js` created.
3. Frontend: Next.js with Pages Router, Tailwind CSS, `src/` directory, TypeScript.

### Phase 2: Backend Development (API Layer)
1. `.env` file for `OPENWEATHER_API_KEY`.
2. Endpoint: `GET /api/weather?city={cityName}`
3. Controller: validate input → call OpenWeather → format response → return JSON.
4. Error handling: 400 (empty city), 404 (city not found), 500 (server error).

### Phase 3: Frontend — UI & Components
**Component tree:**
```
src/components/
├── Layout.tsx          ← Full-page background handler + Head
├── Navbar.tsx          ← Logo + Search + Unit Toggle
├── SearchBar.tsx       ← Compact inline search input
├── UnitToggle.tsx      ← °C / °F switch
├── WeatherHero.tsx     ← Greeting + City + Big temp + Icon
├── WeatherStats.tsx    ← Humidity, Wind, Pressure, Visibility
├── TodayCard.tsx       ← Today summary (high/low, sunrise/sunset)
├── HourlyForecast.tsx  ← Next 6 hours
├── WeeklyForecast.tsx  ← 7-day forecast
├── Loader.tsx          ← Skeleton loading state
└── ErrorMessage.tsx    ← Error banner
```

**Utility files:**
```
src/types/weather.ts      ← TypeScript interfaces
src/utils/weatherTheme.ts ← Condition → background gradient map
src/utils/tempUtils.ts    ← Temperature conversion & greeting
src/utils/mockForecast.ts ← Deterministic mock forecast data
```

### Phase 4: State Management & Integration
- States: `idle`, `loading`, `loaded`, `error`
- Fetch from Express backend at `http://localhost:5000/api/weather`
- Unit conversion: client-side `(C × 9/5) + 32`
- Dynamic backgrounds triggered by `condition` field from API

### Phase 5: Polish & Micro-interactions
- Smooth background transitions (1.2s ease)
- Fade-in-up for cards, float animation for weather icon
- Hover scale on stat tiles
- Skeleton shimmer loader
- ARIA attributes for accessibility

---

# ☁️ Atmos — Design Specification

> **Feel the weather.**

A modern, atmospheric weather app UI designed to make weather information feel **visual, immersive, and effortless**.

---

## ✦ Design Philosophy

> **Weather shouldn't just be displayed — it should be felt.**

* 🌤️ Weather-driven visual environments
* 💎 Frosted glass surfaces
* ✦ Minimal typography
* 🌊 Soft transitions
* 📐 Structured information hierarchy
* 📱 Responsive layouts
* 🎨 Adaptive color palettes

---

# 🖥️ Main Interface

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ☁ Atmos                    Search for a city... °C°F│
│                                                      │
│              REAL WEATHER · REAL TIME                │
│                                                      │
│             Good Evening, Kolkata                    │
│                                                      │
│                       ☀️                             │
│                      28°                             │
│                 Mostly Sunny                         │
│                                                      │
│      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│      │   💧   │ │   💨   │ │  🌡️   │ │   👁️  │   │
│      │   62%  │ │12 km/h │ │1012 hPa│ │ 10 km  │   │
│      │Humidity│ │  Wind  │ │Pressure│ │Visibility│  │
│      └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                      │
│ ┌────────────┐ ┌──────────────────┐ ┌─────────────┐ │
│ │   TODAY    │ │   NEXT 6 HOURS   │ │  7-DAY      │ │
│ │  28° / 21° │ │ ☀ ☀ ⛅ ⛅ 🌙 🌙 │ │  FORECAST   │ │
│ └────────────┘ └──────────────────┘ └─────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 🧭 UI Hierarchy

### 01 — Navigation (Navbar)
- Atmos logo/name
- City search input
- Celsius/Fahrenheit toggle

### 02 — Weather Hero
```
REAL WEATHER · REAL TIME

Good Evening,
Kolkata IN

☀️

28°

Mostly Sunny
Feels like 29°C
```

### 03 — Weather Statistics (Glass Panel)
```
Humidity    Wind Speed    Pressure    Visibility
  62%        12 km/h      1012 hPa      10 km
```

### 04 — Forecast Section
- **Today**: date + icon + high/low + sunrise/sunset
- **Hourly**: 6-hour scrollable row (time | icon | temp)
- **Weekly**: 7-day list (day | icon | condition | high | low)

---

# 🌦️ Weather-Based Themes

| Condition     | Mood                   | Colors                          |
|---------------|------------------------|---------------------------------|
| ☀️ Clear      | Warm, bright, optimistic| Golden → Sky Blue → Deep Blue  |
| ☁️ Clouds     | Calm, soft, muted       | Blue-grey gradients             |
| 🌧️ Rain       | Cinematic, cool         | Deep navy → dark blue           |
| ⛈️ Thunderstorm| Dramatic, energetic   | Dark indigo, purple glow        |
| ❄️ Snow       | Clean, peaceful         | Icy blue → white                |
| 🌫️ Mist/Fog  | Quiet, mysterious       | Muted grey, low saturation      |

---

# 🎨 Color System

```
Primary Background  → #0F172A
Glass Surface       → rgba(255, 255, 255, 0.10)
Glass Border        → rgba(255, 255, 255, 0.18)
Primary Text        → #FFFFFF
Secondary Text      → rgba(255, 255, 255, 0.70)
Muted Text          → rgba(255, 255, 255, 0.40)
```

---

# 🔤 Typography

**Font: Josefin Sans**

```
Logo/Label      → 12–18px, tracking-widest, uppercase
City Name       → 48–64px, font-bold
Temperature     → 80–144px, font-black
Condition       → 18–24px, capitalize
Statistics      → 16–20px, font-semibold
Labels          → 12–14px, uppercase, tracking-widest
```

---

# 💎 Glassmorphism

```
Background:     rgba(255,255,255,0.10)
Backdrop blur:  20–30px
Border:         1px solid rgba(255,255,255,0.18)
Border-radius:  20–28px
Shadow:         soft, low-opacity
```

---

# ✨ Micro Interactions

- **Weather Card**: `opacity: 0, translateY(20px)` → `opacity: 1, translateY(0)`
- **Search**: hover brightness → focus glow → submit loading spinner
- **Unit Toggle**: inactive muted → active bright
- **Weather Icon**: Floating animation (up/down, 4s loop)
- **Stat Tiles**: `hover:scale-105` with smooth transition
- **Background**: 1.2s ease transition on weather change

---

# 📱 Responsive Design

**Mobile-first.**

- Desktop: Navbar → Hero → Stats → [Today | Hourly | Weekly] row
- Tablet: Same but slightly compressed
- Mobile: Stacked layout, cards full-width

---

# 🧩 Component File Structure

```
src/
├── types/
│   └── weather.ts
├── utils/
│   ├── weatherTheme.ts
│   ├── tempUtils.ts
│   └── mockForecast.ts
├── components/
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── UnitToggle.tsx
│   ├── WeatherHero.tsx
│   ├── WeatherStats.tsx
│   ├── TodayCard.tsx
│   ├── HourlyForecast.tsx
│   ├── WeeklyForecast.tsx
│   ├── Loader.tsx
│   └── ErrorMessage.tsx
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
└── styles/
    └── globals.css
```

---

# 🚀 Future UI Enhancements

- 🌅 Sunrise / sunset timeline
- 🌧️ Animated rainfall particles
- 🌬️ Wind particle animations
- 🌙 Dynamic night mode
- 📍 Current-location detection
- 🌡️ Interactive temperature graph
- 🏙️ Saved cities
- 🔔 Weather alerts
- 🗺️ Weather map overlay

---

## 📐 Design Goal

> **A window into the atmosphere, not just a weather dashboard.**

**Real weather. Real time.**
Built with **clean design, atmospheric visuals, responsive UI, and meaningful interaction.**
