import React, { useEffect, useMemo, useRef } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import monofettFont from '../../../../assets/fonts/2025/25-04-10-Monofett.ttf?url';

// Component Props interface
interface BarGraphClockProps {
  // No props required for this component
}

const BarGraphClock = () => {
  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'BarGraphClockFont',
      fontUrl: monofettFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth clock updates
  const currentTime = useSecondClock();
  const componentId = useRef(`bargraph-clock-${Date.now()}`);

  const hours = currentTime.getHours() % 12 || 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourHeight = `${(hours / 12) * 100}vh`;
  const minuteHeight = `${(minutes / 60) * 100}vh`;
  const secondHeight = `${(seconds / 60) * 100}vh`;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100dvh',
    width: '100vw',
    margin: 0,
    padding: 0,
    backgroundColor: '#e2af2c',
    fontFamily: 'BarGraphClockFont, monospace',
  };

  const segmentContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '33.33vw',
    height: '100%',
  };

  const baseSegmentStyle = {
    width: '33vw',
    transition: 'height 0.5s ease',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };

  const labelBaseStyle = {
    fontSize: '28vw',
    // lineHeight: '2',
    marginBottom: '50vh',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={segmentContainerStyle}>
        <div
          style={{
            ...baseSegmentStyle,
            height: hourHeight,
            backgroundColor: '#FF5733',
          }}
        >
          <div style={{ ...labelBaseStyle, color: 'rgba(168, 60, 14, 0.71)' }}>
            {hours}
          </div>
        </div>
      </div>

      <div style={segmentContainerStyle}>
        <div
          style={{
            ...baseSegmentStyle,
            height: minuteHeight,
            backgroundColor: '#90fe0a',
          }}
        >
          <div style={{ ...labelBaseStyle, color: 'rgba(51, 162, 34, 0.69)' }}>
            {minutes}
          </div>
        </div>
      </div>

      <div style={segmentContainerStyle}>
        <div
          style={{
            ...baseSegmentStyle,
            height: secondHeight,
            backgroundColor: '#91dfdb',
          }}
        >
          <div style={{ ...labelBaseStyle, color: '#61AAA6BB' }}>{seconds}</div>
        </div>
      </div>
    </div>
  );
};

export default BarGraphClock;
