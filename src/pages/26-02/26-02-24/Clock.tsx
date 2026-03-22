import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import futurBg from '../../../assets/images/26-02/26-02-24/futur.jpg';
import oswaldFont from '../../../assets/fonts/25-04-25-Oswald-Bold.ttf?url';

interface Position {
  top: string;
  left: string;
  rotate: string;
  fontSize: string;
  font: string;
}

const ImageDisplay = () => {
  const time = useSecondClock();
  const [fontsReady, setFontsReady] = useState<boolean>(false);
  const [ariaTime, setAriaTime] = useState('');

  // Temporarily disable font loader to fix hook error
  // const fontConfigs = useMemo(() => [
  //   {
  //     fontFamily: 'Anton',
  //     fontUrl: 'https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm3K8-C8QSw.woff2',
  //     options: { weight: 'normal', style: 'normal' }
  //   },
  //   // ... other fonts
  // ], []);

  // useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    setFontsReady(true);
  }, []);

  // Accessibility: Update time string for screen readers
  const seconds = time.getSeconds();
  useEffect(() => {
    setAriaTime(
      time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]); // Update only when seconds change

  const { amPm, digits } = useMemo(() => {
    const rawHours = time.getHours();
    const amPm = rawHours >= 12 ? 'PM' : 'AM';
    const displayHours = (rawHours % 12 || 12).toString().padStart(2, '0');
    const displayMinutes = time.getMinutes().toString().padStart(2, '0');
    const displaySeconds = time.getSeconds().toString().padStart(2, '0');

    // Array of exactly 6 digits: [H, H, M, M, S, S]
    const digits = [
      ...displayHours.split(''),
      ...displayMinutes.split(''),
      ...displaySeconds.split(''),
    ];
    return { amPm, digits };
  }, [time]);

  if (!fontsReady) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          fontFamily: 'monospace',
          fontSize: '1.5rem',
        }}
      >
        Loading...
      </div>
    );
  }

  const positions: Position[] = [
    {
      top: '8%',
      left: '10%',
      rotate: '-15deg',
      fontSize: 'clamp(2rem, 8vw, 6rem)',
      font: "'Krona One'",
    }, // H1
    {
      top: '25%',
      left: '22%',
      rotate: '30deg',
      fontSize: 'clamp(11rem, 44vw, 22rem)',
      font: "'Anton'",
    }, // H2
    {
      top: '72%',
      left: '35%',
      rotate: '-18deg',
      fontSize: 'clamp(24rem, 64vw, 30rem)',
      font: "'Playfair Display'",
    }, // M1
    {
      top: '80%',
      left: '75%',
      rotate: '25deg',
      fontSize: 'clamp(2.5rem, 9vw, 7rem)',
      font: "'Oswald'",
    }, // M2
    {
      top: '15%',
      left: '75%',
      rotate: '-35deg',
      fontSize: 'clamp(5rem, 16vw, 12rem)',
      font: "'Merriweather'",
    }, // S1
    {
      top: '40%',
      left: '80%',
      rotate: '44deg',
      fontSize: 'clamp(7.5rem, 31vw, 12rem)',
      font: "'Roboto Mono'",
    }, // S2
  ];

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <div style={redOverlayStyle} />

      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
        }}
      >
        {ariaTime}
      </div>

      {digits.map((char, index) => (
        <div
          key={`${index}-${char}`}
          style={{
            ...digitBox,
            position: 'absolute',
            top: positions[index].top,
            left: positions[index].left,
            transform: `translate(-50%, -50%) rotate(${positions[index].rotate})`,
            fontFamily: `${positions[index].font}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`,
            fontSize: positions[index].fontSize,
            zIndex: 10,
          }}
        >
          {char}
        </div>
      ))}

      <div
        style={{
          ...amPmStyle,
          bottom: '20%',
          right: '5%',
          fontSize: '15vw',
          fontFamily:
            '"Josefin Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          transform: 'rotate(-50deg)',
        }}
      >
        {amPm[0]}
      </div>
      <div
        style={{
          ...amPmStyle,
          bottom: '10%',
          right: '10%',
          fontSize: '4vw',
          fontFamily:
            '"Bebas Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          transform: 'rotate(10deg)',
        }}
      >
        {amPm[1]}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
};

const backgroundStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${futurBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'brightness(2.5) contrast(0.6) grayscale(1)',
  zIndex: 0,
};

const redOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(249, 9, 9, 0.7)',
  mixBlendMode: 'multiply', // Creates a professional "printed" look
  zIndex: 1,
};

const digitBox: React.CSSProperties = {
  color: 'black',
  pointerEvents: 'none',
  userSelect: 'none',
  lineHeight: 0.8,
  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Adds a tiny "bounce" to number changes
};

const amPmStyle: React.CSSProperties = {
  position: 'absolute',
  color: 'black',
  zIndex: 10,
};

export default ImageDisplay;
