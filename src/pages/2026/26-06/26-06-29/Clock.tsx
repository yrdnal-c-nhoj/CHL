import fontUrl from '@/assets/fonts/26fonts/26-06-29.ttf?url';
import carVideo from '@/assets/images/26_images/26-06/26-06-29/manufacture.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';

// Distinct metallic steel profiles
const STEEL_TEXTURES = [
  'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 25%, #999999 50%, #e0e0e0 75%, #888888 100%)', // Brushed Stainless
  'linear-gradient(180deg, #ffffff 0%, #cccccc 35%, #555555 45%, #aaaaaa 60%, #ffffff 100%)', // Polished Chrome
  'linear-gradient(120deg, #535c68 0%, #2c3e50 40%, #7f8c8d 70%, #1e272e 100%)', // Gunmetal Steel
  'linear-gradient(45deg, #3a3d40 0%, #181a1b 30%, #55585a 70%, #232526 100%)', // Raw Forged Steel
  'linear-gradient(160deg, #b8c6db 0%, #f5f7fa 40%, #8e9eab 70%, #efefef 100%)', // Satin Industrial
  'linear-gradient(135deg, #2c3e50 0%, #34495e 30%, #7f8c8d 55%, #1b263b 85%, #415a77 100%)', // Blue-Tempered
  'linear-gradient(90deg, #d5d4d0 0%, #eeeeee 25%, #aaaaaa 50%, #cccccc 75%, #9d9d9d 100%)', // Titanium Steel
  'linear-gradient(210deg, #111111 0%, #444444 25%, #222222 50%, #555555 75%, #111111 100%)', // Dark Damascus
];

interface DigitProps {
  char: string;
  texture: string;
  gridRow: string;
  gridColumn: string;
  isMobile: boolean;
  index: number;
}

const Digit: React.FC<DigitProps> = React.memo(
  ({ char, texture, gridRow, gridColumn, isMobile, index }) => {
    return (
      <div
        style={{
          gridColumn,
          gridRow,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: index + 1,
            pointerEvents: 'none',
            userSelect: 'none',
            background: texture,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            filter: `
              drop-shadow(-1px -1px 0px rgba(255,255,255,0.45))
              drop-shadow(2px 2px 2px rgba(0,0,0,0.85))
              drop-shadow(4px 4px 8px rgba(0,0,0,0.7))
            `,
            fontFamily: 'ClockFont',
            fontSize: isMobile ? '22dvh' : '28vw',
            lineHeight: 0.85,
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {char}
        </div>
      </div>
    );
  },
);

const Manufactured: React.FC = () => {
  const currentTime = useMillisecondClock();

  /*
   * FONT LOADING
   */
  const fontConfigs: FontConfig[] = useMemo(
    () => [
      {
        fontFamily: 'ClockFont',
        fontUrl,
      },
    ],
    []
  );
  useSuspenseFontLoader(fontConfigs);

  /*
   * MOBILE DETECTION
   */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  /*
   * FORMATTED TIME
   */
  const formattedTime = useMemo(() => {
    if (!currentTime) {
      return { hours: '00', minutes: '00', seconds: '00', milliseconds: '00' };
    }
    return {
      hours: currentTime.getHours().toString().padStart(2, '0'),
      minutes: currentTime.getMinutes().toString().padStart(2, '0'),
      seconds: currentTime.getSeconds().toString().padStart(2, '0'),
      milliseconds: currentTime.getMilliseconds().toString().padStart(3, '0'),
    };
  }, [currentTime]);

  const clockCharacters = useMemo(() => {
    const { hours, minutes, seconds, milliseconds } = formattedTime;
    return [
      hours[0] || '0',
      hours[1] || '0',
      minutes[0] || '0',
      minutes[1] || '0',
      seconds[0] || '0',
      seconds[1] || '0',
      milliseconds[0] || '0',
      milliseconds[1] || '0',
    ];
  }, [formattedTime]);

  /*
   * OPTIMIZED GRID MAP CALCULATION
   */
  const gridMap = useMemo(() => {
    return isMobile
      ? [
          ['1', '1'], ['2', '1'],
          ['1', '2'], ['2', '2'],
          ['1', '3'], ['2', '3'],
          ['1', '4'], ['2', '4'],
        ]
      : [
          ['1', '1'], ['2', '1'], ['3', '1'], ['4', '1'],
          ['1', '2'], ['2', '2'], ['3', '2'], ['4', '2'],
        ];
  }, [isMobile]);

  // Extract total seconds as an integer to drive the rotation cycle
  const currentSecondInt = parseInt(formattedTime.seconds, 10) || 0;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100dvh',
        background: '#07090e',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 1,
          filter: 'saturate(130%) contrast(1.4) brightness(1.2)',
          // opacity: 0.35,
        }}
        src={carVideo}
      />

      <time dateTime={currentTime?.toISOString()} aria-live="polite">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
            gridTemplateRows: isMobile ? '1fr 1fr 1fr 1fr' : '1fr 1fr',
            zIndex: 20,
          }}
        >
          {clockCharacters.map((char, index) => {
            // Shift index by current seconds to rotate colors dynamically across digits
            const textureIndex = (index + currentSecondInt) % STEEL_TEXTURES.length;
            const currentTexture = STEEL_TEXTURES[textureIndex];

            // Force re-creation of the element every second to help with background-clip stability
            const elementKey = `${index}-${currentSecondInt}`;

            return (
              <Digit
                key={elementKey}
                char={char}
                texture={currentTexture}
                gridColumn={gridMap[index]?.[0] || '1'}
                gridRow={gridMap[index]?.[1] || '1'}
                index={index}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </time>
    </div>
  );
};

export default Manufactured;