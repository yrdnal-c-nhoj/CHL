import React, { useEffect, useState } from 'react';
import monofettFont from './Monofett.ttf';

const BarGraphClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const font = new FontFace('Monofett', `url(${monofettFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourHeight = `${(hours / 12) * 100}vh`;
  const minuteHeight = `${(minutes / 60) * 100}vh`;
  const secondHeight = `${(seconds / 60) * 100}vh`;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    backgroundColor: '#e2af2c',
    fontFamily: '"Monofett", monospace',
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
  };

  return (
    <div style={containerStyle}>
      <div style={segmentContainerStyle}>
        <div style={{ ...baseSegmentStyle, height: hourHeight, backgroundColor: '#FF5733' }}>
          <div style={{ ...labelBaseStyle, color: 'rgb(168, 60, 14)' }}>{hours}</div>
        </div>
      </div>

      <div style={segmentContainerStyle}>
        <div style={{ ...baseSegmentStyle, height: minuteHeight, backgroundColor: '#90fe0a' }}>
          <div style={{ ...labelBaseStyle, color: 'rgb(51, 162, 34)' }}>{minutes}</div>
        </div>
      </div>

      <div style={segmentContainerStyle}>
        <div style={{ ...baseSegmentStyle, height: secondHeight, backgroundColor: '#91dfdb' }}>
          <div style={{ ...labelBaseStyle, color: '#61AAA6FF' }}>{seconds}</div>
        </div>
      </div>
    </div>
  );
};

export default BarGraphClock;
