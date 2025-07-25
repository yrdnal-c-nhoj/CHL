import { useEffect, useRef, useState } from 'react';
import StickyNote from '../../stickynote';

function App() {
  const canvasRef = useRef(null);
  const [time, setTime] = useState({ hours: '', minutes: '' });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [targetSkewX, setTargetSkewX] = useState(0);
  const [targetSkewY, setTargetSkewY] = useState(0);
  const [stretch, setStretch] = useState(1);
  const [targetStretch, setTargetStretch] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [color, setColor] = useState('rgb(0, 0, 0)');
  const [trail, setTrail] = useState([]);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12;

    setTime({ hours, minutes });
    setColor(getRandomColor());
    setTargetPosition(prev => ({
      x: prev.x + (Math.random() - 0.5) * window.innerWidth * 0.02, // Slow movement
      y: prev.y + (Math.random() - 0.5) * window.innerHeight * 0.02,
    }));
    setTargetSkewX((Math.random() - 0.5) * 10); // Slow skew ±5°
    setTargetSkewY((Math.random() - 0.5) * 10);
    setTargetStretch(0.9 + Math.random() * 0.2); // Stretch 0.9-1.1
    setRotation({
      x: (Math.random() - 0.5) * 15, // Slow rotation
      y: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 45,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setTrail(prevTrail => {
        const newTrail = [
          ...prevTrail,
          { 
            x: position.x, 
            y: position.y, 
            skewX, 
            skewY, 
            stretch, 
            color, 
            opacity: 1,
            rotationX: rotation.x,
            rotationY: rotation.y,
            rotationZ: rotation.z,
          },
        ].slice(-300); // 30s * 10 updates/s

        newTrail.forEach((trailItem, index) => {
          const opacity = trailItem.opacity * (1 - index / newTrail.length);
          if (opacity < 0.05) return;
          ctx.save();
          ctx.font = `${window.innerHeight * 0.2}rem 'Stick', sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.translate(canvas.width / 2 + trailItem.x, canvas.height / 2 + trailItem.y);
          ctx.rotate(trailItem.rotationZ * Math.PI / 180);
          ctx.setTransform(
            trailItem.stretch * Math.cos(trailItem.rotationY * Math.PI / 180),
            trailItem.skewX * 0.01,
            trailItem.skewY * 0.01,
            Math.cos(trailItem.rotationX * Math.PI / 180),
            0,
            0
          );
          ctx.fillStyle = `rgba(${trailItem.color.match(/\d+/g).join(',')}, ${opacity})`;
          ctx.fillText(`${time.hours}:${time.minutes}`, 0, 0);
          ctx.restore();
        });

        return newTrail.map(item => ({
          ...item,
          opacity: item.opacity * 0.994, // ~30s fade
        }));
      });
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateClock();
    const interval = setInterval(updateClock, 100); // 10 updates/s

    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.05, // Slow interpolation
        y: prev.y + (targetPosition.y - prev.y) * 0.05,
      }));
      setSkewX(prev => prev + (targetSkewX - prev) * 0.05);
      setSkewY(prev => prev + (targetSkewY - prev) * 0.05);
      setStretch(prev => prev + (targetStretch - prev) * 0.05);
      drawTrail();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(interval);
    };
  }, [position, targetPosition, skewX, skewY, targetSkewX, targetSkewY, stretch, targetStretch, rotation, color, time]);

  const containerStyle = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    background: 'white',
    fontFamily: "'Stick', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
    position: 'relative',
  };

  const clockStyle = {
    fontSize: '10rem',
    color: color,
    transform: `translate(${position.x}vw, ${position.y}vh) skewX(${skewX}deg) skewY(${skewY}deg) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(${stretch})`,
    transition: 'transform 0.1s ease, color 0.1s ease',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
  };

  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
  };

  return (
    <div style={containerStyle}>
      <StickyNote />
      <div style={clockStyle}>{time.hours}:{time.minutes}</div>
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
}

export default App;