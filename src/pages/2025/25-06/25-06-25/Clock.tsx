import React, { useEffect, useRef } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import boneFont from '@/assets/fonts/25fonts/25-06-25-bone.ttf';
import bone from '@/assets/images/25_images/25-06/25-06-25/bone.png';
import bone1 from '@/assets/images/25_images/25-06/25-06-25/bone1.png';
import bone2 from '@/assets/images/25_images/25-06/25-06-25/bone2.png';
import bgImage from '@/assets/images/25_images/25-06/25-06-25/bon.png';
import { useSecondClock } from '@/utils/hooks';
export const assets = [boneFont, bone, bone1, bone2, bgImage];

const BoneClock =  () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const numberContainerRef = useRef(null);
  // useEffect for updateClock removed - time is reactive via useSecondClock

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: '#757272',
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'bone';
          src: url(${boneFont}) format('truetype');
        }

        .bgImage {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200vw;
          height: 100dvh;
          z-index: 0;
          filter: brightness(120%);
          pointer-events: none;
        }
      `}</style>

      <img
        decoding="async"
        loading="lazy"
        src={bgImage}
        className="bgImage"
        alt="background"
      />

      <div
        style={{
          position: 'relative',
          width: '15rem',
          height: '15rem',
          borderRadius: '50%',
          zIndex: 5,
        }}
      >
        <img
          decoding="async"
          loading="lazy"
          src={bone2}
          ref={hourRef}
          className="hand-img"
          alt="hour hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            height: '4rem',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        <img
          decoding="async"
          loading="lazy"
          src={bone1}
          ref={minuteRef}
          className="hand-img"
          alt="minute hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            height: '7rem',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <img
          decoding="async"
          loading="lazy"
          src={bone}
          ref={secondRef}
          className="hand-img"
          alt="second hand"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%) rotate(0deg)',
            height: '8rem',
            filter: 'brightness(0.8) contrast(1.3)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          ref={numberContainerRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default BoneClock;
