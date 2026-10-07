import { Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const SunArc = ({ sunriseTime, sunsetTime, isLightMode, weatherData }: any) => {
  if (!weatherData || !weatherData.sys) return null;

  const now = Date.now() / 1000;
  const sr = weatherData.sys.sunrise;
  const ss = weatherData.sys.sunset;
  
  const isNight = now < sr || now > ss;
  
  let progress = 0;
  if (!isNight) {
    progress = (now - sr) / (ss - sr);
  } else {
    // Night time logic: tracking moon from sunset to sunrise
    if (now > ss) {
      const nextSunrise = sr + 86400; // approximate tomorrow's sunrise
      progress = (now - ss) / (nextSunrise - ss);
    } else {
      const lastSunset = ss - 86400; // approximate yesterday's sunset
      progress = (now - lastSunset) / (sr - lastSunset);
    }
  }

  // Math for positioning on a semi-circle (SVG)
  const cx = 150;
  const cy = 120;
  const r = 105;
  
  // Angle from Math.PI to 0
  const angle = Math.PI - (progress * Math.PI);
  const orbX = cx + r * Math.cos(angle);
  const orbY = cy - r * Math.sin(angle);

  const strokeColor = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';
  const activeColor = isNight ? '#E2E8F0' : '#F59E0B'; // Silver for Moon, Amber for Sun

  return (
    <div className="anim-fade-in-up delay-200">
      <TiltCard style={{ padding: '1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           {isNight ? <Moon size={16} /> : <Sun size={16} />} {isNight ? 'Moon Position' : 'Sun Position'}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', position: 'relative', height: '130px' }}>
          <svg width="300" height="150" viewBox="0 0 300 150">
            {/* Background Arc */}
            <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Filled Arc */}
            {progress > 0 && progress < 1 && (
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${orbX} ${orbY}`} fill="none" stroke={activeColor} strokeWidth="4" />
            )}

            {/* The Orb (Sun/Moon) */}
            <circle cx={orbX} cy={orbY} r="12" fill={activeColor} stroke="white" strokeWidth="3" />
          </svg>
          
          <div style={{ position: 'absolute', bottom: '0', left: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isNight ? <Sunset size={20} style={{ opacity: 0.7, marginBottom: '0.25rem' }} /> : <Sunrise size={20} style={{ opacity: 0.7, marginBottom: '0.25rem' }} />}
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isNight ? sunsetTime : sunriseTime}</span>
          </div>
          
          <div style={{ position: 'absolute', bottom: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isNight ? <Sunrise size={20} style={{ opacity: 0.7, marginBottom: '0.25rem' }} /> : <Sunset size={20} style={{ opacity: 0.7, marginBottom: '0.25rem' }} />}
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isNight ? sunriseTime : sunsetTime}</span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
};
