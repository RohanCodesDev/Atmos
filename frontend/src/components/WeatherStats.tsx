import { Thermometer, Wind, Sunrise, Sunset, Droplets, Eye, Gauge, Navigation } from 'lucide-react';
import { MetricCard } from './MetricCard';

export const WeatherStats = ({ 
  feelsLike, currentTemp, windSpeed, windDeg, time, sunriseTime, sunsetTime, humidity, visibility, pressure, unitSymbol, unit 
}: any) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1 }}>
       <MetricCard 
          delay="delay-100" 
          title="Feels Like" 
          icon={Thermometer} 
          value={`${feelsLike}${unitSymbol}`} 
          sub={feelsLike > (currentTemp as number) ? 'Humidity making it feel warmer.' : feelsLike < (currentTemp as number) ? 'Wind making it feel cooler.' : 'Feels exactly like the actual temperature.'} 
       />
       <MetricCard 
          delay="delay-200" 
          title="Wind" 
          icon={Wind} 
          value={`${windSpeed} ${unit === 'metric' ? 'km/h' : 'mph'}`} 
          sub={(
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Navigation size={12} style={{ transform: `rotate(${windDeg}deg)` }} />
              <span>Current wind speed</span>
            </div>
          )}
       />
       <MetricCard 
          delay="delay-300" 
          title={time === 'night' ? 'Sunrise' : 'Sunset'} 
          icon={time === 'night' ? Sunrise : Sunset} 
          value={time === 'night' ? sunriseTime : sunsetTime} 
          sub={time === 'night' ? 'Next morning' : 'Later today'} 
       />
       <MetricCard 
          delay="" 
          title="Humidity" 
          icon={Droplets} 
          value={`${humidity}%`} 
          sub="Current relative humidity" 
       />
       <MetricCard 
          delay="delay-100" 
          title="Visibility" 
          icon={Eye} 
          value={`${visibility} ${unit === 'metric' ? 'km' : 'mi'}`} 
          sub={(visibility as number) > (unit === 'metric' ? 8 : 5) ? 'Perfectly clear view.' : 'Reduced visibility.'} 
       />
       <MetricCard 
          delay="delay-200" 
          title="Pressure" 
          icon={Gauge} 
          value={`${pressure} hPa`} 
          sub="Current atmospheric pressure" 
       />
    </div>
  );
};
