import React, { useEffect, useState } from 'react';

import m250915font from '@/assets/fonts/2025/25-09-15-plaid.ttf?url';
import backgroundImageUrl from '@/assets/images/2025/25-09/25-09-15/plaid.jpg';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

interface SkewFlatClockProps {
  horizontalColors?: string[];
  verticalColors?: string[];
  verticalRepeats?: number;
  horizontalRepeats?: number;
}

const SkewFlatClock = ({
    horizontalColors = ['#BB100AFF', '#FFFFFF', '#026033FF'],
    verticalColors = ['#BB100AFF', '#FFFFFF', '#026033FF'],
    verticalRepeats = 40,
    horizontalRepeats = 30,
}) => {
    const [time, setTime] = useState<string>('');
    const [hue, setHue] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
  horizontalColors = ['#BB100AFF', '#FFFFFF', '#026033FF'],
  verticalColors = ['#BB100AFF', '#FFFFFF', '#026033FF'],
  verticalRepeats = 40,
  horizontalRepeats = 30,
}: SkewFlatClockProps) => {
  const [time, setTime] = useState<string>('');
  const [hue, setHue] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // Load font and background image
    useEffect(() => {
        // Native font loading without style leaks
        const loadFont = async () => {
            try {
                const fontFace = new FontFace('MyCustomFont', `url(${m250915font})`);
                await fontFace.load();
                document.fonts.add(fontFace);
            } catch (error) {
                console.warn('Font failed to load, using fallback');
            }
        };
  // Load font and background image
  useEffect(() => {
    // Native font loading without style leaks
    const loadFont = async () => {
      try {
        const fontFace = new FontFace('MyCustomFont', `url(${m250915font})`);
        await fontFace.load();
        document.fonts.add(fontFace);
      } catch (error) {
        console.warn('Font failed to load, using fallback');
      }
    };

        // Background image preload
        const imagePromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.src = backgroundImageUrl;
            img.onload = resolve;
            img.onerror = reject;
        });
    // Background image preload
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = backgroundImageUrl;
      img.onload = resolve;
      img.onerror = reject;
    });

        // Load font and wait for image
        Promise.all([loadFont(), imagePromise])
            .then(() => setIsLoaded(true))
            .catch((err) => {
                console.error('Asset loading error:', err);
                setIsLoaded(true);
            });
    }, []);
    // Load font and wait for image
    Promise.all([loadFont(), imagePromise])
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error('Asset loading error:', err);
        setIsLoaded(true);
      });
  }, []);

    // Update time and hue
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            hours = hours % 12 || 12; // 12-hour format
            setTime(`${hours}:${minutes}_`);
        };
  // Update time and hue
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes}_`);
    };

        updateTime();
        const timeInterval = setInterval(updateTime, 60000);
        const hueInterval = setInterval(
            () => setHue((prev) => (prev + 1) % 360),
            70,
        );
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    const hueInterval = setInterval(
      () => setHue((prev) => (prev + 1) % 360),
      70,
    );

        return () => {
            clearInterval(timeInterval);
            clearInterval(hueInterval);
        };
    }, []);

    // If not loaded, render plain black screen
    if (!isLoaded) {
        return (
            <div
                style={{ height: '100dvh', width: '100vw', backgroundColor: 'black' }}
            />
        );
    }

    const createTartanGrid = (colors: string[]) => {
        const rows = [];
        for (let row = 0; row < verticalRepeats; row++) {
            const rowColor = colors[row % colors.length];
            const cols = [];
            for (let col = 0; col < horizontalRepeats; col++) {
                cols.push(
                    <span
                        key={`${row}-${col}`}
                        style={{
                            display: 'inline-block',
                            marginRight: '0.1rem',
                            color: rowColor,
                            opacity: 0.65,
                            fontFamily: 'MyCustomFont',
                        }}
                    >
                        {time}
                    </span>,
                );
            }
            rows.push(
                <div key={row} style={{ whiteSpace: 'nowrap', lineHeight: '1.05' }}>
                    {cols}
                </div>,
            );
        }
        return rows;
    return () => {
      clearInterval(timeInterval);
      clearInterval(hueInterval);
    };
  }, []);

    const baseGridStyle: React.CSSProperties = {
        fontSize: '2.6rem',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: 'center',
        translate: '-50% -50%',
    };
  // If not loaded, render plain black screen
  if (!isLoaded) {
    return (
      <div
        style={{ height: '100dvh', width: '100vw', backgroundColor: 'black' }}
      />
    );
  }

    return (
        <div
  const createTartanGrid = (colors: string[]) => {
    const rows = [];
    for (let row = 0; row < verticalRepeats; row++) {
      const rowColor = colors[row % colors.length];
      const cols = [];
      for (let col = 0; col < horizontalRepeats; col++) {
        cols.push(
          <span
            key={`${row}-${col}`}
            style={{
                height: '100dvh',
                width: '100vw',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F3EFEFFF',
                filter: `hue-rotate(${hue}deg)`,
              display: 'inline-block',
              marginRight: '0.1rem',
              color: rowColor,
              opacity: 0.65,
              fontFamily: 'MyCustomFont',
            }}
        >
            <div
                role="timer"
                aria-live="polite"
                style={{
                    height: '200dvh',
                    width: '200vw',
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '15rem 15rem',
                    transform: 'rotate(-17deg)',
                    transformOrigin: 'center',
                    position: 'relative',
                }}
            >
                {/* Horizontal threads */}
                <div style={{ ...baseGridStyle, transform: 'rotate(0deg)' }}>
                    {createTartanGrid(horizontalColors)}
                </div>
          >
            {time}
          </span>,
        );
      }
      rows.push(
        <div key={row} style={{ whiteSpace: 'nowrap', lineHeight: '1.05' }}>
          {cols}
        </div>,
      );
    }
    return rows;
  };

                {/* Vertical threads */}
                <div style={{ ...baseGridStyle, transform: 'rotate(90deg)' }}>
                    {createTartanGrid(verticalColors)}
                </div>
            </div>
  const baseGridStyle: React.CSSProperties = {
    fontSize: '2.6rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
    translate: '-50% -50%',
  };

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F3EFEFFF',
        filter: `hue-rotate(${hue}deg)`,
      }}
    >
      <div
        role="timer"
        aria-live="polite"
        style={{
          height: '200dvh',
          width: '200vw',
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '15rem 15rem',
          transform: 'rotate(-17deg)',
          transformOrigin: 'center',
          position: 'relative',
        }}
      >
        {/* Horizontal threads */}
        <div style={{ ...baseGridStyle, transform: 'rotate(0deg)' }}>
          {createTartanGrid(horizontalColors)}
        </div>
    );

        {/* Vertical threads */}
        <div style={{ ...baseGridStyle, transform: 'rotate(90deg)' }}>
          {createTartanGrid(verticalColors)}
        </div>
      </div>
    </div>
  );
};

export default SkewFlatClock;
