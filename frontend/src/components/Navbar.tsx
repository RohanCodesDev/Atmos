import { Wind, Search, Navigation, Settings } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const Navbar = ({ 
  textColor, isLightMode, isControlsOpen, setIsControlsOpen, onSearch, onLocate, unit, setUnit 
}: any) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30, pointerEvents: 'none' }}>
      
      {/* Logo */}
      <div style={{ pointerEvents: 'auto' }}>
        <TiltCard glass={false} className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '200px', cursor: 'pointer' }}>
          <Wind size={32} strokeWidth={2.5} />
          <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>ATMOS</span>
        </TiltCard>
      </div>

      {/* Search Bar */}
      <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '500px', pointerEvents: 'auto' }}>
        <TiltCard style={{ position: 'relative', width: '100%', borderRadius: '50px', padding: 0 }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
          <input 
            type="text" 
            placeholder="Search for a city..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearch) {
                onSearch(e.currentTarget.value);
              }
            }}
            style={{ 
              width: '100%', 
              padding: '0.85rem 1rem 0.85rem 3.5rem', 
              borderRadius: '50px', 
              fontSize: '1rem',
              background: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
              color: textColor,
              outline: 'none',
              transition: 'background 0.3s'
            }}
            onFocus={(e) => e.target.style.background = isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}
            onBlur={(e) => e.target.style.background = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'}
          />
        </TiltCard>
        <TiltCard style={{ borderRadius: '50px', padding: 0, flexShrink: 0 }}>
          <button title="Fetch your location" onClick={onLocate} style={{ padding: '0.9rem 1.2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', background: 'transparent', color: textColor }}>
            <Navigation size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Fetch Location</span>
          </button>
        </TiltCard>
      </div>
      
      {/* Settings Button & Unit Toggle (Top Right) */}
      <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end', gap: '1rem', pointerEvents: 'auto' }}>
        <TiltCard style={{ borderRadius: '50px', padding: 0 }}>
          <button 
            title="Toggle Units"
            onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
            style={{ 
              padding: '0.9rem 1.2rem', 
              borderRadius: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              border: 'none', 
              background: 'transparent', 
              color: textColor,
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            <span style={{ opacity: unit === 'metric' ? 1 : 0.4 }}>°C</span>
            <span style={{ margin: '0 4px', opacity: 0.3 }}>|</span>
            <span style={{ opacity: unit === 'imperial' ? 1 : 0.4 }}>°F</span>
          </button>
        </TiltCard>
        <TiltCard style={{ borderRadius: '50%', padding: 0 }}>
          <button 
            title="Developer Controls"
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            style={{ 
              padding: '0.9rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              border: 'none', 
              background: 'transparent', 
              color: textColor,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isControlsOpen ? 'rotate(90deg)' : 'rotate(0deg)'
            }}
          >
            <Settings size={22} />
          </button>
        </TiltCard>
      </div>
    </div>
  );
};
