import { useState, useEffect } from 'react';

export default function DesertClock() {
  const [time, setTime] = useState(new Date());
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Generate floating dust particles
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20
    }));
    setParticles(particleArray);

    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #3d2817 0%, #5c3d2e 25%, #8b5a3c 50%, #5c3d2e 75%, #3d2817 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    fontFamily: 'monospace'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(61, 40, 23, 0.4) 100%)',
    pointerEvents: 'none'
  };

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    alignItems: 'center'
  };

  const digitStyle = {
    fontSize: 'clamp(4rem, 20vw, 12rem)',
    fontWeight: 'bold',
    color: '#d4846a',
    textShadow: `
      0 0 20px rgba(212, 132, 106, 0.5),
      0 0 40px rgba(212, 132, 106, 0.3),
      0 0 60px rgba(212, 132, 106, 0.2),
      2px 2px 4px rgba(0, 0, 0, 0.8)
    `,
    fontFamily: 'monospace',
    letterSpacing: '0.05em',
    lineHeight: 1
  };

  const separatorStyle = {
    fontSize: 'clamp(4rem, 20vw, 12rem)',
    fontWeight: 'bold',
    color: '#c97a5f',
    opacity: time.getSeconds() % 2 === 0 ? 1 : 0.3,
    transition: 'opacity 0.3s ease',
    textShadow: `
      0 0 20px rgba(201, 122, 95, 0.5),
      2px 2px 4px rgba(0, 0, 0, 0.8)
    `,
    lineHeight: 1
  };

  const dateStyle = {
    position: 'absolute',
    bottom: 'clamp(2rem, 10vh, 4rem)',
    fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
    color: '#a8735e',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    zIndex: 10
  };

  const particleStyle = (particle) => ({
    position: 'absolute',
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    backgroundColor: 'rgba(212, 132, 106, 0.3)',
    borderRadius: '50%',
    animation: `float ${particle.duration}s linear infinite`,
    animationDelay: `${particle.delay}s`,
    pointerEvents: 'none',
    boxShadow: '0 0 4px rgba(212, 132, 106, 0.5)'
  });

  const dateString = time.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes float {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translate(${Math.random() * 100 - 50}vw, 100vh) rotate(360deg);
              opacity: 0;
            }
          }
          * {
            box-sizing: border-box;
          }
        `}
      </style>
      
      <div style={overlayStyle} />
      
      {particles.map(particle => (
        <div key={particle.id} style={particleStyle(particle)} />
      ))}
      
      <div style={clockContainerStyle}>
        <span style={digitStyle}>{hours}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{minutes}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{seconds}</span>
      </div>
      
      <div style={dateStyle}>{dateString}</div>
    </div>
  );
}