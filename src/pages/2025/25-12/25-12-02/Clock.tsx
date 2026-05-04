import React, { useState, useEffect } from 'react';

import backgroundImage from '@/assets/images/2025/25-12/25-12-02/bg.webp';

const ROTATION_DURATION = 240; // seconds for a full rotation (quarter speed)
const ZOOM_MULTIPLIER = 1.5;

const RotatingBackground: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [sideLength, setSideLength] = useState<number>(0);
    const [time, setTime] = useState(new Date());

    // Preload the background image and compute sizes
    useEffect(() => {
        let isMounted = true;

        const computeSize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const diagonal = Math.sqrt(w * w + h * h) * ZOOM_MULTIPLIER;
            setSideLength(diagonal);
        };

        const loadImage = () => {
            const img = new Image();
            img.src = backgroundImage;

            img.onload = () => {
                if (isMounted) {
                    computeSize();
                    window.addEventListener('resize', computeSize);
                    setIsLoading(false);
                }
            };

            img.onerror = () => {
                console.error('Failed to load background image');
                setIsLoading(false);
            };
        };

        loadImage();

        return () => {
            isMounted = false;
            window.removeEventListener('resize', computeSize);
        };
    }, [backgroundImage]);

    // Update rotation angle
    useEffect(() => {
        const interval = setInterval(() => {
            setRotationAngle((prev) => (prev + (360 / ROTATION_DURATION)) % 360);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Update time
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Clock calculations
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const secondAngle = ((seconds + milliseconds / 1000) * 6) - 90;
    const minuteAngle = ((minutes + seconds / 60) * 6) - 90;
    const hourAngle = ((hours + minutes / 60) * 30) - 90;

    const clockRadius = Math.min(window.innerWidth, window.innerHeight) * 0.3;

    const handStyle = (length: number, width: number, color: string, angle: number): React.CSSProperties => ({
        position: 'absolute',
        width: `${width}px`,
        height: `${length}px`,
        backgroundColor: color,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        transformOrigin: 'center',
        borderRadius: `${width / 2}px`,
        boxShadow: '0 0 4px rgba(0,0,0,0.5)',
    });

    const viewportContainerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
    };

    const rotatingImageStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${sideLength}px`,
        height: `${sideLength}px`,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.7,
    };

    const clockStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${clockRadius * 2}px`,
        height: `${clockRadius * 2}px`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(5px)',
    };

    const tickWidth = 2;
    const tickLength = 10;

    if (isLoading) {
        return (
            <div style={viewportContainerStyle}>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontFamily: 'monospace',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div style={viewportContainerStyle}>
            <div style={rotatingImageStyle} />
            <div style={clockStyle}>
                {/* Ticks */}
                {Array.from({ length: 60 }).map((_, i) => {
                    const angle = i * 6;
                    const tickStyle: React.CSSProperties = {
                        position: 'absolute',
                        width: `${tickWidth}px`,
                        height: `${tickLength}px`,
                        backgroundColor: 'white',
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${angle}deg) translateY(-${clockRadius}px)`,
                        transformOrigin: 'center bottom',
                        boxShadow: '0 0 4px white',
                    };
                    return <div key={i} style={tickStyle} />;
                })}

                {/* Minute hand */}
                <div style={handStyle(clockRadius * 0.7, 4, 'white', minuteAngle)} />

                {/* Hour hand */}
                <div style={handStyle(clockRadius * 0.5, 6, 'white', hourAngle)} />

                {/* Smooth Second hand */}
                <div style={handStyle(clockRadius * 0.9, 2, 'white', secondAngle)} />
            </div>
        </div>
    );
};

export default RotatingBackground;
