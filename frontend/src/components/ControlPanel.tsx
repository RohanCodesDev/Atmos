import { TiltCard } from './TiltCard';

export const ControlPanel = ({ 
  isControlsOpen, isLightMode, textColor, time, setTime, weather, setWeather, timeOptions, weatherOptions 
}: any) => {
  return (
    <div style={{ 
      position: 'fixed', 
      right: '1.5rem', 
      top: '50%', 
      transform: `translateY(-50%) translateX(${isControlsOpen ? '0' : '150%'})`, 
      zIndex: 40,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isControlsOpen ? 1 : 0,
      pointerEvents: isControlsOpen ? 'auto' : 'none'
    }}>
      <TiltCard 
        className="anim-fade-in" 
        style={{ 
          padding: '1.5rem', 
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          width: '240px'
        }}
      >
        {/* Time Toggles */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Time of Day
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {timeOptions.map((opt: any) => {
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
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 500 : 400 }}>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Weather Toggles */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Weather
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {weatherOptions.map((opt: any) => {
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
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 500 : 400 }}>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </TiltCard>
    </div>
  );
};
