import React from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import treeFont from '@/assets/fonts/25fonts/25-06-05-tree.ttf';
import tree1Img from '@/assets/images/25_images/25-06/25-06-05/tree1.webp';
import tree2Img from '@/assets/images/25_images/25-06/25-06-05/tree2.webp';
export const assets = [treeFont, tree1Img, tree2Img];


const TreehouseClock =  () => {
  const time = useSmoothClock();

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'TreeFont',
      fontUrl: treeFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const hourStr = hours.toString();

  const digitStyle = {
    color: 'rgb(224, 200, 127)',
    textShadow:
      'red 0.04vw 0 0.1vw, rgb(1, 16, 1) 0 -0.1vw 0.1vw, rgb(175, 192, 24) 0 0 1vw',
    fontSize: '2.7rem',
    fontFamily: 'TreeFont, sans-serif',
    textAlign: 'center',
  };

  const treeStyle1 = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: '92dvh',
    width: '95vw',
    transform: 'translate(-50%, -50%) scaleX(-1)',
    zIndex: 7,
    opacity: 0.6,
  };

  const treeStyle2 = {
    position: 'absolute',
    left: '52%',
    top: '50%',
    height: '93dvh',
    width: '95vw',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    opacity: 0.6,
  };

  const treeStyle2a = {
    position: 'absolute',
    left: '46%',
    top: '50%',
    height: '94dvh',
    width: '93vw',
    transform: 'translate(-50%, -50%) scaleX(-1)',
    zIndex: 5,
    opacity: 0.6,
  };

  const bodyStyle = {
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    width: '100vw',
    background:
      'linear-gradient(180deg, rgb(142, 183, 243) 0%, rgb(108, 164, 197) 80%)',
    position: 'relative',
    overflow: 'hidden',
  };

  const clockStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    zIndex: 5,
    top: '-9dvh',
    gap: '0.3rem',
    left: '-4vw', // 👈 Move to the left
  };

  return (
    <div style={bodyStyle}>
      <img
        decoding="async"
        loading="lazy"
        src={tree1Img}
        alt="tree1"
        style={treeStyle1}
      />
      <img
        decoding="async"
        loading="lazy"
        src={tree2Img}
        alt="tree2"
        style={treeStyle2}
      />
      <img
        decoding="async"
        loading="lazy"
        src={tree2Img}
        alt="tree2"
        style={treeStyle2a}
      />
      <div style={clockStyle}>
        {hourStr.length === 2 ? (
          <>
            <div style={digitStyle}>{hourStr[0]}</div>
            <div style={digitStyle}>{hourStr[1]}</div>
          </>
        ) : (
          <>
            <div style={{ ...digitStyle, visibility: 'hidden' }}>0</div>
            <div style={digitStyle}>{hourStr[0]}</div>
          </>
        )}
        <span style={digitStyle}>:</span>
        <div style={digitStyle}>{minutes[0]}</div>
        <div style={digitStyle}>{minutes[1]}</div>
      </div>
    </div>
  );
}

export default TreehouseClock;
