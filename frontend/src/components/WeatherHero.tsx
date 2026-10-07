import { MapPin, AlertCircle, Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { AlertBanner } from './AlertBanner';

export const WeatherHero = ({ 
  weather, isLightMode, cityName, currentTemp, time, description, highTemp, lowTemp, unitSymbol, weatherData
}: any) => {
  const HeroIcon = weather === 'sunny' ? Sun : weather === 'cloudy' ? Cloud : weather === 'rainy' ? CloudRain : CloudSnow;

  return (
    <div className="anim-fade-in-up">
      <TiltCard className="weather-hero-card" style={{ padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.9, fontSize: '1.2rem', fontWeight: 400 }}>
            <MapPin size={20} />
            <span>{cityName}</span>
          </div>
          <HeroIcon className="weather-hero-icon" size={90} strokeWidth={1} style={{ margin: '0.5rem 0' }} />
          <h1 className="weather-hero-temp" style={{ fontSize: '6rem', fontWeight: 300, letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
            {currentTemp}<span style={{ fontSize: '3.5rem', opacity: 0.8, fontWeight: 200, verticalAlign: 'top', marginLeft: '0.2rem' }}>{unitSymbol}</span>
          </h1>
          <p style={{ opacity: 0.8, fontSize: '1.25rem', textTransform: 'capitalize', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
            {time} • {description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', opacity: 0.9, fontSize: '1.2rem', fontWeight: 500 }}>
            <span>H: {highTemp}{unitSymbol}</span>
            <span>L: {lowTemp}{unitSymbol}</span>
          </div>

          <div style={{ marginTop: '1rem', width: '100%' }}>
            <AlertBanner weatherData={weatherData} />
          </div>
        </div>
      </TiltCard>
    </div>
  );
};
