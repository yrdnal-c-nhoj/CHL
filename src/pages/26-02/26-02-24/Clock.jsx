import React, { useState, useEffect } from 'react';

const ImageDisplay = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  // Font loading logic
  useEffect(() => {
    const font = new FontFace(
      'Alfa Slab One',
      'url(https://fonts.gstatic.com/s/alfaslabone/v17/6NUQ8FmMKwSEKjnm5-4v-4Jh2dJhe_escmA.woff2)'
    );
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    }).catch(() => setFontLoaded(true));

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time Formatting: "02:45 PM"
  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Split into components: ["0", "2", ":", "4", "5", "PM"]
  const timeParts = timeString.replace(' ', '').split('');
  const amPm = timeString.split(' ')[1];
  const digits = [...timeString.split(' ')[0].split(''), amPm];

  if (!fontLoaded) return <div style={{ background: 'green', height: '100vh' }} />;

  return (
    <div style={containerStyle}>
      <div style={clockWrapper}>
        {digits.map((char, index) => (
          <div 
            key={index} 
            style={{
              ...digitBox,
              // Offset each box slightly for a "scattered" look
              marginTop: index % 2 === 0 ? '-20px' : '20px',
              transform: `rotate(${index % 2 === 0 ? '-5deg' : '5deg'})`
            }}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle = {
  width: '100vw',
  height: '100dvh',
  backgroundColor: '#228B22', // Forest Green
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden'
};

const clockWrapper = {
  display: 'flex',
  gap: '15px',
  alignItems: 'center'
};

const digitBox = {
  fontFamily: "'Alfa Slab One', cursive",
  fontSize: 'clamp(3rem, 10vw, 8rem)',
  color: 'rgba(243, 154, 207, 0.9)',
  // 3px text shadow all around
  textShadow: '3px 3px 0px #fff, -3px -3px 0px #fff, 3px -3px 0px #fff, -3px 3px 0px #fff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: '10px 20px',
  borderRadius: '12px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  minWidth: '1.2em',
  textAlign: 'center',
  transition: 'all 0.3s ease' // Smooth movement when time changes
};

export default ImageDisplay;