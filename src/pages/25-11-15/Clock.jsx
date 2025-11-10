import React, { useState, useEffect } from 'react';

export default function SolarStandardTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [longitude, setLongitude] = useState(-71.1); // Default: Boston area
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate solar time based on longitude
  const calculateSolarTime = (date, lng) => {
    const standardTime = date.getTime();
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = standardTime - timezoneOffset;
    
    // Calculate the longitude of the timezone center
    // Each timezone is 15 degrees wide (360/24)
    const timezoneCenter = Math.round(lng / 15) * 15;
    
    // Calculate the difference in minutes
    const longitudeDiff = lng - timezoneCenter;
    const minutesDiff = longitudeDiff * 4; // 4 minutes per degree
    
    // Equation of time (simplified - varies throughout the year)
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const equationOfTime = -7.66 * Math.sin((360/365) * (dayOfYear + 1) * Math.PI / 180) 
                          + 9.87 * Math.sin(2 * (360/365) * (dayOfYear + 1) * Math.PI / 180);
    
    const solarTimeOffset = (minutesDiff + equationOfTime) * 60000;
    return new Date(standardTime + solarTimeOffset);
  };

  const solarTime = calculateSolarTime(currentTime, longitude);
  const timeDifferenceMinutes = Math.round((solarTime - currentTime) / 60000);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const getSunPosition = (date, isSolar) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const angle = (totalMinutes / 1440) * 360 - 90; // -90 to start at top (midnight)
    return angle;
  };

  const containerStyle = {
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#eee',
    padding: '2vh',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    fontSize: '3vh',
    marginBottom: '3vh',
    textAlign: 'center',
    fontWeight: '600'
  };

  const clocksContainerStyle = {
    display: 'flex',
    gap: '5vh',
    marginBottom: '3vh',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const clockBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5vh'
  };

  const clockStyle = {
    width: '25vh',
    height: '25vh',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '0.5vh solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    boxShadow: '0 0 3vh rgba(0, 0, 0, 0.5)'
  };

  const sunStyle = (angle) => ({
    position: 'absolute',
    width: '3vh',
    height: '3vh',
    background: 'radial-gradient(circle, #ffd700 0%, #ffa500 100%)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-9vh)`,
    boxShadow: '0 0 2vh rgba(255, 215, 0, 0.8)',
    transition: 'transform 0.5s linear'
  });

  const clockLabelStyle = {
    fontSize: '2vh',
    fontWeight: '500',
    color: '#ffd700'
  };

  const timeDisplayStyle = {
    fontSize: '2.5vh',
    fontFamily: 'monospace',
    color: '#fff'
  };

  const infoBoxStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '2vh 3vh',
    borderRadius: '1vh',
    textAlign: 'center',
    maxWidth: '60vh',
    marginBottom: '2vh'
  };

  const differenceStyle = {
    fontSize: '2.5vh',
    fontWeight: 'bold',
    color: Math.abs(timeDifferenceMinutes) > 10 ? '#ff6b6b' : '#4ecdc4',
    marginBottom: '1vh'
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '0.2vh solid rgba(255, 255, 255, 0.3)',
    borderRadius: '0.5vh',
    padding: '1vh 2vh',
    fontSize: '1.8vh',
    color: '#fff',
    width: '30vh',
    marginTop: '1vh'
  };

  const labelStyle = {
    fontSize: '1.6vh',
    marginTop: '2vh',
    opacity: 0.9
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Solar Time vs Standard Time</h1>
      
      <div style={clocksContainerStyle}>
        <div style={clockBoxStyle}>
          <div style={clockLabelStyle}>Standard Time</div>
          <div style={clockStyle}>
            <div style={sunStyle(getSunPosition(currentTime, false))} />
          </div>
          <div style={timeDisplayStyle}>{formatTime(currentTime)}</div>
        </div>

        <div style={clockBoxStyle}>
          <div style={clockLabelStyle}>Solar Time</div>
          <div style={clockStyle}>
            <div style={sunStyle(getSunPosition(solarTime, true))} />
          </div>
          <div style={timeDisplayStyle}>{formatTime(solarTime)}</div>
        </div>
      </div>

      <div style={infoBoxStyle}>
        <div style={differenceStyle}>
          Difference: {Math.abs(timeDifferenceMinutes)} minutes
          {timeDifferenceMinutes > 0 ? ' (Solar ahead)' : ' (Solar behind)'}
        </div>
        <div style={labelStyle}>
          Solar time is based on the sun's position. Standard time uses fixed time zones.
        </div>
      </div>

      <div style={infoBoxStyle}>
        <label style={labelStyle}>
          Your Longitude:
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
            step="0.1"
            min="-180"
            max="180"
            style={inputStyle}
          />
        </label>
        <div style={{...labelStyle, fontSize: '1.4vh', marginTop: '1vh'}}>
          (Enter your longitude to see accurate solar time for your location)
        </div>
      </div>
    </div>
  );
}