import customFont from '@/assets/fonts/26fonts/26-06-24.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-22/golf.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

export const assets = [backgroundImage, customFont];

export default function DigitalClock() {
  const time = useSecondClock();

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
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right bottom',
          transform: 'scaleX(-1)',
        }}
        src={backgroundImage}
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
    height: '100dvh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    bottom: '18dvh',             // Adjust this value to move it higher or lower from the bottom edge
    left: '90px',
    opacity: 0.7,// Adjust this value to move it closer or further from the left edge
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15dvh',
    fontFamily: 'CustomFont260624, monospace',
    color: '#D92828',
    lineHeight: 0.8,             // Tightened to pull everything closer vertically
  },
  colon: {
    fontSize: '12dvh',
    margin: '0 0rem',         // Cleaned up margin properties
    transform: 'translateY(-0.1em)',
  },
  ampm: {
    fontSize: '8dvh',            // Slightly smaller for hierarchy, adjust as you see fit
    fontFamily: 'CustomFont260624, monospace',
    color: '#D92828',
    lineHeight: 0.1,             // Pulls the text up closely under the time numbers
    marginTop: '0.5dvh',         // A tiny micro-adjustment nudge to fine-tune spacing
  },
};