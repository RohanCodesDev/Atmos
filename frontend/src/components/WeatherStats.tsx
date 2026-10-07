import { Thermometer, Wind, Sunrise, Sunset, Droplets, Eye, Gauge } from 'lucide-react';
import { MetricCard } from './MetricCard';

export const WeatherStats = ({ 
  feelsLike, currentTemp, windSpeed, time, sunriseTime, sunsetTime, humidity, visibility, pressure, unitSymbol, unit 
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
          sub="Current wind speed" 
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
          value={`${visibility} mi`} 
          sub={(visibility as number) > 5 ? 'Perfectly clear view.' : 'Reduced visibility.'} 
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
