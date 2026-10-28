import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import font0 from '@/assets/fonts/26fonts/26-10-27/ALBAS___.woff2';
import font1 from '@/assets/fonts/26fonts/26-10-27/BILLD___.woff2';
import font2 from '@/assets/fonts/26fonts/26-10-27/BUTTERFLY-Hollow.woff2';
import font3 from '@/assets/fonts/26fonts/26-10-27/BeastMode-Doubleline.woff2';
import font4 from '@/assets/fonts/26fonts/26-10-27/Bharatic-Fontw.woff2';
import font5 from '@/assets/fonts/26fonts/26-10-27/Blacklettersh.woff2';
import font6 from '@/assets/fonts/26fonts/26-10-27/Brother Signature.woff2';
import font8 from '@/assets/fonts/26fonts/26-10-27/CoasterShadow.woff2';
import font9 from '@/assets/fonts/26fonts/26-10-27/Cute Days.woff2';
import font10 from '@/assets/fonts/26fonts/26-10-27/Dearest outline.woff2';
import font11 from '@/assets/fonts/26fonts/26-10-27/Disko_OT.woff2';
import font12 from '@/assets/fonts/26fonts/26-10-27/GLOREST SHUFLE OUTLINE.woff2';
import font13 from '@/assets/fonts/26fonts/26-10-27/India Hair Style-Hollow.woff2';
import font14 from '@/assets/fonts/26fonts/26-10-27/Maximage ZhiLong.woff2';
import font15 from '@/assets/fonts/26fonts/26-10-27/Noe Land-Demo.woff2';
import font16 from '@/assets/fonts/26fonts/26-10-27/PleaturesDemo-Outline.woff2';
import font17 from '@/assets/fonts/26fonts/26-10-27/PolandCanIntoGlassMakingsItalic-Mmae.woff2';
import font18 from '@/assets/fonts/26fonts/26-10-27/Pullstar-Holinight.woff2';
import font19 from '@/assets/fonts/26fonts/26-10-27/Soviet2e3Di.woff2';
import font20 from '@/assets/fonts/26fonts/26-10-27/Sweet Duck Outline.woff2';
import font21 from '@/assets/fonts/26fonts/26-10-27/TaurusmonooutlineBold-x3ROR.woff2';
import font22 from '@/assets/fonts/26fonts/26-10-27/TheOutline-y4qq.woff2';
import font23 from '@/assets/fonts/26fonts/26-10-27/Thesignature.woff2';
import font24 from '@/assets/fonts/26fonts/26-10-27/benzion3d.woff2';
import font25 from '@/assets/fonts/26fonts/26-10-27/benzion3di.woff2';
import font26 from '@/assets/fonts/26fonts/26-10-27/eggroll3d.woff2';
import font27 from '@/assets/fonts/26fonts/26-10-27/eggroll3dital.woff2';
import font28 from '@/assets/fonts/26fonts/26-10-27/nyet3d.woff2';
import font29 from '@/assets/fonts/26fonts/26-10-27/yamamoto3d.woff2';

import styles from './Clock.module.css';

export const assets = [
  font0,
  font1,
  font2,
  font3,
  font4,
  font5,
  font6,
  font8,
  font9,
  font10,
  font11,
  font12,
  font13,
  font14,
  font15,
  font16,
  font17,
  font18,
  font19,
  font20,
  font21,
  font22,
  font23,
  font24,
  font25,
  font26,
  font27,
  font28,
  font29,
];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Font_26_10_27_ALBAS', fontUrl: font0 },
  { fontFamily: 'Font_26_10_27_BILLD', fontUrl: font1 },
  { fontFamily: 'Font_26_10_27_BUTTERFLY', fontUrl: font2 },
  { fontFamily: 'Font_26_10_27_BEASTMODE', fontUrl: font3 },
  { fontFamily: 'Font_26_10_27_BHARATIC', fontUrl: font4 },
  { fontFamily: 'Font_26_10_27_BLACKLETTERSH', fontUrl: font5 },
  { fontFamily: 'Font_26_10_27_BROTHER_SIG', fontUrl: font6 },
  { fontFamily: 'Font_26_10_27_COASTER', fontUrl: font8 },
  { fontFamily: 'Font_26_10_27_CUTE_DAYS', fontUrl: font9 },
  { fontFamily: 'Font_26_10_27_DEAREST', fontUrl: font10 },
  { fontFamily: 'Font_26_10_27_DISKO', fontUrl: font11 },
  { fontFamily: 'Font_26_10_27_GLOREST', fontUrl: font12 },
  { fontFamily: 'Font_26_10_27_INDIA', fontUrl: font13 },
  { fontFamily: 'Font_26_10_27_MAXIMAGE', fontUrl: font14 },
  { fontFamily: 'Font_26_10_27_NOE_LAND', fontUrl: font15 },
  { fontFamily: 'Font_26_10_27_PLEATURES', fontUrl: font16 },
  { fontFamily: 'Font_26_10_27_POLAND', fontUrl: font17 },
  { fontFamily: 'Font_26_10_27_PULLSTAR', fontUrl: font18 },
  { fontFamily: 'Font_26_10_27_SOVIET', fontUrl: font19 },
  { fontFamily: 'Font_26_10_27_SWEET_DUCK', fontUrl: font20 },
  { fontFamily: 'Font_26_10_27_TAURUS', fontUrl: font21 },
  { fontFamily: 'Font_26_10_27_THEOUTLINE', fontUrl: font22 },
  { fontFamily: 'Font_26_10_27_THESIGNATURE', fontUrl: font23 },
  { fontFamily: 'Font_26_10_27_BENZION3D', fontUrl: font24 },
  { fontFamily: 'Font_26_10_27_BENZION3DI', fontUrl: font25 },
  { fontFamily: 'Font_26_10_27_EGGROLL3D', fontUrl: font26 },
  { fontFamily: 'Font_26_10_27_EGGROLL3DITAL', fontUrl: font27 },
  { fontFamily: 'Font_26_10_27_NYET3D', fontUrl: font28 },
  { fontFamily: 'Font_26_10_27_YAMAMOTO3D', fontUrl: font29 },
];

