import React from 'react';

const SwirlingImages = () => {
  // Generate 10 images with different starting positions and animation delays
  const images = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    startAngle: Math.random() * 360,
    size: 60 + Math.random() * 40,
    distance: 40 + Math.random() * 60, // Orbit radius around its anchor
    anchorX: Math.random() * 80 + 10,  // % position in viewport horizontally
    anchorY: Math.random() * 80 + 10,  // % position in viewport vertically
    spinDuration: 2 + Math.random() * 4,
    orbitDuration: 6 + Math.random() * 6,
  }));

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {images.map((img) => (
        <div
          key={img.id}
          className="absolute"
          style={{
            top: `${img.anchorY}%`,
            left: `${img.anchorX}%`,
            animation: `orbit-${img.id} ${img.orbitDuration}s linear infinite`,
            '--orbit-distance': `${img.distance}px`,
          }}
        >
          <img
            src={`https://picsum.photos/${Math.floor(img.size)}/${Math.floor(img.size)}?random=${img.id}`}
            alt={`Tumbling image ${img.id + 1}`}
            className="rounded-lg shadow-lg"
            style={{
              width: `${img.size}px`,
              height: `${img.size}px`,
              animation: `spin ${img.spinDuration}s linear infinite`,
            }}
          />
          <style jsx>{`
            @keyframes orbit-${img.id} {
              0% {
                transform: rotate(${img.startAngle}deg) translateX(var(--orbit-distance)) rotate(-${img.startAngle}deg);
              }
              100% {
                transform: rotate(${img.startAngle + 360}deg) translateX(var(--orbit-distance)) rotate(-${img.startAngle + 360}deg);
              }
            }
          `}</style>
        </div>
      ))}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SwirlingImages;
