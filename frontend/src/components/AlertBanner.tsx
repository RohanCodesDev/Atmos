import { AlertTriangle } from 'lucide-react';

export const AlertBanner = ({ weatherData }: any) => {
  if (!weatherData) return null;

  const condition = weatherData.weather[0].main.toLowerCase();
  const windSpeed = weatherData.wind.speed; // usually in m/s from API
  
  let alertMessage = null;
  let severity = 'warning'; // 'warning' | 'danger'

  if (condition.includes('thunderstorm') || condition.includes('tornado') || condition.includes('squall')) {
    alertMessage = `Severe Weather Warning: ${weatherData.weather[0].description}. Please stay indoors and stay safe.`;
    severity = 'danger';
  } else if (windSpeed > 15) { // 15 m/s is ~54 km/h (High wind)
    alertMessage = 'High Wind Advisory: Expect strong gusts. Secure loose outdoor objects.';
    severity = 'warning';
  } else if (condition.includes('snow') || weatherData.main.temp < 273.15) { // Freezing
    alertMessage = 'Frost & Freezing Warning: Roads may be icy. Drive carefully.';
    severity = 'warning';
  } else if (weatherData.main.temp > 308.15) { // > 35 C
    alertMessage = 'Extreme Heat Advisory: Stay hydrated and avoid prolonged sun exposure.';
    severity = 'danger';
  } else if (condition.includes('rain')) {
    alertMessage = `Rain expected today: ${weatherData.weather[0].description}. Don't forget an umbrella!`;
    severity = 'info';
  }

  if (!alertMessage) return null;

  const getColors = () => {
    switch (severity) {
      case 'danger': return { bg: 'rgba(239, 68, 68, 0.9)', border: '#EF4444' };
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.9)', border: '#F59E0B' };
      case 'info': return { bg: 'rgba(59, 130, 246, 0.9)', border: '#3B82F6' };
      default: return { bg: 'rgba(0,0,0,0.8)', border: '#fff' };
    }
  };

  const { bg, border } = getColors();

  return (
    <div className="anim-fade-in-up" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '7rem 2rem 0 2rem', position: 'relative', zIndex: 11 }}>
      <div style={{ 
        background: bg, color: 'white', padding: '1rem 1.5rem', borderRadius: '12px', 
        display: 'flex', alignItems: 'center', gap: '1rem', 
        borderLeft: `6px solid ${border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
      }}>
        <AlertTriangle size={24} />
        <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
          {alertMessage}
        </span>
      </div>
    </div>
  );
};
