import React, { useEffect, useRef } from 'react';

export default function Octahedron() {
  const octaRef = useRef(null);

  useEffect(() => {
    let angleX = 0;
    let angleY = 0;

    const animate = () => {
      angleX += 0.6;
      angleY += 0.8;
      if (octaRef.current) {
        octaRef.current.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const containerStyle = {
    width: '40vh',
    height: '40vh',
    margin: '10vh auto',
    perspective: '100vh',
  };

  const octahedronStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
  };

  const faceStyle = (color, transform) => ({
    position: 'absolute',
    width: '20vh',
    height: '20vh',
    backgroundColor: color,
    opacity: 0.8,
    border: '0.2vh solid white',
    transform: transform,
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  });

  return (
    <div style={containerStyle}>
      <div ref={octaRef} style={octahedronStyle}>
        {/* Top four faces */}
        <div style={faceStyle('red', 'rotateX(0deg) translateZ(10vh)')}/>
        <div style={faceStyle('green', 'rotateY(90deg) rotateX(0deg) translateZ(10vh)')}/>
        <div style={faceStyle('blue', 'rotateY(180deg) rotateX(0deg) translateZ(10vh)')}/>
        <div style={faceStyle('yellow', 'rotateY(-90deg) rotateX(0deg) translateZ(10vh)')}/>

        {/* Bottom four faces */}
        <div style={faceStyle('orange', 'rotateX(180deg) translateZ(10vh)')}/>
        <div style={faceStyle('purple', 'rotateX(90deg) rotateZ(90deg) translateZ(10vh)')}/>
        <div style={faceStyle('pink', 'rotateY(180deg) rotateX(180deg) translateZ(10vh)')}/>
        <div style={faceStyle('cyan', 'rotateX(-90deg) rotateZ(90deg) translateZ(10vh)')}/>
      </div>
    </div>
  );
}
