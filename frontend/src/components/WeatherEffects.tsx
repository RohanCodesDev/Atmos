import { useState, useEffect } from 'react';

export const SnowEffect = () => {
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

export const RainEffect = () => {
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

export const BackgroundGradient = ({ currentGradient }: { currentGradient: string }) => {
  const [prevGradient, setPrevGradient] = useState(currentGradient);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (currentGradient !== prevGradient) {
      setFade(true);
      const timer = setTimeout(() => {
        setPrevGradient(currentGradient);
        setFade(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentGradient, prevGradient]);

  return (
    <>
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: -2,
          background: prevGradient
        }}
      />
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: -1,
          background: currentGradient,
          opacity: fade ? 1 : 0,
          transition: fade ? 'opacity 1.5s ease-in-out' : 'none',
        }}
      />
    </>
  );
};
