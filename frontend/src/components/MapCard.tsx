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
        
        <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
          <MapContainer key={`${lat}-${lon}`} center={[lat, lon]} zoom={7} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false} attributionControl={false}>
            {/* Base Map */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
            {/* Dynamic OpenWeather Layer */}
            <TileLayer
              key={layer}
              url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=0740cee4c4af3ecbafee9df1a6374526`}
              opacity={layer === 'temp_new' ? 0.4 : 0.8}
            />
          </MapContainer>
        </div>
      </TiltCard>
    </div>
  );
};
