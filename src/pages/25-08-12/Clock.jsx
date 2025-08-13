import React, { useState, useEffect } from 'react';

// Web-hosted font URL
const customFontUrl = './Hexa.ttf';

// Define face colors here — 6 colors for the cube faces
const faceColors = [
  '#F2E5C9', // front - red
  '#C19A6B', // back - off-white
  '#8B5E3C', // right - light blue
  '#556B2F', // left - medium blue
  '#1d3557', // top - dark blue
  '#5B6D70'  // bottom - yellow
];

const BiteviteHexahedron = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fontFace = new FontFace('CustomFont', `url(${customFontUrl})`);
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
    }).catch(err => {
      console.error('Font loading failed:', err);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    if (hours === 0) hours = 12;
    if (hours > 12) hours -= 12;
    return `${hours} ${minutes.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime();

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#222' // changed to a dark background without image
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1
  };

  const perspectiveStyle = {
    position: 'relative',
    width: '25rem',
    height: '25rem',
    zIndex: 10,
    perspective: '62.5rem'
  };

  const cubeStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: 'biteviteRotate 20s infinite linear'
  };

  const baseFaceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    // fontWeight: 'bold',
    // boxShadow: '0 1.25rem 2.5rem rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(0.125rem)',
  };

  const timeDisplayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // padding: '0.75rem 1rem',
    // borderRadius: '0.5rem',
    // backdropFilter: 'blur(0.125rem)',
    // border: '0.0625rem solid rgba(255, 255, 255, 0.2)',
    fontFamily: "'CustomFont', 'Courier New', monospace",
    fontSize: '5.5rem',
    // textShadow: '0.125rem 0.125rem 0.5rem rgba(0, 0, 0, 0.8), 0 0 1.25rem rgba(255, 255, 255, 0.3)'
  };

  const faceTransforms = {
    front: 'translateZ(12.5rem)',
    back: 'translateZ(-12.5rem) rotateY(180deg)',
    right: 'rotateY(90deg) translateZ(12.5rem)',
    left: 'rotateY(-90deg) translateZ(12.5rem)',
    top: 'rotateX(90deg) translateZ(12.5rem)',
    bottom: 'rotateX(-90deg) translateZ(12.5rem)'
  };

  return (
    <>
      <style>
        {`
          @keyframes biteviteRotate {
            0% {
              transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }
            25% {
              transform: rotateX(90deg) rotateY(90deg) rotateZ(90deg);
            }
            50% {
              transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg);
            }
            75% {
              transform: rotateX(270deg) rotateY(270deg) rotateZ(270deg);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={overlayStyle}></div>

        <div style={perspectiveStyle}>
          <div style={cubeStyle}>
            {/* Front face */}
            <div
              style={{
                ...baseFaceStyle,
                transform: faceTransforms.front,
                backgroundColor: faceColors[0]
              }}
            >
              <div style={timeDisplayStyle}>{timeString}</div>
            </div>

            {/* Back face */}
            <div
              style={{
                ...baseFaceStyle,
                transform: faceTransforms.back,
                backgroundColor: faceColors[1]
              }}
            >
              <div style={timeDisplayStyle}>{timeString}</div>
            </div>

            {/* Right face */}
            <div
              style={{
                ...baseFaceStyle,
                transform: faceTransforms.right,
                backgroundColor: faceColors[2]
              }}
            >
              <div style={timeDisplayStyle}>{timeString}</div>
            </div>

            {/* Left face */}
            <div
              style={{
                ...baseFaceStyle,
                transform: faceTransforms.left,
                backgroundColor: faceColors[3]
              }}
            >
              <div style={timeDisplayStyle}>{timeString}</div>
            </div>

            {/* Top face */}
            <div
              style={{
                ...baseFaceStyle,
                transform: faceTransforms.top,
                backgroundColor: faceColors[4]
              }}
            >
              <div style={timeDisplayStyle}>{timeString}</div>
            </div>

            {/* Bottom face */}
            <div
              style={{
                ...baseFaceStyle,
                transform: faceTransforms.bottom,
                backgroundColor: faceColors[5]
              }}
            >
              <div style={timeDisplayStyle}>{timeString}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BiteviteHexahedron;
