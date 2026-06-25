import customFont from '@/assets/fonts/26fonts/26-06-24.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-22/golf.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useState } from 'react';

export const assets = [backgroundImage, customFont];

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'CustomFont260624',
        fontUrl: customFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  let hours = time.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutes = time.getMinutes().toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');

  // Replace '0' with 'O' for a stylized look
  const displayHours = formattedHours.replaceAll('0', 'O');
  const displayMinutes = minutes.replaceAll('0', 'O');

  return (
    <div style={styles.container}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right bottom',
          transform: 'scaleX(-1)',
        }}
      />
      <div style={styles.timeContainer}>
        <div style={styles.time}>
          <span>{displayHours}</span>
          <span style={styles.colon}>:</span>
          <span>{displayMinutes}</span>
        </div>
        <span style={styles.ampm}>{ampm}</span>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start', // Aligns items to the left horizontally
    alignItems: 'flex-end',      // Aligns items to the bottom vertically
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    bottom: '18vh',              // Adjust this value to move it higher or lower from the bottom edge
    left: '90px',
    opacity: 0.7,// Adjust this value to move it closer or further from the left edge
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15vh',
    fontFamily: 'CustomFont260624, monospace',
    color: '#D92828',
    lineHeight: 0.8,             // Tightened to pull everything closer vertically
  },
  colon: {
    fontSize: '12vh',
    margin: '0 0rem',         // Cleaned up margin properties
    transform: 'translateY(-0.1em)',
  },
  ampm: {
    fontSize: '8vh',             // Slightly smaller for hierarchy, adjust as you see fit
    fontFamily: 'CustomFont260624, monospace',
    color: '#D92828',
    lineHeight: 0.1,             // Pulls the text up closely under the time numbers
    marginTop: '0.5vh',          // A tiny micro-adjustment nudge to fine-tune spacing
  },
};