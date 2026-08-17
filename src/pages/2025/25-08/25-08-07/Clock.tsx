import React, { useEffect, useRef } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import myFontUrl from '@/assets/fonts/25fonts/25-08-07-rope.ttf';
import backgroundImageUrl from '@/assets/images/25_images/25-08/25-08-07/wes.webp';
import hourHandImageUrl from '@/assets/images/25_images/25-08/25-08-07/ggg.gif';
import minuteHandImageUrl from '@/assets/images/25_images/25-08/25-08-07/gun.gif';
import secondHandImageUrl from '@/assets/images/25_images/25-08/25-08-07/gunn.gif';
import { useSecondClock } from '@/utils/hooks';
const { time } = useSecondClock();

const AnalogClock =  () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'MyClockFont',
      fontUrl: myFontUrl,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  const canvasRef = useRef(null);

  useEffect(() => {
      drawClock();
    }, [time]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <canvas
        ref={canvasRef}
        className="top-0 left-0 absolute w-full h-full"
        style={{ display: 'block', isolation: 'isolate' }}
      />
    </div>
  );
};

export default AnalogClock;
