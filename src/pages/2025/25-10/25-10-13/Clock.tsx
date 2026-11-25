import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import bgImage2 from '@/assets/images/25_images/25-10/25-10-13/ro.jpeg';
import bgImage from '@/assets/images/25_images/25-10/25-10-13/roundhay.webp';
import roundhayFont from '@/assets/fonts/25fonts/25-10-13-rou.ttf?url';
import ifont25100013 from '@/assets/fonts/25fonts/25-10-13-line.otf?url';

import styles from './Clock.module.css';

export const assets = [bgImage, bgImage2, roundhayFont, ifont25100013];

const roundhayFontConfig: FontConfig = {
  fontFamily: 'RoundhayFont',
  fontUrl: roundhayFont,
};

const lineFontConfig: FontConfig = {
  fontFamily: 'Ifont25100013',
  fontUrl: ifont25100013,
};

const Clock_25_10_13 = () => {
  const now = useSmoothClock(25);
  useSuspenseFontLoader([roundhayFontConfig, lineFontConfig]);

  const fontSizeVH = 4; // base size for digits and labels
  const dividerScale = 1.4; // divider scale relative to fontSizeVH

  const z = (n) => (n < 10 ? `0${n}` : `${n}`);

  // Shared color and shadow for digits and labels
  const sharedTextStyle = {
    color: '#F3D784FF',
    textShadow: `
    0px 1px 0 #ff00ff,
      0px -1px 0 #0BCFCFFF
    `,
    fontFamily: "'RoundhayFont', serif",
  };

  const digitBoxStyle = {
    ...sharedTextStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    fontSize: `${fontSizeVH}vh`,
    width: `${fontSizeVH * 0.65}vh`,
    height: `${fontSizeVH}vh`,
  };

  const labelStyle = {
    ...sharedTextStyle,
    fontSize: `${fontSizeVH}vh`,
  };

  const dividerStyle = {
    ...sharedTextStyle,
    fontFamily: "'Ifont25100013', serif",
    fontSize: `${fontSizeVH * dividerScale}vh`,
    opacity: 0.9,
    color: '#F3D889FF',
    textShadow: `
      0px 1px 0 #FF09FFFF,
      0px -1px 0 #0BCFCFFF
    `,
    margin: '0', // tighter spacing
    lineHeight: '0.4', // tight vertical line spacing
  };

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a0b2e',
    position: 'relative',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
  };

  const bgStyle = {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    backgroundImage: `url(${bgImage}), url(${bgImage2})`,
    backgroundSize: 'contain, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: '50% center, center',
    opacity: 0.8,
  };

  const lineStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5vw',
    lineHeight: '1.3',
  };

  const digitsRowStyle = {
    display: 'flex',
    gap: '0.3vw',
  };

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12; // 12-hour format
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = Math.floor(now.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');
  const isAM = hours24 < 12;

  const renderDigits = (value: number | string) => (
    <div style={digitsRowStyle}>
      <time dateTime={now.toISOString()} className={styles.srOnly}>
        {now.toLocaleTimeString()}
      </time>

      {String(value)
        .split('')
        .map((digit, i) => (
          <div key={i} style={digitBoxStyle}>
            {digit}
          </div>
        ))}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={bgStyle} aria-hidden="true" />
      <SRTime time={now} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
        }}
      >
        <div style={dividerStyle}>u</div>

        <div style={lineStyle}>{renderDigits(z(hours12))}</div>

        <div style={lineStyle}>{renderDigits(z(minutes))}</div>

        <div style={lineStyle}>{renderDigits(z(seconds))}</div>

        <div style={lineStyle}>{renderDigits(milliseconds)}</div>

        <div style={lineStyle}>
          <div
            style={{
              ...digitBoxStyle,
              width: 'auto',
              height: 'auto',
              whiteSpace: 'nowrap',
              padding: '0 0.5dvh',
            }}
          >
            {isAM ? 'Ante Meridiem' : 'Post Meridiem'}
          </div>
        </div>
        <div style={dividerStyle}>W</div>
      </div>
    </div>
  );
};

export default Clock_25_10_13;
Clock_25_10_13.displayName = 'Clock_25_10_13';
