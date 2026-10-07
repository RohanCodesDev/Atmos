import { TiltCard } from './TiltCard';

export const MetricCard = ({ title, icon: Icon, value, sub, delay }: any) => (
  <div className={`anim-fade-in-up ${delay}`} style={{ display: 'flex' }}>
    <TiltCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
        <Icon size={18} />
        <span>{title}</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.9rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {sub}
      </div>
    </TiltCard>
  </div>
);
