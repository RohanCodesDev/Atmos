import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Sunrise, Sun, Sunset, Moon, Cloud, CloudRain, CloudSnow, Loader2
} from 'lucide-react';
import { GRADIENTS } from '../config/weather';

import { Navbar } from '../components/Navbar';
import { ControlPanel } from '../components/ControlPanel';
import { BackgroundGradient, SnowEffect, RainEffect } from '../components/WeatherEffects';
import { WeatherHero } from '../components/WeatherHero';
import { WeeklyForecast } from '../components/WeeklyForecast';
import { HourlyForecast } from '../components/HourlyForecast';
import { WeatherStats } from '../components/WeatherStats';
import { AqiCard } from '../components/AqiCard';
import { PrecipitationChart } from '../components/PrecipitationChart';
import { SunArc } from '../components/SunArc';
const TEMP_MAP: Record<string, string> = {
  sunny: '75', cloudy: '62', rainy: '55', snow: '28',
};

import { useWeather } from '../hooks/useWeather';

export default function Home() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const { 
    time, setTime, weather, setWeather, weatherData, forecastData, aqiData,
    loading, error, searchCity, locateMe, unit, setUnit
  } = useWeather('San Francisco');

  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  const currentGradient = GRADIENTS[time]?.[weather] || GRADIENTS['morning']['sunny'];
  
  const LIGHT_MODE_CONDITIONS = [
    'morning-sunny', 'morning-cloudy', 'morning-snow',
    'noon-sunny', 'noon-cloudy', 'noon-snow'
  ];
  const isLightMode = LIGHT_MODE_CONDITIONS.includes(`${time}-${weather}`);
  const textColor = isLightMode ? '#1e293b' : 'white';

  const timeOptions = [
    { id: 'morning', label: 'Morning', icon: Sunrise },
    { id: 'noon', label: 'Noon', icon: Sun },
    { id: 'evening', label: 'Evening', icon: Sunset },
    { id: 'night', label: 'Night', icon: Moon },
  ];

  const weatherOptions = [
    { id: 'sunny', label: 'Sunny', icon: Sun },
    { id: 'cloudy', label: 'Cloudy', icon: Cloud },
    { id: 'rainy', label: 'Rainy', icon: CloudRain },
    { id: 'snow', label: 'Snow', icon: CloudSnow },
  ];

  // Real Data Mappings
  const currentTemp = weatherData ? Math.round(weatherData.main.temp) : TEMP_MAP[weather];
  const feelsLike = weatherData ? Math.round(weatherData.main.feels_like) : parseInt(currentTemp as string) + (weather === 'sunny' ? 3 : -4);
  const cityName = weatherData ? `${weatherData.name}, ${weatherData.sys.country}` : 'San Francisco, CA';
  const description = weatherData ? weatherData.weather[0].description : weather;
  const humidity = weatherData ? weatherData.main.humidity : (weather === 'rainy' ? 88 : 45);
  const windSpeed = weatherData 
    ? (unit === 'metric' ? Math.round(weatherData.wind.speed * 3.6) : Math.round(weatherData.wind.speed)) 
    : (weather === 'snow' ? 18 : 12);
  const windDeg = weatherData ? weatherData.wind.deg : 0;
  const pressure = weatherData ? weatherData.main.pressure : 1012;
  const visibility = weatherData ? (weatherData.visibility / 1609).toFixed(1) : (weather === 'rainy' ? 2.5 : 10);
  const highTemp = weatherData ? Math.round(weatherData.main.temp_max) : parseInt(currentTemp as string) + 5;
  const lowTemp = weatherData ? Math.round(weatherData.main.temp_min) : parseInt(currentTemp as string) - 5;

  const formatLocalTime = (unixTimestamp: number, tzOffset: number) => {
    const d = new Date((unixTimestamp + tzOffset) * 1000);
    return d.toLocaleTimeString([], {timeZone: 'UTC', hour: '2-digit', minute:'2-digit'});
  };

  const sunriseTime = weatherData ? formatLocalTime(weatherData.sys.sunrise, weatherData.timezone) : '6:42 AM';
  const sunsetTime = weatherData ? formatLocalTime(weatherData.sys.sunset, weatherData.timezone) : '7:15 PM';

  const formatDescription = (desc: string) => {
    switch (desc.toLowerCase()) {
      case 'few clouds':
      case 'scattered clouds':
        return 'Partly Cloudy';
      case 'broken clouds':
      case 'overcast clouds':
        return 'Mostly Cloudy';
      case 'clear sky':
        return 'Clear Sky';
      case 'light rain':
        return 'Light Rain';
      case 'moderate rain':
        return 'Rain';
      default:
        return desc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  };

  const getDailyForecast = () => {
    if (!forecastData || !forecastData.list) return [];
    const tzOffset = forecastData.city.timezone;
    const dailyMap = new Map<string, any>();
    
    const targetCityToday = new Date(Date.now() + new Date().getTimezoneOffset() * 60000 + tzOffset * 1000)
      .toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' });

    for (const item of forecastData.list) {
      const date = new Date((item.dt + tzOffset) * 1000);
      const day = date.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' });
      const localHour = date.getUTCHours();
      
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day: day === targetCityToday ? 'Today' : day,
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          condition: item.weather[0].main.toLowerCase(),
          description: formatDescription(item.weather[0].description),
          isNoon: localHour >= 11 && localHour <= 15
        });
      } else {
        const existing = dailyMap.get(day);
        existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
        existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
        // Use daytime icon if available
        if (localHour >= 11 && localHour <= 15 && !existing.isNoon) {
          existing.condition = item.weather[0].main.toLowerCase();
          existing.description = formatDescription(item.weather[0].description);
          existing.isNoon = true;
        }
      }
    }
    
    return Array.from(dailyMap.values()).slice(0, 5).map(d => ({
      ...d,
      tempMax: Math.round(d.tempMax),
      tempMin: Math.round(d.tempMin)
    }));
  };

  const getHourlyForecast = () => {
    if (!forecastData || !forecastData.list) return [];
    const tzOffset = forecastData.city.timezone;
    return forecastData.list.slice(0, 8).map((item: any, i: number) => {
      const date = new Date((item.dt + tzOffset) * 1000);
      let hour = date.getUTCHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      return {
        time: i === 0 ? 'Now' : `${hour} ${ampm}`,
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main.toLowerCase(),
        description: formatDescription(item.weather[0].description),
        pop: Math.round(item.pop * 100)
      };
    });
  };

  const dailyForecast = getDailyForecast();
  const hourlyForecast = getHourlyForecast();
  
  const todayForecast = dailyForecast.find(d => d.day === 'Today') || dailyForecast[0];
  const displayHighTemp = todayForecast ? todayForecast.tempMax : highTemp;
  const displayLowTemp = todayForecast ? todayForecast.tempMin : lowTemp;

  const pageTitle = weatherData ? `Weather in ${weatherData.name} | Atmos` : 'Atmos - Premium Weather Dashboard';
  const pageDescription = weatherData 
    ? `Current weather in ${weatherData.name}: ${Math.round(weatherData.main.temp)}°${unit === 'metric' ? 'C' : 'F'}, ${weatherData.weather[0].description}. Get the 5-day forecast, air quality index, and live weather conditions on Atmos.`
    : 'Atmos is a highly accurate, beautifully designed global weather dashboard providing real-time forecasts, AQI, and dynamic weather visuals.';
  const pageUrl = 'https://atmos-weather.vercel.app';
  const pageImage = `${pageUrl}/atmoslogo.svg`; // Replace with actual banner if available

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="weather, forecast, atmos, live weather, weather dashboard, aqi, precipitation, temperature, climate" />
        <meta name="author" content="RohanCodesDev" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content={isLightMode ? '#ffffff' : '#000000'} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="Atmos Weather" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* Canonical Link */}
        <link rel="canonical" href={pageUrl} />
        <meta name="robots" content="index, follow" />
      </Head>
      <div 
        style={{
          minHeight: '100vh', width: '100vw', transition: 'color 1.5s ease',
          color: textColor, position: 'relative', overflowX: 'hidden',
          overflowY: 'auto', display: 'flex', justifyContent: 'center',
          '--glass-bg': isLightMode ? 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
          '--glass-bg-hover': isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.12)',
          '--glass-border': isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.1)',
          '--glass-border-light': isLightMode ? 'rgba(0,0,0,0.15)' : 'rgba(255, 255, 255, 0.4)',
          '--glass-highlight': isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.2)',
          '--glass-highlight-subtle': isLightMode ? 'rgba(0,0,0,0.02)' : 'rgba(255, 255, 255, 0.1)',
          '--glass-shadow': isLightMode ? '0 10px 40px -10px rgba(0, 0, 0, 0.1)' : '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
          '--glass-shadow-hover': isLightMode ? '0 12px 40px 0 rgba(0, 0, 0, 0.15)' : '0 12px 40px 0 rgba(0, 0, 0, 0.35)',
        } as React.CSSProperties}
      >
        <BackgroundGradient currentGradient={currentGradient} />
        {weather === 'snow' && <SnowEffect />}
        {weather === 'rainy' && <RainEffect />}

        <Navbar 
          textColor={textColor} 
          isLightMode={isLightMode} 
          isControlsOpen={isControlsOpen} 
          setIsControlsOpen={setIsControlsOpen} 
          onSearch={searchCity}
          onLocate={locateMe}
          unit={unit}
          setUnit={setUnit}
        />

        {error && (
          <div style={{ position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            {error}
          </div>
        )}

        {loading && (
          <div 
            className="anim-fade-in"
            style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              zIndex: 50, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: textColor,
              pointerEvents: 'none'
            }}
          >
            <div className="anim-spin">
              <Loader2 size={64} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>
              Fetching Atmosphere
            </span>
          </div>
        )}

        <div className="dashboard-wrapper dashboard-layout" style={{ zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: '2rem', width: '100%', maxWidth: '1400px', boxSizing: 'border-box', opacity: loading ? 0.3 : 1, transition: 'opacity 0.5s ease', pointerEvents: loading ? 'none' : 'auto' }}>
          
          <div className="left-column" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <WeatherHero 
              weather={weather}
              isLightMode={isLightMode}
              cityName={cityName}
              currentTemp={currentTemp}
              time={time}
              description={description}
              highTemp={displayHighTemp}
              lowTemp={displayLowTemp}
              unitSymbol={unitSymbol}
              weatherData={weatherData}
            />
            <WeeklyForecast 
              dailyForecast={dailyForecast}
              isLightMode={isLightMode}
              unitSymbol={unitSymbol}
            />

            <SunArc 
              sunriseTime={sunriseTime}
              sunsetTime={sunsetTime}
              isLightMode={isLightMode}
              weatherData={weatherData}
            />
          </div>

          <div className="right-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Today's Forecast */}
            <HourlyForecast 
              hourlyForecast={hourlyForecast}
              isLightMode={isLightMode}
              unitSymbol={unitSymbol}
            />
            
            {/* 2. Small Tiled Feature Cards */}
            <WeatherStats 
              feelsLike={feelsLike}
              currentTemp={currentTemp}
              windSpeed={windSpeed}
              windDeg={windDeg}
              time={time}
              sunriseTime={sunriseTime}
              sunsetTime={sunsetTime}
              humidity={humidity}
              visibility={visibility}
              pressure={pressure}
              unitSymbol={unitSymbol}
              unit={unit}
            />

            {/* 3. Big Cards */}
            <PrecipitationChart 
              hourlyForecast={hourlyForecast}
              isLightMode={isLightMode}
              unitSymbol={unitSymbol}
            />
            <AqiCard 
              aqiData={aqiData}
              isLightMode={isLightMode}
            />
          </div>
        </div>

        <ControlPanel 
          isControlsOpen={isControlsOpen}
          isLightMode={isLightMode}
          textColor={textColor}
          time={time}
          setTime={setTime}
          weather={weather}
          setWeather={setWeather}
          timeOptions={timeOptions}
          weatherOptions={weatherOptions}
        />
      </div>
    </>
  );
}
