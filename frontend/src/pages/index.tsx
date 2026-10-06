import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { 
  Sunrise, Sun, Sunset, Moon, Cloud, CloudRain, CloudSnow, 
  Wind, MapPin, Droplets, SunMedium, Search, Navigation, 
  Thermometer, Activity
} from 'lucide-react';
import { GRADIENTS } from '../config/weather';

// --- Particle Effects ---

const SnowEffect = () => {
  const [flakes, setFlakes] = useState<any[]>([]);
  useEffect(() => {
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 3 + 4}s`,
      animationDelay: `${Math.random() * -5}s`,
      width: `${Math.random() * 6 + 4}px`,
      height: `${Math.random() * 6 + 4}px`
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="weather-container">
      {flakes.map((f) => (
        <div key={f.id} className="flake" style={{
          left: f.left,
          animationDuration: f.animationDuration,
          animationDelay: f.animationDelay,
          width: f.width,
          height: f.height
        }} />
      ))}
    </div>
  );
};

const RainEffect = () => {
  const [drops, setDrops] = useState<any[]>([]);
  useEffect(() => {
    const newDrops = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 0.4 + 0.6}s`,
      animationDelay: `${Math.random() * -2}s`,
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="weather-container">
      {drops.map((d) => (
        <div key={d.id} className="drop" style={{
          left: d.left,
          animationDuration: d.animationDuration,
          animationDelay: d.animationDelay
        }} />
      ))}
    </div>
  );
};

// --- Components ---

