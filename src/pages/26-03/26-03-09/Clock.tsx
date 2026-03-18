import React, { useState, useEffect, useRef } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';

// Asset Imports
import catFont from '../../../assets/fonts/cat.ttf';
import SwatsFont from '../../../assets/fonts/Swats.ttf';
import cat1Font from '../../../assets/fonts/cat1.ttf';
import catzFont from '../../../assets/fonts/catz.otf';
import katFont from '../../../assets/fonts/kat.ttf';
import katzzFont from '../../../assets/fonts/katzz.ttf';
import KittiesFont from '../../../assets/fonts/Kitties.ttf';
import meFont from '../../../assets/fonts/me.ttf';
import OrienightFont from '../../../assets/fonts/Orienight.otf';
import PurrfectFont from '../../../assets/fonts/Purrfect.ttf';

const FONT_DATA = [
  { name: 'cat', url: catFont, maxSize: 0.4 },
  { name: 'Swats', url: SwatsFont, maxSize: 4.0 },
  { name: 'cat1', url: cat1Font, maxSize: 2.3 },
  { name: 'catz', url: catzFont, maxSize: 2.8 },
  { name: 'kat', url: katFont, maxSize: 2.6 },
  { name: 'katzz', url: katzzFont, maxSize: 2.7 },
  { name: 'Kitties', url: KittiesFont, maxSize: 2.4 },
  { name: 'me', url: meFont, maxSize: 2.9 },
  { name: 'Orienight', url: OrienightFont, maxSize: 2.2 },
  { name: 'Purrfect', url: PurrfectFont, maxSize: 1.5 },
];

const Clock: React.FC = () => {
  const fontConfigs = FONT_DATA.map(f => ({ fontFamily: f.name, fontUrl: f.url }));
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  const [time, setTime] = useState(new Date());
  const [index, setIndex] = useState(0);
  const [transform, setTransform] = useState({ scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0, x: 0, y: 0 });
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Diverse Cat SVGs
  const cat1 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 120 120'%3E%3Cpath fill='none' stroke='%2300f2ff' stroke-width='2' opacity='0.4' d='M60 40 L75 20 L85 40 Q95 45 95 60 Q95 80 75 90 L75 105 Q90 110 85 120 Q70 110 60 95 Q50 110 35 120 Q30 110 45 105 L45 90 Q25 80 25 60 Q25 45 35 40 L45 20 Z'/%3E%3C/svg%3E";
  const cat2 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23ff00ff' stroke-width='2' opacity='0.3' d='M30 80 Q20 80 20 60 Q20 40 40 40 L45 20 L55 40 L65 20 L70 40 Q90 40 90 60 Q90 80 80 80 L80 90 L70 80 L30 80'/%3E%3C/svg%3E";
  const cat3 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='5' fill='%23ECDE46' opacity='0.6'/%3E%3Cpath fill='none' stroke='%23ECDE46' stroke-width='1.5' opacity='0.4' d='M20 50 Q30 20 50 20 Q70 20 80 50'/%3E%3C/svg%3E";

  useEffect(() => {
    const styleBlock = document.createElement('style');
    styleBlock.textContent = `
      .clowder-layer {
        position: absolute;
        inset: -200px;
        pointer-events: none;
        background-repeat: repeat;
      }
      .layer-fast {
        background-image: url("${cat1}");
        background-size: 150px 150px;
        z-index: 1;
        opacity: 0.15;
        animation: panFast 30s linear infinite;
      }
      .layer-mid {
        background-image: url("${cat2}");
        background-size: 250px 250px;
        z-index: 0;
        opacity: 0.1;
        animation: panMid 60s linear infinite reverse;
      }
      .layer-slow {
        background-image: url("${cat3}");
        background-size: 100px 100px;
        z-index: -1;
        opacity: 0.2;
        animation: panSlow 100s linear infinite;
      }
      @keyframes panFast { from { transform: translate(0, 0); } to { transform: translate(300px, 600px); } }
      @keyframes panMid { from { transform: translate(0, 0); } to { transform: translate(-400px, 200px); } }
      @keyframes panSlow { from { transform: translate(0, 0); } to { transform: translate(200px, -400px); } }
      
      .pounce-reaction {
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    `;
    document.head.appendChild(styleBlock);
    styleRef.current = styleBlock;
    return () => { if (styleRef.current) document.head.removeChild(styleRef.current); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setIndex((prev) => (prev + 1) % FONT_DATA.length);
      
      const font = FONT_DATA[(index + 1) % FONT_DATA.length];
      setTransform({
        scale: Number((Math.random() * (font.maxSize - 0.7) + 0.7).toFixed(2)),
        rotateX: Number((Math.random() * 50 - 25).toFixed(1)),
        rotateY: Number((Math.random() * 50 - 25).toFixed(1)),
        rotateZ: Number((Math.random() * 30 - 15).toFixed(1)),
        x: Number((Math.random() * 25 - 12.5).toFixed(1)),
        y: Number((Math.random() * 15 - 7.5).toFixed(1)),
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [index]);

  if (!fontsLoaded) return <div style={{ background: '#520850', height: '100dvh' }} />;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div style={{
      width: '100vw', height: '100dvh', backgroundColor: '#520850', display: 'flex',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', perspective: '1500px'
    }}>
      {/* Parallax Cat Layers */}
      <div className="clowder-layer layer-slow pounce-reaction" style={{ transform: `scale(${1 + transform.x * 0.01})` }} />
      <div className="clowder-layer layer-mid pounce-reaction" style={{ transform: `translate(${transform.x * 0.5}px, ${transform.y * 0.5}px)` }} />
      <div className="clowder-layer layer-fast pounce-reaction" />

      {/* Main Kinetic Clock */}
      <div style={{
        fontSize: `calc(${transform.scale} * clamp(5rem, 25vw, 20rem))`,
        fontFamily: `'${FONT_DATA[index].name}', sans-serif`,
        color: '#ECDE46',
        transform: `translate(${transform.x}vw, ${transform.y}vh) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg)`,
        transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 10,
        textShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(236, 222, 70, 0.2)',
        textAlign: 'center',
        transformStyle: 'preserve-3d'
      }}>
        {hours}{minutes}
      </div>
    </div>
  );
};

export default Clock;