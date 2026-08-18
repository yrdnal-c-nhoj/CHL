import React, { useEffect, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import penFontUrl from '@/assets/fonts/25fonts/25-07-11-Pen.ttf';
import { useSecondClock } from '@/utils/hooks';
const PenmanshipClock =  () => {
  const [timeString, setTimeString] = useState<any>('--:--');
  const [ampm, setAmpm] = useState<any>('--');
  const [gridSize, setGridSize] = useState<any>({ columns: 1, rows: 1 });

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'Pen',
      fontUrl: penFontUrl,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  // Update time every second
  useEffect(() => {
      updateTime();
    }, [time]);

  // Calculate grid size
  useEffect(() => {
    const resize =  () => {
      const clockWidthVW = 18;
      const clockHeightVH = 8.2;
      const columns = Math.ceil(100 / clockWidthVW);
      const rows = Math.ceil(100 / clockHeightVH);
      setGridSize({ columns, rows });
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (!fontsLoaded) {
    // Optionally render nothing or a placeholder until font is loaded
    return null; // avoids FOUT completely
  }

  const clocks = [];
  for (let i = 0; i < gridSize.columns * gridSize.rows; i++) {
    clocks.push(
      <div
        key={i}
        style={{
          fontFamily: 'Pen',
          fontSize: '7.6vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(116, 114, 120)',
        }}
      >
        &nbsp;&nbsp;&nbsp;{timeString}&nbsp;
        <span style={{ fontSize: '7.6vw', textTransform: 'lowercase' }}>
          {ampm}
        </span>
      </div>,
    );
  }

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'relative',
        backgroundColor: '#e8df92',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          width: '100vw',
          height: '100vh',
          columnGap: '9vw',
          rowGap: '.1vh',
          gridTemplateColumns: `repeat(${gridSize.columns}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        {clocks}
      </div>
    </div>
  );
};

export default PenmanshipClock;
