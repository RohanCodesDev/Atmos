import { Sun, Sunrise, Sunset } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const SunArc = ({ sunriseTime, sunsetTime, isLightMode, weatherData }: any) => {
  if (!weatherData || !weatherData.sys) return null;

  const now = Date.now() / 1000;
  const sr = weatherData.sys.sunrise;
  const ss = weatherData.sys.sunset;
  
  // Calculate progress 0 to 1
  let progress = 0;
  if (now > ss) progress = 1;
  else if (now > sr) progress = (now - sr) / (ss - sr);

  // Math for positioning on a semi-circle (SVG)
  const cx = 150;
  const cy = 100;
  const r = 120;
  
  // Angle from Math.PI to 0
  const angle = Math.PI - (progress * Math.PI);
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const strokeColor = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';
  const activeColor = '#F59E0B'; // Amber

  return (
    <div className="anim-fade-in-up delay-200">
      <TiltCard style={{ padding: '1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <Sun size={16} /> Sun Position
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', position: 'relative', height: '130px' }}>
          <svg width="300" height="150" viewBox="0 0 300 150">
            {/* Background Arc */}
            <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Filled Arc */}
            {progress > 0 && progress < 1 && (
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`} fill="none" stroke={activeColor} strokeWidth="4" />
            )}
            {(progress >= 1) && (
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={activeColor} strokeWidth="4" />
            )}

            {/* The Sun */}
            <circle cx={sunX} cy={sunY} r="12" fill={activeColor} stroke="white" strokeWidth="3" />
          </svg>
          
          <div style={{ position: 'absolute', bottom: '0', left: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Sunrise size={20} style={{ opacity: 0.7, marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{sunriseTime}</span>
          </div>
          
          <div style={{ position: 'absolute', bottom: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Sunset size={20} style={{ opacity: 0.7, marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{sunsetTime}</span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
};
