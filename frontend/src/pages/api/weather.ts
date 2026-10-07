import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city as string)}&units=${units}&appid=${apiKey}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city as string)}&units=${units}&appid=${apiKey}`;
    }

    // Call OpenWeather Current Weather API
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return res.status(404).json({ error: 'Location not found' });
      }
      throw new Error(`OpenWeather API error: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // If using coordinates, Reverse Geocoding API to get actual city name
    if (lat && lon) {
      try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0 && geoData[0].name) {
            weatherData.name = geoData[0].name;
          }
        }
      } catch (e: any) {
        console.error('Geocoding API Error:', e.message);
      }
    }

    // Call OpenWeather Forecast API
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
    } catch (e: any) {
      console.error('AQI API Error:', e.message);
    }

    res.status(200).json({
      current: weatherData,
      forecast: forecastData,
      aqi: aqiData
    });

  } catch (error: any) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
