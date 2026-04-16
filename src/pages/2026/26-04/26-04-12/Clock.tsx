import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useClockTime } from '@/utils/clockUtils';

// Asset Imports
import hourHandImg from '@/assets/images/2026/26-04/26-04-12/hand.webp';
import minuteHandImg from '@/assets/images/2026/26-04/26-04-12/hand2.webp';
import secondHandImg from '@/assets/images/2026/26-04/26-04-12/hand3.gif';
import bgImage from '@/assets/images/2026/26-04/26-04-12/background.jpeg';
import centerImg from '@/assets/images/2026/26-04/26-04-12/center.webp';

import m1 from '@/assets/images/2026/26-04/26-04-12/1.webp';
import m2 from '@/assets/images/2026/26-04/26-04-12/2.gif';
import m3 from '@/assets/images/2026/26-04/26-04-12/3.gif';
import m4 from '@/assets/images/2026/26-04/26-04-12/4.gif';
import m5 from '@/assets/images/2026/26-04/26-04-12/5.gif';
import m6 from '@/assets/images/2026/26-04/26-04-12/6.webp';
import m7 from '@/assets/images/2026/26-04/26-04-12/7.webp';
import m8 from '@/assets/images/2026/26-04/26-04-12/8.gif';
import m9 from '@/assets/images/2026/26-04/26-04-12/9.webp';
import m10 from '@/assets/images/2026/26-04/26-04-12/10.gif';
import m11 from '@/assets/images/2026/26-04/26-04-12/11.gif';
import m12 from '@/assets/images/2026/26-04/26-04-12/12.webp';
import m13 from '@/assets/images/2026/26-04/26-04-12/13.webp';

const allMatchImages = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13];

const imageSettings = [
  { size: '21%', opacity: 1.0, brightness: 10.5, saturation: 1.2, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '21%', opacity: 0.8, brightness: 1.0, saturation: 1.5, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '21%', opacity: 0.9, brightness: 1.2, saturation: 2.2, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '21%', opacity: 0.8, brightness: 1.2, saturation: 1.7, vignetteBlackStop: '40%', vignetteTransparentStop: '65%' },
  { size: '21%', opacity: 0.8, brightness: 1.0, saturation: 2.0, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '22%', opacity: 0.9, brightness: 1.4, saturation: 1.5, vignetteBlackStop: '40%', vignetteTransparentStop: '75%' },
  { size: '31%', opacity: 0.9, brightness: 0.9, saturation: 1.1, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '29%', opacity: 0.8, brightness: 1.3, saturation: 1.9, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '31%', opacity: 0.9, brightness: 1.3, saturation: 3.0, vignetteBlackStop: '20%', vignetteTransparentStop: '55%' },
  { size: '31%', opacity: 0.9, brightness: 1.3, saturation: 1.6, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '38%', opacity: 0.9, brightness: 0.9, saturation: 1.8, vignetteBlackStop: '40%', vignetteTransparentStop: '65%' },
  { size: '32%', opacity: 0.8, brightness: 1.3, saturation: 1.7, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '31%', opacity: 0.8, brightness: 1.4, saturation: 1.8, vignetteBlackStop: '40%', vignetteTransparentStop: '55%' },
];

const Clock: React.FC = () => {
  const time = useClockTime();

  // Initialize state for face indices and spare index
  const [faceIndices, setFaceIndices] = useState<number[]>([]);
  const [spareIndex, setSpareIndex] = useState<number>(-1); // Use -1 as an initial invalid state

  const randomizeImages = useCallback(() => {
    const indices = Array.from({ length: allMatchImages.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setFaceIndices(indices.slice(0, 12));
    setSpareIndex(indices[12]);
  }, []);

  // Effect to perform randomization on component mount
  useEffect(() => {
    randomizeImages();
  }, [randomizeImages]);

  const lastProcessedSec = useRef<number>(-1);
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  useEffect(() => {
    // Only trigger once per second change and if faceIndices has been initialized
    if (seconds !== lastProcessedSec.current && faceIndices.length > 0) {
      lastProcessedSec.current = seconds;

      // Every 12 seconds, when a new full cycle begins, reshuffle the entire list
      if (seconds % 12 === 0) {
        randomizeImages();
        return;
      }

      // Identify which clock position counter-clockwise from 12 o'clock (0-11)
      const activePos = (12 - (seconds % 12)) % 12;

      setFaceIndices((prev) => {
        const newFace = [...prev];
        // Ensure prev has enough elements before accessing
        if (newFace.length === 0 || activePos >= newFace.length) return prev;
        
        const outgoingImage = newFace[activePos];

        // SWAP: Put the spare image on the face, and take the face image to the spare slot
        newFace[activePos] = spareIndex;
        setSpareIndex(outgoingImage);
        
        return newFace;
      });
    }
  }, [seconds, spareIndex, faceIndices, randomizeImages]);

  const rotations = useMemo(() => {
    const s = seconds + milliseconds / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return { sec: s * 6, min: m * 6, hr: h * 30 };
  }, [seconds, milliseconds, time]);

  return (
    <div style={{ 
      width: '100vw', height: '100dvh', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' 
    }}>
      <div style={{ position: 'relative', width: '99vmin', height: '99vmin' }}>
        
        {/* Render the 12 Positions */}
        {faceIndices.map((imgIdx, i) => {
          // Only render if imgIdx is valid (i.e., after initial shuffle in useEffect)
          if (imgIdx === -1) return null;

          const hour = i + 1;
          const angle = hour * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 40 * Math.cos(rad);
          const y = 50 + 40 * Math.sin(rad);
          const config = imageSettings[imgIdx];

          return (
            <img
              key={`pos-${i}`}
              src={allMatchImages[imgIdx]}
              style={{
                position: 'absolute', width: config.size, height: config.size,
                left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)',
                objectFit: 'contain', opacity: config.opacity,
                filter: `brightness(${config.brightness}) saturate(${config.saturation})`,
                transition: 'all 0.3s ease-in-out',
                WebkitMaskImage: `radial-gradient(ellipse 70% 70% at 50% 50%, black ${config.vignetteBlackStop}, transparent ${config.vignetteTransparentStop})`,
                maskImage: `radial-gradient(ellipse 70% 70% at 50% 50%, black ${config.vignetteBlackStop}, transparent ${config.vignetteTransparentStop})`,
              }}
              alt=""
            />
          );
        })}

        {/* Hands */}
        <Hand src={hourHandImg} deg={rotations.hr} width="26%" height="30%" z={2} />
        <Hand src={minuteHandImg} deg={rotations.min} width="84%" height="60%" z={3} />
        <Hand src={secondHandImg} deg={rotations.sec} width="72%" height="50%" z={4} isSec ms={milliseconds} />

        {/* Center overlay */}
        <img src={centerImg} style={{ 
          position: 'absolute', top: '45%', left: '50%', width: '90%', height: '90%', 
          opacity: 0.7, transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 10 
        }} alt="" />
      </div>
    </div>
  );
};

interface HandProps { src: string; deg: number; width: string; height: string; z: number; isSec?: boolean; ms?: number; }
const Hand = ({ src, deg, width, height, z, isSec, ms }: HandProps) => (
  <img src={src} style={{
    position: 'absolute', bottom: '50%', left: '50%', transformOrigin: 'bottom center',
    width, height, zIndex: z, pointerEvents: 'none',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    transition: isSec && ms! >= 100 ? 'transform 0.1s linear' : 'none'
  }} alt="" />
);

export default Clock;