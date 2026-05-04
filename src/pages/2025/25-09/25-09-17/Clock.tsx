import React, { useState, useEffect } from 'react';

import f250917fontt from '@/assets/fonts/2025/25-09-17-crush.ttf?url';
import overlay1 from '@/assets/images/2025/25-09/25-09-17/ccr.gif';
import centerImage from '@/assets/images/2025/25-09/25-09-17/cr.gif'; // middle image
import topImage from '@/assets/images/2025/25-09/25-09-17/crr.gif'; // top overlay image
import overlay2 from '@/assets/images/2025/25-09/25-09-17/cru.gif';
import backgroundImage from '@/assets/images/2025/25-09/25-09-17/crush.jpg';
import overlay3 from '@/assets/images/2025/25-09/25-09-17/crush2.gif';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader, useMultipleFontLoader } from '@/utils/fontLoader';

const pad = (n: number | string) => n.toString().padStart(2, '0');

const DigitalClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [fadeIndex, setFadeIndex] = useState<number>(-1);

    // Load font and images
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
        @font-face {
            font-family: 'CustomClockFont';
            src: url(${f250917fontt}) format('truetype');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
            font-variation-settings: 'wght' 400;
        }
        `;
        document.head.appendChild(style);

        const fontPromise = document.fonts.load('10rem CustomClockFont');

        const loadImage = (src: string) =>
            new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });

        const imagePromises = [
            loadImage(overlay1),
            loadImage(centerImage),
            loadImage(topImage),
            loadImage(overlay2),
            loadImage(backgroundImage),
            loadImage(overlay3),
        ];

        Promise.all([fontPromise, ...imagePromises])
            .then(() => setIsLoaded(true))
            .catch(console.error);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        const interval = setInterval(() => {
            setFadeIndex((prev) => (prev + 1) % 8);
        }, 2000);
        return () => clearInterval(interval);
    }, [isLoaded]);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const digits = [
        Math.floor(hours / 10),
        hours % 10,
        Math.floor(minutes / 10),
        minutes % 10,
        Math.floor(seconds / 10),
        seconds % 10,
    ];

    const getOpacity = (index: number, base: number) => {
        if (fadeIndex === -1) return base;
        const distance = Math.abs(fadeIndex - index);
        return Math.max(0, base - distance * 0.1);
    };

    if (!isLoaded) {
        return (
            <div
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'CustomClockFont, monospace',
                    fontSize: '2rem',
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                background: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
            }}
        >
            {/* Background overlays */}
            <img
                src={overlay1}
                alt="overlay1"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.3,
                    pointerEvents: 'none',
                }}
            />
            <img
                src={overlay2}
                alt="overlay2"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.2,
                    pointerEvents: 'none',
                }}
            />
            <img
                src={overlay3}
                alt="overlay3"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.15,
                    pointerEvents: 'none',
                }}
            />

            {/* Center image */}
            <img
                src={centerImage}
                alt="center"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    height: '60%',
                    objectFit: 'contain',
                    opacity: 0.8,
                }}
            />

            {/* Top overlay */}
            <img
                src={topImage}
                alt="top"
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '20%',
                    objectFit: 'contain',
                    opacity: 0.6,
                }}
            />

            {/* Time digits */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    gap: '2vw',
                    fontFamily: 'CustomClockFont, monospace',
                    fontWeight: 'bold',
                }}
            >
                {digits.map((digit, index) => (
                    <div
                        key={index}
                        style={{
                            fontSize: index === 0 || index === 1 ? '25vh' : '20vh',
                            color: index < 2 ? '#FF6B6B' : index < 4 ? '#4ECDC4' : '#45B7D1',
                            opacity: getOpacity(index, 0.9),
                            transition: 'opacity 0.5s ease-in-out',
                            textShadow: '0 0 20px rgba(255,255,255,0.5)',
                            transform: `rotate(${Math.sin(index) * 5}deg)`,
                        }}
                    >
                        {digit}
                    </div>
                ))}
            </div>

            {/* AM/PM indicator */}
            <div
                style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    fontSize: '3vh',
                    color: '#FFD93D',
                    fontFamily: 'CustomClockFont, monospace',
                    fontWeight: 'bold',
                    opacity: getOpacity(6, 0.8),
                    transition: 'opacity 0.5s ease-in-out',
                }}
            >
                {hours >= 12 ? 'PM' : 'AM'}
            </div>

            {/* Date display */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '2vh',
                    color: '#A8E6CF',
                    fontFamily: 'CustomClockFont, monospace',
                    opacity: getOpacity(7, 0.7),
                    transition: 'opacity 0.5s ease-in-out',
                }}
            >
                {time.toLocaleDateString()}
            </div>
        </div>
    );
};

export default DigitalClock;
