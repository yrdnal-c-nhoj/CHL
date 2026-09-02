import { useEffect, useRef, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import sliFont from '@/assets/fonts/25fonts/25-07-10-sli.otf';
import sli2Font from '@/assets/fonts/25fonts/25-07-10-sli2.ttf';
import { useClock } from '@/utils/hooks';
export const assets = [sliFont, sli2Font];

const Clock =  () => {
  const digitGroups = [
    'hour-tens',
    'hour-ones',
    'minute-tens',
    'minute-ones',
    'second-tens',
    'second-ones',
  ];
  const [isMobile, setIsMobile] = useState<any>(window.innerWidth <= 600);

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'sli',
      fontUrl: sliFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
    {
      fontFamily: 'sli2',
      fontUrl: sli2Font,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);
  // useEffect for updateClock removed - time is reactive via useClock

  const createDigitStrip = (id) => {
    const maxDigit = id === 'hour-tens' ? 2 : 9;
    return Array.from({ length: maxDigit + 1 }, (_, digit) => (
      <div
        key={digit}
        className="digit"
        style={{
          width: '2.375rem',
          height: '2.375rem',
          lineHeight: '2.375rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {digit}
      </div>
    ));
  };

  const createAmPmStrip = () =>
    ['A', 'P'].map((letter) => (
      <div
        key={letter}
        className="digit"
        style={{
          width: '2.375rem',
          height: '2.375rem',
          lineHeight: '2.375rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {letter}
      </div>
    ));

  return (
    <div
      className="clock-component"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        backgroundColor: '#080807',
        overflow: 'hidden',
      }}
    >
      <div
        className="clock-container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {digitGroups.map((id) => (
          <div
            key={id}
            id={id}
            className="digit-group"
            style={{
              width: isMobile ? '14.25rem' : '2.375rem',
              height: isMobile ? '2.375rem' : '14.25rem',
              overflow: 'visible',
              position: 'relative',
              display: isMobile ? 'flex' : 'block',
              alignItems: isMobile ? 'center' : 'initial',
            }}
          >
            <div
              className="digit-strip"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                position: 'absolute',
                top: 0,
                left: 0,
                transition: 'transform 0.3s ease',
              }}
            >
              {createDigitStrip(id)}
            </div>
            <div
              className="window"
              style={{
                position: 'absolute',
                top: isMobile ? 0 : '50%',
                left: isMobile ? '50%' : 0,
                transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
                width: '2.375rem',
                height: '2.375rem',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}

        <div
          id="ampm-indicator"
          className="ampm-group"
          style={{
            width: isMobile ? '14.25rem' : '2.375rem',
            height: isMobile ? '2.375rem' : '14.25rem',
            overflow: 'visible',
            position: 'relative',
            display: isMobile ? 'flex' : 'block',
            alignItems: isMobile ? 'center' : 'initial',
          }}
        >
          <div
            className="digit-strip"
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'transform 0.3s ease',
            }}
          >
            {createAmPmStrip()}
          </div>
          <div
            className="window"
            style={{
              position: 'absolute',
              top: isMobile ? 0 : '50%',
              left: isMobile ? '50%' : 0,
              transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
              width: '2.375rem',
              height: '2.375rem',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div
          id="static-m"
          className="ampm-group"
          style={{
            width: '2.375rem',
            height: '2.375rem',
            position: 'relative',
          }}
        >
          <div
            className="static-m"
            style={{
              width: '2.375rem',
              height: '2.375rem',
              lineHeight: '2.375rem',
              textAlign: 'center',
              fontSize: '1.4375rem',
              position: 'absolute',
              top: isMobile ? 0 : '50%',
              left: isMobile ? '50%' : 0,
              transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
              color: 'rgb(98, 105, 174)',
              fontFamily: "'sli2', Courier, monospace",
            }}
          >
            M
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