const TiltCard = ({ children, className = '', style = {}, glass = true }: any) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Calculate rotation: max 12 degrees for noticeable parallax
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`${glass ? 'glass' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: rotate.x === 0 && rotate.y === 0 ? 'transform 0.5s ease-out' : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{ transform: 'translateZ(30px)', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

const MetricCard = ({ title, icon: Icon, value, sub, delay }: any) => (
  <div className={`anim-fade-in-up ${delay}`} style={{ display: 'flex' }}>
    <TiltCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
        <Icon size={18} />
        <span>{title}</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>
        {sub}
      </div>
    </TiltCard>
  </div>
);

// --- Background Crossfader ---

const BackgroundGradient = ({ currentGradient }: { currentGradient: string }) => {
  const [prevGradient, setPrevGradient] = useState(currentGradient);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (currentGradient !== prevGradient) {
      setFade(true);
      const timer = setTimeout(() => {
        setPrevGradient(currentGradient);
        setFade(false);
      }, 1500); // 1.5s transition
      return () => clearTimeout(timer);
    }
  }, [currentGradient, prevGradient]);

  return (
    <>
      <div 
        style={{
          position: 'absolute', inset: 0, zIndex: -2,
          background: prevGradient
        }}
      />
      <div 
        style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: currentGradient,
          opacity: fade ? 1 : 0,
          transition: fade ? 'opacity 1.5s ease-in-out' : 'none',
        }}
      />
    </>
  );
};

// --- Main App ---

const TEMP_MAP: Record<string, string> = {
  sunny: '75',
  cloudy: '62',
  rainy: '55',
  snow: '28',
};

export default function Home() {
  const [time, setTime] = useState<string>('morning');
  const [weather, setWeather] = useState<string>('sunny');

  const currentGradient = GRADIENTS[time]?.[weather] || GRADIENTS['morning']['sunny'];
  const currentTemp = TEMP_MAP[weather];

  // Determine if the current background is light enough to need dark text
  const LIGHT_MODE_CONDITIONS = [
    'morning-sunny', 'morning-cloudy', 'morning-snow',
    'noon-sunny', 'noon-cloudy', 'noon-snow'
  ];
  const isLightMode = LIGHT_MODE_CONDITIONS.includes(`${time}-${weather}`);
  const textColor = isLightMode ? '#1e293b' : 'white';

  const timeOptions = [
    { id: 'morning', label: 'Morning', icon: Sunrise },
    { id: 'noon', label: 'Noon', icon: Sun },
    { id: 'evening', label: 'Evening', icon: Sunset },
    { id: 'night', label: 'Night', icon: Moon },
  ];

  const weatherOptions = [
    { id: 'sunny', label: 'Sunny', icon: Sun },
    { id: 'cloudy', label: 'Cloudy', icon: Cloud },
    { id: 'rainy', label: 'Rainy', icon: CloudRain },
    { id: 'snow', label: 'Snow', icon: CloudSnow },
  ];

  const HeroIcon = weather === 'sunny' ? Sun : weather === 'cloudy' ? Cloud : weather === 'rainy' ? CloudRain : CloudSnow;

  return (
    <>
      <Head>
        <title>Atmos - Weather Dashboard</title>
      </Head>
      <div 
        style={{
          minHeight: '100vh',
          width: '100vw',
          transition: 'color 1.5s ease',
          color: textColor,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          // Pass dynamic CSS variables for the glassmorphism theme
          '--glass-bg': isLightMode ? 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
          '--glass-bg-hover': isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.12)',
          '--glass-border': isLightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.1)',
          '--glass-border-light': isLightMode ? 'rgba(0,0,0,0.15)' : 'rgba(255, 255, 255, 0.4)',
          '--glass-highlight': isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.2)',
          '--glass-highlight-subtle': isLightMode ? 'rgba(0,0,0,0.02)' : 'rgba(255, 255, 255, 0.1)',
          '--glass-shadow': isLightMode ? '0 10px 40px -10px rgba(0, 0, 0, 0.1)' : '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
          '--glass-shadow-hover': isLightMode ? '0 12px 40px 0 rgba(0, 0, 0, 0.15)' : '0 12px 40px 0 rgba(0, 0, 0, 0.35)',
        } as React.CSSProperties}
      >
        <BackgroundGradient currentGradient={currentGradient} />
        {weather === 'snow' && <SnowEffect />}
        {weather === 'rainy' && <RainEffect />}

        {/* Top Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 }}>
          
          {/* Logo (Now with Tilt!) */}
          <TiltCard glass={false} className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '200px', cursor: 'pointer' }}>
            <Wind size={32} strokeWidth={2.5} />
            <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>ATMOS</span>
          </TiltCard>

          {/* Search Bar (Now with Tilt!) */}
          <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '500px' }}>
            <TiltCard style={{ position: 'relative', width: '100%', borderRadius: '50px', padding: 0 }}>
              <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
              <input 
                type="text" 
                placeholder="Search for a city..." 
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem 0.85rem 3.5rem', 
                  borderRadius: '50px', 
                  fontSize: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: textColor,
                  outline: 'none',
                  transition: 'background 0.3s'
                }}
                onFocus={(e) => e.target.style.background = isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'}
                onBlur={(e) => e.target.style.background = 'transparent'}
              />
            </TiltCard>
            <TiltCard style={{ borderRadius: '50%', padding: 0, flexShrink: 0 }}>
              <button title="Locate Me" style={{ padding: '0.9rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'transparent', color: textColor }}>
                <Navigation size={20} />
              </button>
            </TiltCard>
          </div>
          
          <div style={{ width: '200px' }}></div> 
        </div>

        {/* Main Layout Grid */}
        <div style={{ zIndex: 10, display: 'flex', gap: '2rem', width: '100%', maxWidth: '1400px', padding: '7rem 2rem 2rem 2rem', paddingRight: '280px', height: '100vh', boxSizing: 'border-box' }}>
          
          {/* Left Column (Hero + Weekly) */}
          <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hero Card */}
            <div className="anim-fade-in-up">
              <TiltCard style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9, fontSize: '1.2rem', fontWeight: 400 }}>
                  <MapPin size={20} />
                  <span>San Francisco, CA</span>
                </div>
                <HeroIcon size={100} strokeWidth={1} style={{ margin: '1rem 0' }} />
                <h1 style={{ fontSize: '6rem', fontWeight: 300, letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
                  {currentTemp}°
                </h1>
                <p style={{ opacity: 0.8, fontSize: '1.25rem', textTransform: 'capitalize', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
                  {time} • {weather}
                </p>
              </TiltCard>
            </div>

            {/* Weekly Forecast */}
            <div className="anim-fade-in-up delay-100" style={{ display: 'flex', flex: 1 }}>
              <TiltCard style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                 <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <Cloud size={16} /> 7-Day Forecast
                 </h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'space-between' }}>
                   {['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                     <div 
                       key={day} 
                       style={{ 
                         display: 'flex', 
                         justifyContent: 'space-between', 
                         alignItems: 'center', 
                         paddingBottom: i !== 6 ? '0.5rem' : 0, 
                         borderBottom: i !== 6 ? `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}` : 'none',
                         transition: 'transform 0.2s',
                         cursor: 'default'
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                     >
                       <span style={{ width: '50px', fontWeight: day === 'Today' ? 600 : 400, opacity: day === 'Today' ? 1 : 0.8 }}>{day}</span>
                       {i % 3 === 0 ? <Sun size={18} opacity={0.9} /> : i % 2 === 0 ? <CloudRain size={18} opacity={0.9} /> : <Cloud size={18} opacity={0.9} />}
                       <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                         <span style={{ opacity: 0.6 }}>{parseInt(currentTemp) - (10 + i)}°</span>
                         <span style={{ fontWeight: 500 }}>{parseInt(currentTemp) + (i % 3)}°</span>
                       </div>
                     </div>
                   ))}
                 </div>
              </TiltCard>
            </div>

          </div>

          {/* Right Column (Hourly + Metrics) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hourly Timeline */}
            <div className="anim-fade-in-up delay-200">
              <TiltCard style={{ padding: '1.5rem 2rem' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <Wind size={16} /> Today's Forecast
                 </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        minWidth: '60px',
                        transition: 'transform 0.2s',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <span style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: i === 0 ? 600 : 400 }}>{i === 0 ? 'Now' : `${(i*3)%12 || 12} ${i*3 > 11 ? 'PM' : 'AM'}`}</span>
                      {i % 4 === 0 ? <Sun size={24} /> : i % 3 === 0 ? <CloudRain size={24} /> : <Cloud size={24} />}
                      <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{parseInt(currentTemp) - Math.abs(2 - i)}°</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1 }}>
               <MetricCard 
                  delay="delay-100" 
                  title="Feels Like" 
                  icon={Thermometer} 
                  value={`${parseInt(currentTemp) + (weather === 'sunny' ? 3 : -4)}°`} 
                  sub={weather === 'sunny' ? 'Humidity is making it feel warmer.' : 'Wind is making it feel cooler.'} 
               />
               <MetricCard 
                  delay="delay-200" 
                  title="Wind" 
                  icon={Wind} 
                  value={weather === 'snow' ? '18 mph' : '12 mph'} 
                  sub="Direction: NW" 
               />
               <MetricCard 
                  delay="delay-300" 
                  title={time === 'night' ? 'Moon Phase' : time === 'evening' ? 'Sunset' : 'Sunrise'} 
                  icon={time === 'night' ? Moon : time === 'evening' ? Sunset : Sunrise} 
                  value={time === 'night' ? 'Waxing' : time === 'evening' ? '7:15 PM' : '6:42 AM'} 
                  sub={time === 'night' ? '92% Illumination' : 'Optimal viewing time'} 
               />
               <MetricCard 
                  delay="" 
                  title="Humidity" 
                  icon={Droplets} 
                  value={weather === 'rainy' ? '88%' : '45%'} 
                  sub="The dew point is 52° right now." 
               />
               <MetricCard 
                  delay="delay-100" 
                  title="UV Index" 
                  icon={SunMedium} 
                  value={weather === 'sunny' ? '6 High' : '1 Low'} 
                  sub="Use sun protection until 4:00 PM." 
               />
               <MetricCard 
                  delay="delay-200" 
                  title="Air Quality" 
                  icon={Activity} 
                  value={weather === 'cloudy' ? '65 AQI' : '42 AQI'} 
                  sub={weather === 'cloudy' ? 'Moderate' : 'Good'} 
               />
            </div>

          </div>

        </div>

        {/* Right Side Control Panel */}
        <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}>
          <TiltCard 
            className="anim-fade-in" 
            style={{ 
              padding: '1.5rem', 
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5rem',
              width: '240px'
            }}
          >
            {/* Time Toggles */}
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Time of Day
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {timeOptions.map(opt => {
                  const Icon = opt.icon;
                  const isActive = time === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTime(opt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        background: isActive 
                          ? (isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)') 
                          : (isLightMode ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'),
                        border: '1px solid',
                        borderColor: isActive 
                          ? (isLightMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)') 
                          : (isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'),
                        borderRadius: '12px',
                        color: textColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: '100%',
                        textAlign: 'left',
                        boxShadow: isActive ? `0 4px 12px ${isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)'}` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        if (!isActive) {
                          e.currentTarget.style.background = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.borderColor = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        if (!isActive) {
                          e.currentTarget.style.background = isLightMode ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
                        }
                      }}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ opacity: isActive ? 1 : 0.6 }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: isActive ? 500 : 400 }}>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Weather Toggles */}
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Weather
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {weatherOptions.map(opt => {
                  const Icon = opt.icon;
                  const isActive = weather === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setWeather(opt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        background: isActive 
                          ? (isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)') 
                          : (isLightMode ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'),
                        border: '1px solid',
                        borderColor: isActive 
                          ? (isLightMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)') 
                          : (isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'),
                        borderRadius: '12px',
                        color: textColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: '100%',
                        textAlign: 'left',
                        boxShadow: isActive ? `0 4px 12px ${isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)'}` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        if (!isActive) {
                          e.currentTarget.style.background = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.borderColor = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        if (!isActive) {
                          e.currentTarget.style.background = isLightMode ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
                        }
                      }}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ opacity: isActive ? 1 : 0.6 }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: isActive ? 500 : 400 }}>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </>
  );
}
