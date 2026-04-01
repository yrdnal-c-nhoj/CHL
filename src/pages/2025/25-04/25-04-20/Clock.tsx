import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import clouds from '@/assets/images/2025/25-04/25-04-20/clouds.webp';
import cloFont from '@/assets/fonts/2025/25-04-20-clo.ttf?url';

// Component Props interface
interface CloudClockProps {
  // No props required for this component
}

const CloudClock = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'CloFont',
      fontUrl: cloFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();

  const [hoursHTML, setHoursHTML] = useState<string>('');
  const [minutesHTML, setMinutesHTML] = useState<string>('');
  const [ampmHTML, setAmPmHTML] = useState<string>('');

  const getStyledText = useCallback((str: string): string =>
    str
      .split('')
      .map((char, i) => {
        const randomSize = (Math.random() * 11 + 1.5).toFixed(2); // 1.5rem–3.5rem
        return `<span class="digit" style="font-size: ${randomSize}rem;" data-key="${Date.now() + i}">${char}</span>`;
      })
      .join(''), []);

  const updateTime = useCallback((): void => {
    let h = currentTime.getHours();
    const m = currentTime.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    setHoursHTML(getStyledText(String(h)));
    setMinutesHTML(getStyledText(String(m).padStart(2, '0')));
    setAmPmHTML(getStyledText(ampm));
  }, [currentTime, getStyledText]);

  useEffect(() => {
    updateTime();
  }, [updateTime]);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .digit {
          display: inline-block;
          line-height: 0.9;
          color: #E5EBF0FF;
          font-family: 'CloFont', serif;
          text-align: center;
          user-select: none;
          transition: opacity 1s ease, transform 1s ease, font-size 1s ease;
          text-shadow:
            19px 19px 0 #C9D2DEFF,
            -19px -19px 0 #E1E5EBFF,    
            0 -21px 0 #A8C4CCFF,
            -20px 0px 0 #A9B7D2FF,
            0 21px 0 #B3B8CEFF,
            20px 0px 0 #9FB5C1FF,
            -20px 23px 0 #CFD5DDFF,  
            20px -23px 0 #E3E7ECFF;
          opacity: 0;
          transform: scale(0.95);
          animation: fadePulse 5s ease-in-out infinite;
        }

        @keyframes fadePulse {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .timeStack {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'CloFont', serif;
          color: #bed3ef;
          text-align: center;
          gap: 0.2rem;
          z-index: 6;
        }

        @media (min-width: 768px) {
          .timeStack {
            flex-direction: row;
          }
        }
      `}</style>

      <div
        style={{
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          margin: 0,
          padding: 0,
          backgroundSize: 'cover',
        }}
      >
        <div className="timeStack">
          <div id="hours" dangerouslySetInnerHTML={{ __html: hoursHTML }} />
          <div id="minutes" dangerouslySetInnerHTML={{ __html: minutesHTML }} />
          <div id="ampm" dangerouslySetInnerHTML={{ __html: ampmHTML }} />
        </div>

        <img
          decoding="async"
          loading="lazy"
          src={clouds}
          alt="Clouds Background"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2,
            objectFit: 'cover',
          }}
        />
        <img
          decoding="async"
          loading="lazy"
          src={clouds}
          alt="Clouds Background Mirrored"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2,
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            opacity: 0.5,
          }}
        />
      </div>
    </>
  );
};

export default CloudClock;
