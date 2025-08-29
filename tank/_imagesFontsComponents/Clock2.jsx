import React, { useState, useEffect } from 'react';

// Import fonts and images as modules (examples - replace with your actual files)
// import customFont from './custom-font.woff2';
// import backgroundImg from './clock-bg.jpg';
// import hourHandImg from './hour-hand.png';
// import minuteHandImg from './minute-hand.png';
// import secondHandImg from './second-hand.png';
// import digit12Img from './digit-12.png';
// ... import other digit images

const AnalogClock = ({
  // Clock dimensions
  size = '40vmin', // Default size using viewport units
  
  // Background customization
  backgroundColor = '#ffffff',
  backgroundImage = null,
  borderWidth = '0.2rem',
  borderColor = '#333333',
  borderRadius = '50%',
  
  // Numbers/Digits customization
  showNumbers = true,
  numberFont = 'Arial, sans-serif',
  numberColor = '#333333',
  numberSize = '1.5rem',
  digitImages = null, // Object with keys 1-12 and image URLs as values
  numberOffset = '85%', // Distance from center as percentage
  
  // Ticks customization
  showTicks = true,
  showMinuteTicks = false,
  hourTickColor = '#333333',
  minuteTickColor = '#666666',
  hourTickWidth = '0.15rem',
  minuteTickWidth = '0.05rem',
  hourTickLength = '8%',
  minuteTickLength = '4%',
  
  // Hands customization
  hourHandColor = '#333333',
  minuteHandColor = '#333333',
  secondHandColor = '#ff0000',
  hourHandWidth = '0.4rem',
  minuteHandWidth = '0.3rem',
  secondHandWidth = '0.1rem',
  hourHandLength = '50%',
  minuteHandLength = '70%',
  secondHandLength = '85%',
  handImages = null, // Object with hour, minute, second keys and image URLs
  
  // Center dot
  showCenterDot = true,
  centerDotColor = '#333333',
  centerDotSize = '0.8rem',
  
  // Animation
  smoothSecondHand = false,
  
  // Custom font import
  fontModule = null,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, smoothSecondHand ? 16 : 1000); // 60fps for smooth, 1fps for normal

    return () => clearInterval(timer);
  }, [smoothSecondHand]);

  // Load custom font if provided
  useEffect(() => {
    if (fontModule) {
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'ClockCustomFont';
          src: url('${fontModule}') format('woff2');
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, [fontModule]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Calculate angles
  const secondAngle = smoothSecondHand 
    ? (seconds + milliseconds / 1000) * 6 
    : seconds * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = (hours + minutes / 60) * 30;

  // Generate hour numbers or images
  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * parseFloat(numberOffset);
      const y = Math.sin(angle) * parseFloat(numberOffset);
      
      numbers.push(
        <div
          key={i}
          className="clock-number"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${x}%, ${y}%)`,
            fontFamily: fontModule ? 'ClockCustomFont, ' + numberFont : numberFont,
            fontSize: numberSize,
            color: numberColor,
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {digitImages && digitImages[i] ? (
            <img 
              src={digitImages[i]} 
              alt={i} 
              style={{ 
                maxWidth: numberSize, 
                maxHeight: numberSize,
                objectFit: 'contain'
              }}
            />
          ) : (
            i
          )}
        </div>
      );
    }
    return numbers;
  };

  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    
    // Hour ticks
    if (showTicks) {
      for (let i = 0; i < 12; i++) {
        const angle = i * 30;
        ticks.push(
          <div
            key={`hour-${i}`}
            className="hour-tick"
            style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              width: hourTickWidth,
              height: hourTickLength,
              backgroundColor: hourTickColor,
              transformOrigin: `50% calc(${size} / 2)`,
              transform: `translateX(-50%) rotate(${angle}deg)`,
            }}
          />
        );
      }
    }
    
    // Minute ticks
    if (showMinuteTicks) {
      for (let i = 0; i < 60; i++) {
        if (i % 5 !== 0) { // Skip hour positions
          const angle = i * 6;
          ticks.push(
            <div
              key={`minute-${i}`}
              className="minute-tick"
              style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                width: minuteTickWidth,
                height: minuteTickLength,
                backgroundColor: minuteTickColor,
                transformOrigin: `50% calc(${size} / 2)`,
                transform: `translateX(-50%) rotate(${angle}deg)`,
              }}
            />
          );
        }
      }
    }
    
    return ticks;
  };

  // Render clock hand
  const renderHand = (angle, length, width, color, type) => {
    const handImage = handImages && handImages[type];
    
    if (handImage) {
      return (
        <div
          className={`clock-hand hand-${type}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: length,
            height: width,
            transformOrigin: '0 50%',
            transform: `translate(-0%, -50%) rotate(${angle}deg)`,
            backgroundImage: `url(${handImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      );
    }
    
    return (
      <div
        className={`clock-hand hand-${type}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: length,
          height: width,
          backgroundColor: color,
          transformOrigin: '0 50%',
          transform: `translate(-0%, -50%) rotate(${angle}deg)`,
          borderRadius: '0 50% 50% 0',
        }}
      />
    );
  };

  const clockStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
    backgroundColor: backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    margin: '2rem auto',
    boxSizing: 'border-box',
  };

  return (
    <div className="analog-clock-container" style={{ isolation: 'isolate' }}>
      <div className="analog-clock" style={clockStyle}>
        {/* Tick marks */}
        {renderTicks()}
        
        {/* Numbers */}
        {showNumbers && renderNumbers()}
        
        {/* Clock hands */}
        {renderHand(hourAngle, hourHandLength, hourHandWidth, hourHandColor, 'hour')}
        {renderHand(minuteAngle, minuteHandLength, minuteHandWidth, minuteHandColor, 'minute')}
        {renderHand(secondAngle, secondHandLength, secondHandWidth, secondHandColor, 'second')}
        
        {/* Center dot */}
        {showCenterDot && (
          <div
            className="center-dot"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: centerDotSize,
              height: centerDotSize,
              backgroundColor: centerDotColor,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

// Demo component with multiple clock configurations
const ClockDemo = () => {
  return (
    <div style={{ 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        marginBottom: '3rem',
        color: '#333'
      }}>
        Customizable Analog Clock
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(25rem, 1fr))',
        gap: '3rem',
        maxWidth: '80vw',
        margin: '0 auto'
      }}>
        {/* Default Clock */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Default</h3>
          <AnalogClock />
        </div>

        {/* Customized Clock 1 */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Modern Style</h3>
          <AnalogClock 
            size="35vmin"
            backgroundColor="#1a1a1a"
            borderColor="#444"
            borderWidth="0.1rem"
            numberColor="#fff"
            numberFont="'Courier New', monospace"
            hourHandColor="#00ff88"
            minuteHandColor="#0088ff"
            secondHandColor="#ff4444"
            hourTickColor="#666"
            minuteTickColor="#333"
            centerDotColor="#fff"
            showMinuteTicks={true}
          />
        </div>

        {/* Customized Clock 2 */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Classic Style</h3>
          <AnalogClock 
            size="30vmin"
            backgroundColor="#f8f8f8"
            borderColor="#8b4513"
            borderWidth="0.3rem"
            numberColor="#8b4513"
            numberFont="'Times New Roman', serif"
            numberSize="1.8rem"
            hourHandColor="#8b4513"
            minuteHandColor="#8b4513"
            secondHandColor="#d2691e"
            hourHandWidth="0.5rem"
            minuteHandWidth="0.4rem"
            hourTickColor="#8b4513"
            hourTickWidth="0.2rem"
            centerDotColor="#8b4513"
            centerDotSize="1rem"
          />
        </div>

        {/* Smooth Animation Clock */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Smooth Animation</h3>
          <AnalogClock 
            size="28vmin"
            backgroundColor="linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
            borderColor="#fff"
            borderWidth="0.15rem"
            numberColor="#fff"
            numberSize="1.2rem"
            hourHandColor="#fff"
            minuteHandColor="#fff"
            secondHandColor="#ffeb3b"
            smoothSecondHand={true}
            showTicks={false}
            centerDotColor="#fff"
          />
        </div>
      </div>

      <div style={{ 
        marginTop: '4rem', 
        padding: '2rem', 
        backgroundColor: '#fff', 
        borderRadius: '1rem',
        maxWidth: '60rem',
        margin: '4rem auto 0'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Usage Example</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontSize: '0.9rem'
        }}>
{`// Import your assets as modules
import customFont from './my-font.woff2';
import clockBg from './clock-background.jpg';
import hourHand from './hour-hand.png';

// Use the clock with custom options
<AnalogClock 
  size="40vmin"
  backgroundImage={clockBg}
  fontModule={customFont}
  handImages={{
    hour: hourHand,
    minute: './minute-hand.png',
    second: './second-hand.png'
  }}
  digitImages={{
    12: './twelve.png',
    3: './three.png',
    6: './six.png',
    9: './nine.png'
  }}
  smoothSecondHand={true}
  showMinuteTicks={true}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default ClockDemo;