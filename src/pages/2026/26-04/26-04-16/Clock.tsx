import React, { useMemo } from 'react';
import { useClockTime, calculateAngles } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import seFont from '@/assets/fonts/26-04-16-se.ttf';
import bgImage from '@/assets/images/2026/26-04/26-04-16/jamine.webp';
import tileImage from '@/assets/images/2026/26-04/26-04-16/pom.webp';
import styles from './Clock.module.css';

const ROMAN_NUMERALS = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const Clock: React.FC = () => {
  const time = useClockTime();
  const angles = useMemo(() => calculateAngles(time), [time]);

  // Load custom font
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'SEClock', fontUrl: seFont }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  // Constants for layout
  const clockSize = 70;
  const center = 50;
  const numeralRadius = 42; // Adjusted for better fit within the viewport

  // Memoize numerals to prevent re-calculation on every tick
  const numerals = useMemo(() => {
    return ROMAN_NUMERALS.map((numeral, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const x = center + Math.cos(angle) * numeralRadius;
      const y = center + Math.sin(angle) * numeralRadius;
      const rotation = index * 30;
      return { numeral, x, y, rotation };
    });
  }, [numeralRadius]);

  // Memoize the background tiles (expensive loop)
  const backgroundTiles = useMemo(() => {
    const tiles = [];
    const gap = 100;
    
    for (let ring = 1; ring < 10; ring++) {
      const ringOffset = ring * gap;
      const tilesPerSide = ring * 2;
      
      for (let side = 0; side < 4; side++) {
        for (let pos = 0; pos < tilesPerSide; pos++) {
          const offset = (pos - ring + 0.5) * gap;
          let left, top;
          
          switch (side) {
            case 0: left = `calc(50% + ${offset}px - 50px)`; top = `calc(50% - ${ringOffset}px - 50px)`; break;
            case 1: left = `calc(50% + ${ringOffset}px - 50px)`; top = `calc(50% + ${offset}px - 50px)`; break;
            case 2: left = `calc(50% + ${offset}px - 50px)`; top = `calc(50% + ${ringOffset}px - 50px)`; break;
            case 3: left = `calc(50% - ${ringOffset}px - 50px)`; top = `calc(50% + ${offset}px - 50px)`; break;
            default: left = '0'; top = '0';
          }
          
          tiles.push(
            <img
              key={`${ring}-${side}-${pos}`}
              src={tileImage}
              alt=""
              className={styles.rotatingTile}
              style={{ left, top }}
            />
          );
        }
      }
    }
    return tiles;
  }, []);

  return (
    <div className={styles.clockViewport}>
      {/* Tiles Layer */}
      <div className={styles.tileContainer}>
        <img src={tileImage} alt="" className={styles.rotatingTile} style={{ left: 'calc(50% - 50px)', top: 'calc(50% - 50px)' }} />
        {backgroundTiles}
      </div>

      {/* Center Image Layer */}
      <div className={styles.baseImageLayer} style={{ backgroundImage: `url(${bgImage})` }} />
   
      {/* Clock Face */}
      <div className={styles.clockFace} style={{ width: `${clockSize}vmin`, height: `${clockSize}vmin` }}>
        {numerals.map(({ numeral, x, y, rotation }, index) => (
          <span
            key={index}
            className={styles.numeral}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          >
            {numeral}
          </span>
        ))}

        {/* Hour Hand */}
        <div
          className={styles.hourHand}
          style={{
            transform: `translate(-50%, -100%) rotate(${angles.hour}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div className={styles.minuteHand} style={{ transform: `translate(-50%, -100%) rotate(${angles.minute}deg)` }} />

        {/* Second Hand */}
        <div className={styles.secondHand} style={{ transform: `translate(-50%, -100%) rotate(${angles.second}deg)` }} />

        {/* Center Cap */}
        <div className={styles.centerCap} />
      </div>
    </div>
  );
};

export default Clock;