import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const WeeklyForecast = ({ dailyForecast, isLightMode, unitSymbol }: any) => {
  return (
    <div className="anim-fade-in-up delay-100" style={{ display: 'flex', flex: 1 }}>
      <TiltCard style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
         <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <Cloud size={16} /> 5-Day Forecast
         </h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, justifyContent: 'space-between' }}>
           {dailyForecast.length > 0 ? dailyForecast.map((df: any, i: number) => {
             const isRainy = df.condition.includes('rain');
             const isSunny = df.condition.includes('clear');
             const isSnow = df.condition.includes('snow');
             return (
             <div 
               key={df.day + i} 
               style={{ 
                 display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                 paddingBottom: i !== dailyForecast.length-1 ? '0.5rem' : 0, 
                 borderBottom: i !== dailyForecast.length-1 ? `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}` : 'none',
                 transition: 'transform 0.2s', cursor: 'default'
               }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
             >
               <span style={{ width: '50px', fontSize: '0.9rem', fontWeight: df.day === 'Today' ? 600 : 400, opacity: df.day === 'Today' ? 1 : 0.8 }}>{df.day}</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100px' }}>
                 {isSunny ? <Sun size={16} opacity={0.9} /> : isRainy ? <CloudRain size={16} opacity={0.9} /> : isSnow ? <CloudSnow size={16} opacity={0.9}/> : <Cloud size={16} opacity={0.9} />}
                 <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                   {df.description || (isSunny ? 'Sunny' : isRainy ? 'Rainy' : isSnow ? 'Snow' : 'Cloudy')}
                 </span>
               </div>
               <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                 <span style={{ opacity: 0.6 }}>{df.tempMin}{unitSymbol}</span>
                 <span style={{ fontWeight: 500 }}>{df.tempMax}{unitSymbol}</span>
               </div>
             </div>
           )}) : (
             <p style={{opacity: 0.5, fontSize: '0.9rem'}}>Loading forecast...</p>
           )}
         </div>
      </TiltCard>
    </div>
  );
};
