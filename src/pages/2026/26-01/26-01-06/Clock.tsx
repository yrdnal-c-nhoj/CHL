// src/components/PyramidzBackground.jsx
import { useState, useEffect } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
// Vite public folder imports (root-relative → auto-hashed in prod)
import backgroundImage from '@/assets/images/26_images/26-01/26-01-05/pyr.webp';
import gizaFont from '@/assets/fonts/26fonts/26-01-06-26-01-05-giza.otf?url';
import type { FontConfig } from '@/types/clock';
import { useSecondClock } from '@/utils/hooks';
const { time } = useSecondClock();

export default function PyramidzBackground() {
  const [timeString, setTimeString] = useState<any>('');
  const [bgReady, setBgReady] = useState<boolean>(false);

  // Generate unique font-family name: Giza_20260107
  const dateStr = '20260107'; // JAN 07, 2026
  const uniqueFontFamily = `Giza_${dateStr}`;

  const fontConfigs: FontConfig[] = [
    {
      fontFamily: uniqueFontFamily,
      fontUrl: gizaFont,
    },
  ];

  // Use standardized font loader
  useSuspenseFontLoader(fontConfigs);

  // 2. Inject marquee styles (cleaned up on unmount)
  useEffect(() => {
      updateTime();
    }, [time]);

  // Block render until bg is confirmed loaded
  if (!bgReady) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        // Fade in once ready
        animation: 'pzFadeIn 125ms ease-out forwards',
      }}
    >
      <style>{`
        @keyframes pzFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .pz-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          /* Filter applied ONLY to background image */
          filter: brightness(0.7) contrast(1.5);
        }
      `}</style>
      <div
        className="pz-background"
        style={{ position: 'absolute', inset: 0 }}
       />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div className="pz-marquee-wrapper">
          <div className="pz-marquee-group">{timeString.repeat(20)}</div>
          <div className="pz-marquee-group">{timeString.repeat(20)}</div>
        </div>
      </div>
    </div>
  );
}
