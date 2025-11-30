import React, { useState, useEffect } from 'react';

const DayNightDivider = () => {
  const [now, setNow] = useState(new Date());
  const [location, setLocation] = useState({
    lat: 40.7128, 
    lon: -74.0060, 
  });

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // IP geolocation
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP Geolocation failed');
        const data = await response.json();
        setLocation({ lat: data.latitude, lon: data.longitude });
      } catch (error) {
        console.error("Could not fetch IP location; using default NYC.", error);
      }
    };
    fetchLocation();
  }, []);

  // SunCalc calculations (simplified implementation)
  const getSunTimes = (date, lat, lon) => {
    const J2000 = 2451545.0;
    const rad = Math.PI / 180;
    const daysSince = Math.floor(date.getTime() / 86400000) - 10957.5;
    const n = daysSince - lon / 360;
    const M = (357.5291 + 0.98560028 * n) % 360;
    const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad);
    const L = (M + C + 180 + 102.9372) % 360;
    const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.44 * rad)) / rad;
    const hourAngle = Math.acos((Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec * rad)) / (Math.cos(lat * rad) * Math.cos(dec * rad))) / rad;
    
    const solarNoon = 720 - 4 * lon - C * 4;
    const sunrise = solarNoon - hourAngle * 4;
    const sunset = solarNoon + hourAngle * 4;
    
    const sunriseDate = new Date(date);
    sunriseDate.setHours(0, sunrise, 0, 0);
    const sunsetDate = new Date(date);
    sunsetDate.setHours(0, sunset, 0, 0);
    
    return { sunrise: sunriseDate, sunset: sunsetDate };
  };

  const { lat, lon } = location;
  const times = getSunTimes(now, lat, lon);
  const sunrise = times.sunrise;
  const sunset = times.sunset;

  const dayLengthMs = sunset.getTime() - sunrise.getTime();
  const totalDayMs = 24 * 60 * 60 * 1000;
  const dayPercentage = Math.max(20, Math.min(80, (dayLengthMs / totalDayMs) * 100));
  
  // Calculate current position in the day cycle for smooth transitions
  const currentMs = now.getTime();
  let currentDayPosition;
  
  if (currentMs < sunrise.getTime()) {
    // Before sunrise - in previous night
    const prevSunset = new Date(sunrise);
    prevSunset.setHours(prevSunset.getHours() - (24 - dayLengthMs / (60 * 60 * 1000)));
    const nightLength = sunrise.getTime() - prevSunset.getTime();
    const nightProgress = (currentMs - prevSunset.getTime()) / nightLength;
    currentDayPosition = nightProgress * (100 - dayPercentage);
  } else if (currentMs >= sunrise.getTime() && currentMs <= sunset.getTime()) {
    // During daytime
    const dayProgress = (currentMs - sunrise.getTime()) / dayLengthMs;
    currentDayPosition = (100 - dayPercentage) + (dayProgress * dayPercentage);
  } else {
    // After sunset - current night
    const nightLength = totalDayMs - dayLengthMs;
    const nightProgress = (currentMs - sunset.getTime()) / nightLength;
    currentDayPosition = nightProgress * (100 - dayPercentage);
  }

  const backgroundGradient = `linear-gradient(to bottom, #fbbf24 0% ${currentDayPosition}%, #1e3a8a ${currentDayPosition}% 100%)`;

  // Digital clock formatting (24-hour format)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const hourDigits = [hours[0], hours[1]];
  const minuteDigits = [minutes[0], minutes[1]];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: backgroundGradient,
        transition: 'background 1s ease-in-out',
      }}
    >
      {/* SUN — size changes with day length, position tracks time */}
      <div
        style={{
          position: 'absolute',
          top: `calc(${currentDayPosition}vh - ${15 * (dayPercentage/100)}vh)`,
          left: '15vw',
          width: `${30 * (dayPercentage/100)}vh`,
          height: `${30 * (dayPercentage/100)}vh`,
          backgroundColor: '#fcd34d',
          borderRadius: '50%',
          boxShadow: `0 0 ${80 * (dayPercentage/100)}px #fcd34d`,
          opacity: 0.95,
        }}
      />

      {/* MOON — size changes with night length, position tracks time */}
      <div
        style={{
          position: 'absolute',
          top: `calc(${currentDayPosition}vh - ${12 * ((100-dayPercentage)/100)}vh)`,
          right: '15vw',
          width: `${24 * ((100-dayPercentage)/100)}vh`,
          height: `${24 * ((100-dayPercentage)/100)}vh`,
          backgroundColor: '#e0e7ff',
          borderRadius: '50%',
          boxShadow: `0 0 ${70 * ((100-dayPercentage)/100)}px #93c5fd`,
          opacity: 0.95,
        }}
      />

      {/* Digital Clock */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5vw',
          fontSize: '6vh',
          fontWeight: 'bold',
          padding: '1vh 2vw',
          borderRadius: '1vh',
          pointerEvents: 'none',
          userSelect: 'none',
          backgroundColor: 'rgba(0,0,0,0.2)',
          boxShadow: '0 0 20px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {[...hourDigits, ':', ...minuteDigits].map((char, i) => (
          <div 
            key={`char-${i}`}
            style={{
              position: 'relative',
              width: char === ':' ? '0.5em' : '1em',
              height: '1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Day part */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${currentDayPosition}%`,
                background: 'linear-gradient(to bottom, #fbbf24, #fbbf24)',
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            >
              {char}
            </div>
            {/* Night part */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: `${100 - currentDayPosition}%`,
                background: 'linear-gradient(to bottom, #1e3a8a, #1e3a8a)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            >
              {char}
            </div>
          </div>
        ))}
      </div>

      {/* Hour markers along the side */}
      {[...Array(25)].map((_, i) => {
        const hourPercent = (i / 24) * 100;
        const isCurrentHour = i === now.getHours();
        
        return (
          <div
            key={`hour-${i}`}
            style={{
              position: 'absolute',
              left: '2vw',
              top: `${hourPercent}vh`,
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5vw',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: isCurrentHour ? '3vw' : '2vw',
                height: '2px',
                backgroundColor: hourPercent < currentDayPosition ? '#1e3a8a' : '#fbbf24',
                opacity: isCurrentHour ? 1 : 0.6,
              }}
            />
            <div
              style={{
                fontSize: isCurrentHour ? '2.5vh' : '2vh',
                fontWeight: isCurrentHour ? 'bold' : 'normal',
                fontFamily: 'monospace',
                color: hourPercent < currentDayPosition ? '#1e3a8a' : '#fbbf24',
                textShadow: '0 0 10px rgba(0,0,0,0.3)',
                opacity: isCurrentHour ? 1 : 0.7,
              }}
            >
              {String(i).padStart(2, '0')}:00
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayNightDivider;