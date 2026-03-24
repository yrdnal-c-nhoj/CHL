import React, { useState, useEffect } from 'react';

const VIPParallaxClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Split time into individual characters (digits and colons)
  const timeChars = time.split('');

  return (
    <>
      <style>
        {`
          @keyframes slideUpBG {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes slideUpTiles {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .animate-bg {
            animation: slideUpBG 40s linear infinite;
          }
          .animate-tiles {
            animation: slideUpTiles 15s linear infinite;
          }
          .glass-tile {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 215, 0, 0.2);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .digit-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 0.7em;
            height: 1.2em;
            text-align: center;
            font-family: 'Balloon', system-ui, sans-serif;
          }
          @font-face {
            font-family: 'Balloon';
            src: url('/src/assets/fonts/26-03-22-balloon.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        borderRadius: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        
        {/* LAYER 1: Background Image (Slower) */}
        <div className="animate-bg" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200%', // Doubled for seamless loop
          backgroundImage: 'url("https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          zIndex: 1
        }} />

        {/* LAYER 2: Moving Tiles (Faster) */}
        <div className="animate-tiles" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200%', // Doubled for seamless loop
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 2
        }}>
          {/* We render two sets of the same content to create the infinite replacement loop */}
          {[1, 2].map((group) => (
            <div key={group} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '150px',
              height: '50%',
              justifyContent: 'center' 
            }}>
              <div className="glass-tile" style={{
                padding: '40px 60px',
                borderRadius: '30px',
                textAlign: 'center',
                minWidth: '320px'
              }}>
                <div style={{ 
                  color: '#fbbf24', 
                  fontSize: '12px', 
                  letterSpacing: '4px', 
                  marginBottom: '10px',
                  fontWeight: '900' 
                }}>
                  PREMIUM ACCESS
                </div>
                <div style={{ 
                  fontSize: '4rem', 
                  fontWeight: '300', 
                  color: '#fff',
                  textShadow: '0 0 20px rgba(255,255,255,0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2px'
                }}>
                  {timeChars.map((char, index) => (
                    <span key={index} className="digit-box">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* STATIC OVERLAY (Labels/UI that don't move) */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 10,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px'
        }}>
          EST. 2026 • VIP MODULE
        </div>
      </div>
    </>
  );
};

export default VIPParallaxClock;