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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !weatherData || !weatherData.coord) return null;

  const { lat, lon } = weatherData.coord;

  return (
    <div className="anim-fade-in-up delay-400">
      <TiltCard style={{ padding: '1.5rem 2rem' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <Map size={16} /> Interactive Precipitation Radar
        </h3>
        
        <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
          <MapContainer center={[lat, lon]} zoom={7} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false} attributionControl={false}>
            {/* Base Map */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {/* OpenWeather Precipitation Layer */}
            <TileLayer
              url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=ce3419bbba0a850ca962f2cc309b8b0f`}
              opacity={0.7}
            />
          </MapContainer>
        </div>
      </TiltCard>
    </div>
  );
};
