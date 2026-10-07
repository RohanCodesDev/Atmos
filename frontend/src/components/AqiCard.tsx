import { Wind, Activity } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const AqiCard = ({ aqiData, isLightMode }: any) => {
  if (!aqiData || !aqiData.list || aqiData.list.length === 0) return null;

  const aqiObj = aqiData.list[0];
  const aqiLevel = aqiObj.main.aqi; // 1-5
  const components = aqiObj.components;

  const getAqiInfo = (level: number) => {
    switch (level) {
      case 1: return { label: 'Good', color: '#10B981', message: 'Air quality is considered satisfactory, and air pollution poses little or no risk.' };
      case 2: return { label: 'Fair', color: '#3B82F6', message: 'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people.' };
      case 3: return { label: 'Moderate', color: '#F59E0B', message: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.' };
      case 4: return { label: 'Poor', color: '#EF4444', message: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.' };
      case 5: return { label: 'Very Poor', color: '#8B5CF6', message: 'Health warnings of emergency conditions. The entire population is more likely to be affected.' };
      default: return { label: 'Unknown', color: '#9CA3AF', message: 'No data available.' };
    }
  };

  const info = getAqiInfo(aqiLevel);

  return (
    <div className="anim-fade-in-up delay-300">
      <TiltCard style={{ padding: '1.5rem 2rem' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <Activity size={16} /> Air Quality Index
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '12px', 
              background: info.color, display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontSize: '1.75rem', fontWeight: 700, color: '#fff', boxShadow: `0 0 20px ${info.color}80`, flexShrink: 0
            }}>
              {aqiLevel}
            </div>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: info.color }}>{info.label}</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem', lineHeight: 1.4 }}>{info.message}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flex: 1, borderLeft: `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, paddingLeft: '2rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>PM2.5</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{components.pm2_5.toFixed(1)}</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>PM10</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{components.pm10.toFixed(1)}</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>OZONE</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{components.o3.toFixed(1)}</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>NO2</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{components.no2.toFixed(1)}</span>
             </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
};
