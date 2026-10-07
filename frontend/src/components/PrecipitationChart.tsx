import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CloudRain } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const PrecipitationChart = ({ hourlyForecast, isLightMode, unitSymbol }: any) => {
  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const data = hourlyForecast.map((hf: any) => ({
    time: hf.time,
    temp: hf.temp,
    pop: hf.pop,
  }));

  const chartColor = isLightMode ? '#0ea5e9' : '#38bdf8';
  const textColor = isLightMode ? '#475569' : 'rgba(255,255,255,0.7)';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: isLightMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${isLightMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          color: isLightMode ? '#0f172a' : '#fff'
        }}>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, opacity: 0.8, fontSize: '0.85rem' }}>{label}</p>
          <p style={{ margin: 0, fontWeight: 700, color: chartColor }}>Rain: {payload[0].value}%</p>
          {payload.length > 1 && <p style={{ margin: '0.25rem 0 0 0', fontWeight: 700, color: '#f59e0b' }}>Temp: {payload[1].value}{unitSymbol}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="anim-fade-in-up delay-300">
      <TiltCard style={{ padding: '1.5rem 2rem' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <CloudRain size={16} /> Temperature & Precipitation Trend
        </h3>
        
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis yAxisId="left" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
              <YAxis yAxisId="right" orientation="right" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}${unitSymbol}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area yAxisId="left" type="monotone" dataKey="pop" name="Rain Prob" stroke={chartColor} fillOpacity={1} fill="url(#colorPop)" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="temp" name="Temperature" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: isLightMode ? '#fff' : '#0f172a' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TiltCard>
    </div>
  );
};
