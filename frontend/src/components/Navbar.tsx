import { Wind, Search, Navigation, Settings } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { useState, useEffect, useRef } from 'react';

export const Navbar = ({
  textColor, isLightMode, isControlsOpen, setIsControlsOpen, onSearch, onLocate, unit, setUnit
}: any) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error('Failed to fetch autocomplete suggestions');
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="navbar-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30, pointerEvents: 'none' }}>

      {/* Logo */}
      <div className="logo-container anim-fade-in" style={{ width: '200px', display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
        <img
          src="/atmoslogo.svg"
          alt="Atmos Logo"
          className="atmos-logo"
          style={{
            filter: isLightMode ? 'none' : 'invert(1) brightness(2)',
            cursor: 'pointer',
            transition: 'filter 0.5s ease'
          }}
        />
      </div>

      {/* Search Bar */}
      <div className="search-container anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '500px', pointerEvents: 'auto' }}>
        <style dangerouslySetInnerHTML={{
          __html: `
          .search-wrapper input::placeholder {
            color: ${textColor};
            opacity: 0.5;
          }
        `}} />
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
          <div className="search-wrapper glass" style={{ display: 'flex', alignItems: 'center', padding: '0.85rem 1.25rem', width: '100%', borderRadius: '50px' }}>
            <Search size={20} style={{ opacity: 0.6, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search for a city, state, or country..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearch) {
                  onSearch(query);
                  setShowDropdown(false);
                }
              }}
              style={{
                width: '100%',
                marginLeft: '0.75rem',
                fontSize: '1rem',
                background: 'transparent',
                border: 'none',
                color: textColor,
                outline: 'none',
                padding: 0
              }}
            />
          </div>
          
          {showDropdown && suggestions.length > 0 && (
            <div className="glass" style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 50,
              backdropFilter: 'blur(20px)',
              background: isLightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(20, 20, 20, 0.7)',
              border: isLightMode ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {suggestions.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setQuery(s.displayName);
                    setShowDropdown(false);
                    if (onSearch) onSearch(s.displayName);
                  }}
                  style={{
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    color: textColor,
                    borderBottom: idx < suggestions.length - 1 ? (isLightMode ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)') : 'none',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '2px' }}>
                    {[s.state, s.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <TiltCard style={{ borderRadius: '50px', padding: 0, flexShrink: 0 }}>
          <button title="Fetch your location" onClick={onLocate} style={{ padding: '0.9rem 1.2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', background: 'transparent', color: textColor }}>
            <Navigation size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Fetch Location</span>
          </button>
        </TiltCard>
      </div>

      {/* Settings Button & Unit Toggle (Top Right) */}
      <div className="settings-container" style={{ width: '200px', display: 'flex', justifyContent: 'flex-end', gap: '1rem', pointerEvents: 'auto' }}>
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
