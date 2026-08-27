import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import mobFontUrl from '@/assets/fonts/25fonts/25-07-16-mob.otf';
import { useSecondClock } from '@/utils/hooks';
export const assets = [mobFontUrl];

const MobiusStripClock =  () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeString, setTimeString] = useState<string>('');

  const fontConfigs = [{ fontFamily: 'mob', fontUrl: mobFontUrl }];
  const fontsLoaded = useSuspenseFontLoader(fontConfigs);

  // Removed undefined updateClock effect - time is reactive via useSecondClock

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100dvh',
        background: 'radial-gradient(circle, #ff5978, #8000ff)',
      }}
    >
      <span
        className="sr-only"
        aria-live="polite"
        style={{ position: 'absolute', opacity: 0 }}
      >
        {timeString}
      </span>
    </div>
  );
};

export default MobiusStripClock;
