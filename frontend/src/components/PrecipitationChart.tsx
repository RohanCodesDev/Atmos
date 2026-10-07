import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
              <Tooltip 
                contentStyle={{ 
                  background: isLightMode ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  color: isLightMode ? '#0f172a' : '#fff'
                }}
              />
              <Area yAxisId="left" type="monotone" dataKey="pop" name="Rain Prob" stroke={chartColor} fillOpacity={1} fill="url(#colorPop)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TiltCard>
    </div>
  );
};
