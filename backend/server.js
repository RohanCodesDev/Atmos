const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint (For Render/Hosting)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Autocomplete Search Endpoint
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      throw new Error('Geocoding API error');
    }
    
    const geoData = await geoResponse.json();
    
    // Map data to a cleaner format and deduplicate similar names (optional)
    const suggestions = geoData.map(item => {
      const nameParts = [item.name, item.state, item.country].filter(Boolean);
      return {
        name: item.name,
        state: item.state,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        displayName: [...new Set(nameParts)].join(', ')
      };
    });

    res.json(suggestions);
  } catch (error) {
    console.error('Search API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

app.get('/api/weather', async (req, res) => {
  const { city, lat, lon, units = 'metric' } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: 'City or coordinates (lat, lon) are required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    let weatherData = null;
    let forecastData = null;
    let resolvedName = '';

    let searchQuery = city;

    if (lat && lon) {
      // 1. Fetch by exact coordinates
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
      
      const [wRes, fRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
      if (!wRes.ok) throw new Error(`Weather API error: ${wRes.statusText}`);
      
      weatherData = await wRes.json();
      forecastData = fRes.ok ? await fRes.json() : null;

      // Reverse geocode to get a better name instead of neighborhood
      try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0 && geoData[0].name) {
            weatherData.name = geoData[0].name;
          }
        }
      } catch (e) {
        console.error('Reverse Geocoding API Error:', e.message);
      }

    } else {
      // 2. Fetch by query string
      let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery)}&units=${units}&appid=${apiKey}`;
      let wRes = await fetch(weatherUrl);

      // 3. If standard search fails, fallback to Geocoding API (good for states/countries)
      if (wRes.status === 404) {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = geoResponse.ok ? await geoResponse.json() : [];
        
        if (geoData && geoData.length > 0) {
          const fallbackLat = geoData[0].lat;
          const fallbackLon = geoData[0].lon;
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${fallbackLat}&lon=${fallbackLon}&units=${units}&appid=${apiKey}`;
          wRes = await fetch(weatherUrl);
          
          // Construct nice resolved name without duplicates (e.g. avoids "IN, IN")
          const nameParts = [geoData[0].name, geoData[0].state, geoData[0].country].filter(Boolean);
          resolvedName = [...new Set(nameParts)].join(', ');
        }
      }

      if (!wRes.ok) {
        if (wRes.status === 404) return res.status(404).json({ error: 'Location not found' });
        throw new Error(`Weather API error: ${wRes.statusText}`);
      }
      
      weatherData = await wRes.json();
      
      if (resolvedName) {
        weatherData.name = resolvedName;
      }

      // Fetch forecast using the resolved coordinates
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&units=${units}&appid=${apiKey}`;
      const fRes = await fetch(forecastUrl);
      forecastData = fRes.ok ? await fRes.json() : null;
    }



    // Fetch Air Quality Index (AQI)
    let aqiData = null;
    try {
      const { lat: currentLat, lon: currentLon } = weatherData.coord;
      const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}`);
      if (aqiResponse.ok) {
        aqiData = await aqiResponse.json();
      }
    } catch (e) {
      console.error('AQI API Error:', e.message);
    }

    res.json({
      current: weatherData,
      forecast: forecastData,
      aqi: aqiData
    });

  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