const ROWS = 12;
const ITEMS_PER_ROW = 40;

const pad = (value: number): string => value.toString().padStart(2, '0');

// Deterministic seeded pseudo-random for consistent assignment per grid slot
const random = (index: number): number => {
  const x = Math.sin(index * 0.01) * 10000;
  return x - Math.floor(x);
};

// Safe array picker — avoids non-null assertions
function pickRandom<T>(arr: readonly T[], seed: number): T {
  const index = Math.floor(random(seed) * arr.length);
  return arr[index] as T;
}

// Maximally distinct colors — evenly spaced hues, high saturation, medium brightness
const COLORS = [
  '#ea5353',
  '#ea5f53',
  '#ea6c53',
  '#ea7653',
  '#ea8253',
  '#ea8f53',
  '#ea9c53',
  '#eaa853',
  '#eab253',
  '#eabf53',
  '#eacb53',
  '#ead853',
  '#eae553',
  '#e5ea53',
  '#d8ea53',
  '#cbea53',
  '#bfea53',
  '#b2ea53',
  '#a8ea53',
  '#9cea53',
  '#8fea53',
  '#82ea53',
  '#76ea53',
  '#6cea53',
  '#5fea53',
  '#53ea53',
  '#53ea5f',
  '#53ea6c',
  '#53ea76',
  '#53ea82',
  '#53ea8f',
  '#53ea9c',
  '#53eaa8',
  '#53eab2',
  '#53eabf',
  '#53eacb',
  '#53ead8',
  '#53eae5',
  '#53e5ea',
  '#53d8ea',
  '#53cbea',
  '#53bfea',
  '#53b2ea',
  '#53a8ea',
  '#539cea',
  '#538fea',
  '#5382ea',
  '#5376ea',
  '#536cea',
  '#535fea',
  '#5353ea',
  '#5f53ea',
  '#6c53ea',
  '#7653ea',
  '#8253ea',
  '#8f53ea',
  '#9c53ea',
  '#a853ea',
  '#b253ea',
  '#bf53ea',
  '#cb53ea',
  '#d853ea',
  '#e553ea',
  '#ea53e5',
  '#ea53d8',
  '#ea53cb',
  '#ea53bf',
  '#ea53b2',
  '#ea53a8',
  '#ea539c',
  '#ea538f',
  '#ea5382',
  '#ea5376',
  '#ea536c',
  '#ea535f',
];

const SIZES_DESKTOP = ['1.2vw', '1.5vw', '1.8vw', '2.5vw', '3.5vw'];
const SIZES_MOBILE = ['5vw', '6vw', '7vw', '9vw', '12vw'];

// Random scale range: 0.4x to 3.5x for more dramatic size variation
const SCALES = [0.4, 0.6, 0.8, 1.0, 1.3, 1.7, 2.2, 2.8, 3.2, 3.5];
const SCALES_MOBILE = [0.8, 1.0, 1.3, 1.7, 2.2, 2.8, 3.5, 4.0, 4.5, 5.0];

const Clock_26_10_27 = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useClock();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 600);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const SIZES = isMobile ? SIZES_MOBILE : SIZES_DESKTOP;
  const SCALES_USED = isMobile ? SCALES_MOBILE : SCALES;

  // 24-hour clock, leading zeros, no colons, no seconds — HHMM
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const displayTime = `${hours}${minutes}`;

  let itemIndex = 0;

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.gridWrapper} aria-hidden="true">
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={styles.row}
            style={
              {
                '--font-family':
                  fontConfigs[rowIndex % fontConfigs.length]?.fontFamily ??
                  'Courier New',
              } as CSSProperties
            }
          >
            <div className={styles.rowContent}>
              {Array.from({ length: ITEMS_PER_ROW }).map((_, i) => {
                const idx = itemIndex++;
                const font = pickRandom(fontConfigs, idx);
                const color = pickRandom(COLORS, idx + 0.5);
                const size = pickRandom(SIZES, idx + 0.25);
                const scale = pickRandom(SCALES_USED, idx + 0.8);

                return (
                  <span
                    key={`r${rowIndex}-${i}`}
                    className={styles.streamItem}
                    style={
                      {
                        '--font-family': font.fontFamily,
                        '--color': color,
                        '--font-size': size,
                        '--scale': scale.toString(),
                      } as CSSProperties
                    }
                  >
                    {displayTime.split('').map((d, j) => (
                      <span
                        key={`d${rowIndex}-${i}-${j}`}
                        className={styles.digitBox}
                      >
                        {d}
                      </span>
                    ))}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

Clock_26_10_27.displayName = 'Clock_26_10_27';

export default Clock_26_10_27;
