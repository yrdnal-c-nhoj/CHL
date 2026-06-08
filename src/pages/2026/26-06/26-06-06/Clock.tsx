import hangImg2 from '@/assets/images/26_images/26-06/26-06-06/hang.webp';
import hangImg from '@/assets/images/26_images/26-06/26-06-06/hangpet.webp';
import hangImg3 from '@/assets/images/26_images/26-06/26-06-06/pet.webp';
import backgroundImg from '@/assets/images/26_images/26-06/26-06-06/petunia.webp';
import React, { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

export const assets = [backgroundImg, hangImg, hangImg2, hangImg3];

const AntarcticaClock: React.FC = () => {
  const clockRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clock = clockRef.current;
    if (!clock) return;

    // Clear any existing ticks (in case of remount)
    while (clock.firstChild) {
      clock.removeChild(clock.firstChild);
    }

   
    // Append hands
    if (hourRef.current) clock.appendChild(hourRef.current);
    if (minuteRef.current) clock.appendChild(minuteRef.current);
    if (secondRef.current) clock.appendChild(secondRef.current);

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();

      const hourAngle = hours * 30 + minutes / 2;
      const minuteAngle = minutes * 6 + seconds / 10;
      const baseSecondAngle = seconds * 6;
      const progress = ms / 1000;
      const secondAngle = baseSecondAngle + progress * 6;

      if (hourRef.current) {
        hourRef.current.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
      }
      if (secondRef.current) {
        secondRef.current.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
      }

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <div className={styles.container}>
        <img
          decoding="async"
          loading="lazy"
          src={backgroundImg}
          alt="Antarctica"
          className={styles.bgimage}
        />
        <img 
          src={hangImg} 
          alt="hang" 
          className={styles.hangOverlay} 
          decoding="async" 
          loading="lazy" 
      />
      <img 
          src={hangImg2} 
          alt="hang" 
          className={styles.hangOverlay2} 
          decoding="async" 
          loading="lazy" 
      />
       <img 
          src={hangImg3} 
          alt="hang" 
          className={styles.hangOverlay3} 
          decoding="async" 
          loading="lazy" 
        />
        <div
          ref={clockRef}
          className={styles.clock}
        >
          <div className={styles.center} />
          <div ref={hourRef} className={`${styles.hand} ${styles.hourHand}`} />
          <div ref={minuteRef} className={`${styles.hand} ${styles.minuteHand}`} />
          <div ref={secondRef} className={`${styles.hand} ${styles.secondHand}`} />
        </div>
      </div>
  );
};

export default AntarcticaClock;
