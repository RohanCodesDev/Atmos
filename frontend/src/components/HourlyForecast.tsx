import { Wind, Sun, CloudRain, CloudSnow, Cloud } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const HourlyForecast = ({ hourlyForecast, isLightMode, unitSymbol }: any) => {
  return (
    <div className="anim-fade-in-up delay-200">
      <TiltCard style={{ padding: '1.5rem 2rem' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <Wind size={16} /> Today's Forecast
         </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
          {hourlyForecast.length > 0 ? hourlyForecast.map((hf: any, i: number) => {
             const isRainy = hf.condition.includes('rain');
             const isSunny = hf.condition.includes('clear');
             const isSnow = hf.condition.includes('snow');
            return (
            <div 
              key={i} 
              style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', 
                minWidth: '55px', transition: 'transform 0.2s', cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: i === 0 ? 600 : 400 }}>{hf.time}</span>
              {isSunny ? <Sun size={24} /> : isRainy ? <CloudRain size={24} /> : isSnow ? <CloudSnow size={24} /> : <Cloud size={24} />}
              <span style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'capitalize', letterSpacing: '0.05em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textAlign: 'center' }}>
                <span>{hf.description || (isSunny ? 'Sunny' : isRainy ? 'Rain' : isSnow ? 'Snow' : 'Cloudy')}</span>
                <span style={{ color: isLightMode ? '#0369A1' : '#60A5FA', fontWeight: 700 }}>{hf.pop}%</span>
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{hf.temp}{unitSymbol}</span>
            </div>
          )}) : (
            <p style={{opacity: 0.5, fontSize: '0.9rem'}}>Loading hourly forecast...</p>
          )}
        </div>
      </TiltCard>
    </div>
  );
};
