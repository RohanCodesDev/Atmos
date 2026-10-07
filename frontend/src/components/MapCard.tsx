import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Map } from 'lucide-react';
import { TiltCard } from './TiltCard';

// Leaflet doesn't work with SSR, so we dynamically import it
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export const MapCard = ({ weatherData }: any) => {
  const [mounted, setMounted] = useState(false);
  const [layer, setLayer] = useState('precipitation_new');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !weatherData || !weatherData.coord) return null;

  const { lat, lon } = weatherData.coord;

  const layers = [
    { id: 'precipitation_new', label: 'Rain' },
    { id: 'temp_new', label: 'Temp' },
    { id: 'wind_new', label: 'Wind' },
    { id: 'clouds_new', label: 'Clouds' }
  ];

  return (
    <div className="anim-fade-in-up delay-400">
      <TiltCard style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, display: 'flex', gap: '0.5rem', alignItems: 'center', margin: 0 }}>
             <Map size={16} /> Interactive Radar
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {layers.map(l => (
              <button 
                key={l.id} 
                onClick={() => setLayer(l.id)}
                style={{
                  background: layer === l.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  border: 'none',
                  color: 'inherit',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: layer === l.id ? 700 : 400
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ height: '350px', width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
          <style>{`
            @keyframes radarSweep {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes pulsePing {
              0% { transform: scale(0.8); opacity: 0.8; }
              100% { transform: scale(3); opacity: 0; }
            }
            .dark-satellite {
              filter: brightness(0.4) contrast(1.2) saturate(0.5);
            }
            .radar-overlay {
              filter: saturate(3) contrast(1.5) drop-shadow(0 0 2px rgba(255,255,255,0.2));
            }
          `}</style>

          <MapContainer key={`${lat}-${lon}`} center={[lat, lon]} zoom={7} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false} attributionControl={false}>
            {/* Base Map */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              className="dark-satellite"
            />
            {/* Dynamic OpenWeather Layer */}
            <TileLayer
              key={layer}
              url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=0740cee4c4af3ecbafee9df1a6374526`}
              opacity={layer === 'clouds_new' ? 0.6 : 0.9}
              className="radar-overlay"
            />
          </MapContainer>

          {/* Radar Sweep Animation */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', width: '800px', height: '800px',
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(56, 189, 248, 0.1) 90%, rgba(56, 189, 248, 0.4) 100%)',
            borderRadius: '50%', pointerEvents: 'none', zIndex: 10,
            animation: 'radarSweep 4s infinite linear',
            transformOrigin: 'center center'
          }} />

          {/* Crosshair / Target */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 11, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '60px', height: '60px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '2px', height: '15px', background: 'rgba(255,255,255,0.6)', top: '-30px' }} />
            <div style={{ position: 'absolute', width: '2px', height: '15px', background: 'rgba(255,255,255,0.6)', bottom: '-30px' }} />
            <div style={{ position: 'absolute', width: '15px', height: '2px', background: 'rgba(255,255,255,0.6)', left: '-30px' }} />
            <div style={{ position: 'absolute', width: '15px', height: '2px', background: 'rgba(255,255,255,0.6)', right: '-30px' }} />
            {/* Center Ping */}
            <div style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 10px #38bdf8' }} />
            <div style={{ position: 'absolute', width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', animation: 'pulsePing 2s infinite ease-out' }} />
          </div>

          {/* Tech Data Overlay Panel */}
          <div style={{
            position: 'absolute', bottom: '1rem', left: '1rem', zIndex: 11, pointerEvents: 'none',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)', borderLeft: '3px solid #38bdf8',
            padding: '0.75rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.75rem',
            fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 5px #10b981' }} />
              <span style={{ fontWeight: 700, letterSpacing: '0.1em' }}>RADAR ONLINE</span>
            </div>
            <div style={{ opacity: 0.8 }}>LAT: {lat.toFixed(4)}°</div>
            <div style={{ opacity: 0.8 }}>LON: {lon.toFixed(4)}°</div>
            <div style={{ opacity: 0.8 }}>RES: 10KM/PX</div>
            <div style={{ color: '#38bdf8', marginTop: '0.25rem', fontWeight: 600 }}>ACTIVE: {layer.split('_')[0].toUpperCase()}</div>
          </div>
          
          {/* Compass / Nav */}
          <div style={{
             position: 'absolute', top: '1rem', right: '1rem', zIndex: 11, pointerEvents: 'none',
             width: '30px', height: '30px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)',
             background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
             display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)',
             fontSize: '0.65rem', fontWeight: 700
          }}>
            N
            <div style={{ position: 'absolute', top: '-6px', width: '0', height: '0', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #ef4444' }} />
          </div>
        </div>
      </TiltCard>
    </div>
  );
};
