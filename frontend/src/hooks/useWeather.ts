import { useState, useEffect, useRef } from 'react';

export const useWeather = (defaultCity: string = 'San Francisco') => {
  const [time, setTime] = useState<string>('morning');
  const [weather, setWeather] = useState<string>('sunny');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const lastParams = useRef<{city?: string, lat?: number, lon?: number}>({ city: defaultCity });

  const fetchWeatherData = async (params: {city?: string, lat?: number, lon?: number}) => {
    lastParams.current = params;
    setLoading(true);
    setError('');
    try {
      let url = `http://localhost:5000/api/weather?units=${unit}&`;
      if (params.city) url += `city=${encodeURIComponent(params.city)}`;
      else if (params.lat && params.lon) url += `lat=${params.lat}&lon=${params.lon}`;
      else return;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch weather');
      
      setWeatherData(data.current);
      setForecastData(data.forecast);
      setAqiData(data.aqi);
      
      const condition = data.current.weather[0].main.toLowerCase();
      if (condition.includes('clear')) setWeather('sunny');
      else if (condition.includes('cloud')) setWeather('cloudy');
      else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) setWeather('rainy');
      else if (condition.includes('snow')) setWeather('snow');
      else setWeather('cloudy');
      
      const now = Date.now() / 1000;
      if (now < data.current.sys.sunrise || now > data.current.sys.sunset) {
        setTime('night');
      } else if (now < data.current.sys.sunrise + 10800) {
        setTime('morning');
      } else if (now > data.current.sys.sunset - 10800) {
        setTime('evening');
      } else {
        setTime('noon');
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCity = (city: string) => fetchWeatherData({ city });

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError(`Geolocation failed: ${error.message}. Please check browser permissions.`);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    fetchWeatherData(lastParams.current);
  }, [unit]);

  return {
    time, setTime,
    weather, setWeather,
    weatherData, forecastData, aqiData,
    loading, error,
    searchCity, locateMe,
    unit, setUnit
  };
};
