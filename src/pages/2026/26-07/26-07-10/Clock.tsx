import cloudUrl from '@/assets/images/26_images/26-07/26-07-10/clouds.webp?url';
import sunriseUrl from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp?url';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [sunriseUrl, cloudUrl];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const;

type DeviceKind = 'phone' | 'tablet' | 'desktop' | 'tv';

type DeviceLayout = {
  clockSize: string;
  numeralRadius: number;
  hourLen: number;
  minuteLen: number;
  secondLen: number;
  hourW: number;
  minuteW: number;
  secondW: number;
  dot: number;
  fontSize: string;
};

const LAYOUT: Record<DeviceKind, DeviceLayout> = {
  phone: {
    clockSize: 'min(78vmin, 92vw, 85dvh)',
    numeralRadius: 40,
    hourLen: 30,
    minuteLen: 38,
    secondLen: 42,
    hourW: 2.4,
    minuteW: 1.5,
    secondW: 0.65,
    dot: 3.8,
    fontSize: 'clamp(0.75rem, 5.8cqmin, 2.4rem)',
  },
  tablet: {
    clockSize: 'min(56vmin, 70vw, 72dvh)',
    numeralRadius: 40,
    hourLen: 30,
    minuteLen: 38,
    secondLen: 42,
    hourW: 2.1,
    minuteW: 1.35,
    secondW: 0.55,
    dot: 3.5,
    fontSize: 'clamp(0.8rem, 5.5cqmin, 2.8rem)',
  },
  desktop: {
    clockSize: 'min(38vmin, 420px)',
    numeralRadius: 40,
    hourLen: 30,
    minuteLen: 38,
    secondLen: 42,
    hourW: 2.0,
    minuteW: 1.25,
    secondW: 0.5,
    dot: 3.4,
    fontSize: 'clamp(0.7rem, 5.2cqmin, 1.75rem)',
  },
  tv: {
    clockSize: 'min(68vmin, 78vw, 80dvh)',
    numeralRadius: 40,
    hourLen: 30,
    minuteLen: 38,
    secondLen: 42,
    hourW: 2.2,
    minuteW: 1.4,
    secondW: 0.55,
    dot: 3.6,
    fontSize: 'clamp(1rem, 5.5cqmin, 4rem)',
  },
};

/** Detect phone / tablet / desktop / TV from viewport + UA + pointer. */
function detectDevice(): DeviceKind {
  if (typeof window === 'undefined') return 'desktop';

  const w = window.innerWidth;
  const h = window.innerHeight;
  const minSide = Math.min(w, h);
  const maxSide = Math.max(w, h);
  const ua = navigator.userAgent || '';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const tvUa = /TV|SmartTV|AppleTV|GoogleTV|BRAVIA|WebOS|Tizen|CrKey|AFT|Roku/i.test(ua);

  if (tvUa) return 'tv';
  // Large living-room displays: big screen + coarse pointer (remotes)
  if (minSide >= 900 && maxSide >= 1400 && coarse && !fine) return 'tv';
  if (w < 768) return 'phone';
  if (w < 1100) return 'tablet';
  return 'desktop';
}

function useDeviceKind(): DeviceKind {
  const [device, setDevice] = useState<DeviceKind>(() => detectDevice());

  useEffect(() => {
    const update = () => setDevice(detectDevice());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return device;
}

/** Client-side full-res image load (no backend resize / upscale). */
function useClientImage(src: string): string | null {
  const [ready, setReady] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.src = src;

    const commit = () => {
      if (!cancelled) setReady(src);
    };

    if (typeof img.decode === 'function') {
      img.decode().then(commit).catch(commit);
    } else if (img.complete) {
      commit();
    } else {
      img.onload = commit;
      img.onerror = commit;
    }

    return () => {
      cancelled = true;
    };
  }, [src]);

  return ready;
}

const AnalogClock: React.FC = () => {
  const time = useSecondClock();
  const device = useDeviceKind();
  const layout = LAYOUT[device];
  const sunrise = useClientImage(sunriseUrl);
  const cloud = useClientImage(cloudUrl);

  useEffect(() => {
    const fontId = 'google-font-shrikhand';
    if (document.getElementById(fontId)) return;
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap';
    document.head.appendChild(link);
    return () => {
      document.getElementById(fontId)?.remove();
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <main style={styles.stage} data-device={device}>
      {/* Full-res backgrounds as <img> sharper than CSS background + filter tack */}
      {sunrise && (
        <img
          src={sunrise}
          alt=""
          decoding="async"
          fetchPriority="high"
          draggable={false}
          style={styles.bgImage}
        />
      )}
      {cloud && (
        <img
          src={cloud}
          alt=""
          decoding="async"
          draggable={false}
          style={styles.cloudImage}
        />
      )}

      <div
        style={{
          ...styles.clock,
          width: layout.clockSize,
          height: layout.clockSize,
        }}
      >
        <div style={styles.face}>
          {ROMAN.map((numeral, i) => {
            const angle = (i + 1) * 30;
            const rad = (angle * Math.PI) / 180;
            const r = layout.numeralRadius;
            return (
              <div
                key={numeral}
                style={{
                  ...styles.numeral,
                  left: `${50 + r * Math.sin(rad)}%`,
                  top: `${50 - r * Math.cos(rad)}%`,
                  fontSize: layout.fontSize,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              >
                {numeral}
              </div>
            );
          })}

          <div
            style={{
              ...styles.hand,
              width: `${layout.hourW}%`,
              height: `${layout.hourLen}%`,
              marginLeft: `${-layout.hourW / 2}%`,
              backgroundColor: '#fff',
              transform: `rotate(${hourDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: `${layout.minuteW}%`,
              height: `${layout.minuteLen}%`,
              marginLeft: `${-layout.minuteW / 2}%`,
              backgroundColor: '#fff',
              transform: `rotate(${minuteDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: `${layout.secondW}%`,
              height: `${layout.secondLen}%`,
              marginLeft: `${-layout.secondW / 2}%`,
              backgroundColor: '#B4D0F1',
              transform: `rotate(${secondDegrees}deg)`,
            }}
          />
          <div
            style={{
              ...styles.centerDot,
              width: `${layout.dot}%`,
              height: `${layout.dot}%`,
            }}
          />
        </div>
      </div>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  stage: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    margin: 0,
    padding:
      'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    imageRendering: 'auto',
    zIndex: 0,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  cloudImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    imageRendering: 'auto',
    mixBlendMode: 'screen',
    opacity: 0.95,
    zIndex: 1,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  clock: {
    position: 'relative',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 1.5vmin rgba(0,0,0,0.25)',
    containerType: 'size',
  },
  face: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '1cqi',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: '50%',
    backgroundColor: '#B4D0F1',
    transform: 'translate(-50%, -50%)',
    border: '0.45cqi solid #fff',
    boxSizing: 'border-box',
  },
  numeral: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '14%',
    height: '10%',
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: "'Shrikhand', cursive",
    lineHeight: 1,
  },
};

export default AnalogClock;
