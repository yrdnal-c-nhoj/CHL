import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import clockFont from '@/assets/fonts/25fonts/25-08-26-root.ttf';
import bg0 from '@/assets/images/25_images/25-08/25-08-26/rrr.webp';
import bg1 from '@/assets/images/25_images/25-08/25-08-26/ro.gif';
import bg3 from '@/assets/images/25_images/25-08/25-08-26/root.webp';
import styles from './Clock.module.css';

export const assets: string[] = [clockFont, bg0, bg1, bg3];

const fontConfigs = [
  {
    fontFamily: 'ClockFontScoped_18_09_25',
    fontUrl: clockFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

function getTimeParts(now: Date) {
  let h = now.getHours();
  const m = now.getMinutes();
  const period = h < 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  return { hh: String(h), mm: String(m).padStart(2, '0'), period };
}

const Clock = () => {
  const now = useSecondClock();
  const time = getTimeParts(now);

  useSuspenseFontLoader(fontConfigs);

  const layers = useMemo(
    () => [
      {
        img: bg0,
        opacity: 1,
        zIndex: 1,
        width: '120%',
        height: '110%',
        top: '-5%',
        left: '-10%',
      },
      {
        img: bg1,
        zIndex: 8,
        width: '100%',
        height: '120%',
        top: '-10%',
        left: '0%',
      },
      {
        img: bg3,
        opacity: 0.8,
        zIndex: 6,
        invert: 90,
        brightness: 0.9,
        saturation: 0.4,
        width: '100%',
        height: '170%',
        top: '0%',
        left: '0%',
      },
    ],
    []
  );

  return (
    <main className={styles.container}>
      {layers.map((layerProps, i) => {
        if (i === 1) {
          return (
            <React.Fragment key={i}>
              <div className={styles.layer} style={layerStyle(layerProps)} />
              <div
                className={styles.layer}
                style={layerStyle({ ...layerProps, transform: 'scaleX(-1)' })}
              />
            </React.Fragment>
          );
        }
        return (
          <div key={i} className={styles.layer} style={layerStyle(layerProps)} />
        );
      })}

      <div className={styles.clock}>
        {time.hh}
        {time.mm}
        {time.period}
      </div>

      <time dateTime={now.toISOString()} className={styles.srOnly}>
        {time.hh}:{time.mm} {time.period}
      </time>
    </main>
  );
};

function layerStyle(layer) {
  return {
    position: 'absolute',
    top: layer.top || 0,
    left: layer.left || 0,
    width: layer.width || '100%',
    height: layer.height || '100%',
    backgroundImage: `url(${layer.img})`,
    backgroundSize: layer.backgroundSize || 'cover',
    backgroundPosition: layer.backgroundPosition || 'center',
    backgroundRepeat: 'no-repeat',
    opacity: layer.opacity ?? 1,
    zIndex: layer.zIndex || 0,
    pointerEvents: 'none',
    filter: `brightness(${layer.brightness ?? 1}) saturate(${layer.saturation ?? 1}) invert(${layer.invert ?? 0}%) hue-rotate(${layer.hueRotate ?? 0}deg)`,
    transform: layer.transform,
  };
}

const MemoizedClock = React.memo(Clock);
MemoizedClock.displayName = 'Clock_25_08_26';

export default MemoizedClock;
