import React from 'react';

const SwirlingImages = () => {
  // Generate 12 positions around a circle with different behaviors
  const generatePositions = () => {
    const positions = [];
    const radius = 35; // Percentage of container size for responsiveness
    const centerX = 0;
    const centerY = 0;
    
    // Different speed options
    const speeds = [8, 12, 15, 6, 10, 14, 9, 11, 7, 13, 16, 5];
    // Mix of clockwise and counterclockwise rotations
    const directions = [1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180; // 30 degrees apart
      // Use percentage-based positioning for responsiveness
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      positions.push({ 
        x: `${x}%`, 
        y: `${y}%`, 
        delay: i * 0.2,
        speed: speeds[i],
        direction: directions[i],
        swirlingSpeed: 8 + (i % 4) * 2
      });
    }
    return positions;
  };

  const positions = generatePositions();

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#1f2937',
    margin: 0,
    padding: 0
  };

  const centeringStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const circleContainerStyle = {
    position: 'relative',
    width: 'min(60vmin, 400px)',
    height: 'min(60vmin, 400px)',
    minWidth: '250px',
    minHeight: '250px'
  };

  const circleStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(4px)'
  };

  const centralImageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    width: 'min(12vmin, 128px)',
    height: 'min(12vmin, 128px)',
    minWidth: '80px',
    minHeight: '80px',
    borderRadius: '50%',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '4px solid rgba(255, 255, 255, 0.5)',
    transition: 'transform 0.3s ease',
    animation: 'pulse 2s infinite'
  };

  const centralImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const particleContainerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={centeringStyle}>
        <div style={circleContainerStyle}>
          <div style={circleStyle}>
            {positions.map((pos, index) => {
              const imageSize = `${3 + (index % 3) * 0.8}vmin`;
              
              const swirlImageStyle = {
                position: 'absolute',
                left: `calc(50% + ${pos.x} - ${imageSize}/2)`,
                top: `calc(50% + ${pos.y} - ${imageSize}/2)`,
                width: imageSize,
                height: imageSize,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                animation: `swirl ${pos.swirlingSpeed}s linear infinite, selfSpin ${pos.speed}s linear infinite`,
                animationDelay: `${pos.delay}s, ${pos.delay * 0.5}s`,
                animationDirection: `normal, ${pos.direction > 0 ? 'normal' : 'reverse'}`,
                transformOrigin: `calc(50% - ${pos.x}) calc(50% - ${pos.y})`,
                transition: 'transform 0.3s ease'
              };

              const imgStyle = {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              };

              return (
                <div
                  key={index}
                  style={swirlImageStyle}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={`https://picsum.photos/${64 + (index % 3) * 16}/${64 + (index % 3) * 16}?random=${index + 1}`}
                    alt={`Swirling image ${index + 1}`}
                    style={imgStyle}
                  />
                </div>
              );
            })}

            <div 
              style={centralImageStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            >
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Central image"
                style={centralImgStyle}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={particleContainerStyle}>
        {[...Array(20)].map((_, i) => {
          const particleStyle = {
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 2}s infinite`,
            animationDelay: `${Math.random() * 3}s`
          };

          return <div key={i} style={particleStyle} />;
        })}
      </div>

      <style>{`
        @keyframes swirl {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes selfSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SwirlingImages;