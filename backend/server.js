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

    let weatherUrl = '';
    let forecastUrl = '';
    let finalLat = lat;
    let finalLon = lon;
    let resolvedName = '';

    // If coordinates are not provided, resolve the city/location name using Geocoding API
    if (!finalLat || !finalLon) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        throw new Error(`Geocoding API error: ${geoResponse.statusText}`);
      }
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        return res.status(404).json({ error: 'Location not found' });
      }
      
      finalLat = geoData[0].lat;
      finalLon = geoData[0].lon;
      
      // If state and country are available, construct a nicer name (e.g. "Dallas, Texas, US")
      const nameParts = [geoData[0].name, geoData[0].state, geoData[0].country].filter(Boolean);
      resolvedName = nameParts.join(', ');
    }

    // Now always use lat/lon for weather and forecast APIs
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${finalLat}&lon=${finalLon}&units=${units}&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${finalLat}&lon=${finalLon}&units=${units}&appid=${apiKey}`;

    // Call OpenWeather Current Weather API
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return res.status(404).json({ error: 'Location not found' });
      }
      throw new Error(`OpenWeather API error: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // If we resolved the name via direct geocoding, use that beautiful string!
    if (resolvedName) {
      weatherData.name = resolvedName;
    }

    // If using coordinates directly (e.g. from the Fetch Location button), OpenWeather often returns the neighborhood name.
    // We use the Reverse Geocoding API to get the actual city name (e.g. "Kolkata").
    if (lat && lon) {
      try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0 && geoData[0].name) {
            weatherData.name = geoData[0].name;
          }
        }
      } catch (e) {
        console.error('Geocoding API Error:', e.message);
      }
    }

    // Call OpenWeather Forecast API (5 day / 3 hour)
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

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
