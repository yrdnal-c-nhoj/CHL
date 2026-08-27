import React, { useEffect } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import mintFont from '@/assets/fonts/25fonts/25-07-08-mint.ttf';
import hourImg from '@/assets/images/25_images/25-07/25-07-08/mint.png';
import minuteImg from '@/assets/images/25_images/25-07/25-07-08/minty.webp';
import secondImg from '@/assets/images/25_images/25-07/25-07-08/min.png';
import bgImage from '@/assets/images/25_images/25-07/25-07-08/candy.jpg';
import { useSecondClock } from '@/utils/hooks';
export const assets = [mintFont, hourImg, minuteImg, secondImg, bgImage];

const MintClock =  () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'mint',
      fontUrl: mintFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);
  // useEffect for updateClock removed - time is reactive via useSecondClock

  return (
    <div
      style={{
        margin: 0,
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#85ed6b',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          /* Font loading handled by useSuspenseFontLoader */

          .clock {
            z-index: 6;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60vmin;
            height: 60vmin;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .number {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            font-family: 'mint';
            font-size: 4rem;
            color: #8AE3A8;
            text-shadow: 0.05rem 0.05rem 0 rgb(10, 39, 17), 0.1rem 0.1rem 0 #f1f6f2;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          }

          .number span {
            display: block;
            transform: translateY(-15vmin);
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: 50% 100%;
            transform: translateX(-50%) rotate(0deg);
            pointer-events: none;
            height: auto;
            object-fit: contain;
          }

          .hour {
            height: 10vmin;
            z-index: 2;
          }

          .minute {
            height: 16vmin;
            z-index: 3;
          }

          .second {
            height: 20vmin;
            z-index: 4;
          }

          .bgimage {
            background-image: url(${bgImage});
            background-size: cover;
            background-position: center;
            position: fixed;
            height: 100dvh;
            width: 100vw;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            opacity: 0.4;
          }
        `}
      </style>
      <div className="bgimage" />
      <div className="clock" id="clock">
        <img
          decoding="async"
          loading="lazy"
          className="hand hour"
          src={hourImg}
          alt="Hour Hand"
        />
        <img
          decoding="async"
          loading="lazy"
          className="hand minute"
          src={minuteImg}
          alt="Minute Hand"
        />
        <img
          decoding="async"
          loading="lazy"
          className="hand second"
          src={secondImg}
          alt="Second Hand"
        />
        <div className="center-dot" />
      </div>
    </div>
  );
};

export default MintClock;
