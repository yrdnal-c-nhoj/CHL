import React from 'react';

import font2 from '@/assets/fonts/2025/25-08-25-bar.ttf';
import font1 from '@/assets/fonts/2025/25-08-25-code.ttf';
import bgImage2 from '@/assets/images/2025/25-08/25-08-25/bgla.webp'; // Bottom background
import bgImage from '@/assets/images/2025/25-08/25-08-25/wh.webp'; // Top background
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks/useClockTime';

const DigitalClock: React.FC = () => { // Standardized font loading with font-display: swap to avoid FOUC
    useSuspenseFontLoader([
        {
            fontFamily: 'CodeFont',
            fontUrl: font1,
        },
        {
            fontFamily: 'BarFont',
            fontUrl: font2,
        },
    ]);

    const time = useClockTime('ms');
    const dateTime = time.toISOString();

    const formatTimeDigits = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = date.getMilliseconds();

        hours = hours % 12 || 12;

        return [
            Math.floor(hours / 10),
            hours % 10,
            Math.floor(minutes / 10),
            minutes % 10,
            Math.floor(seconds / 10),
            seconds % 10,
        ];
    };

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: `linear-gradient(to bottom, ${bgImage} 0%, ${bgImage2} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    };

    const digitsContainer: React.CSSProperties = {
        display: 'flex',
        gap: '0.5rem',
        padding: '2rem',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    };

    const digitStyle = (fontFamily: string, fontSize: string): React.CSSProperties => ({
        fontFamily,
        fontSize,
        fontWeight: 'bold',
        color: '#4a3a28',
        textAlign: 'center',
        lineHeight: 1,
        letterSpacing: '0.05em', // slightly inconsistent spacing
        textShadow: `
      1px 0 #4a3a28, 
      -1px 0 #4a3a28,
            0 1px #4a3a28,
                0 - 1px #4a3a28
                    `, // "bleed" edges
        backgroundSize: 'cover',
        WebkitBackgroundClip: 'text',
        filter: 'contrast(85%) brightness(95%)', // slightly faded print
    });

    const digitStack: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const digits = formatTimeDigits(time);

    return (
        <main style={containerStyle}>
            <div style={digitsContainer}>
                <time dateTime={dateTime} style={{ display: 'flex' }}>
                    {digits.map((digit, index) => (
                        <div key={index} style={digitStack}>
                            <div style={digitStyle('BarFont', '0.5rem')}>{digit}</div>
                            <div style={digitStyle('CodeFont', '4rem')}>{digit}</div>
                        </div>
                    ))}
                </time>
            </div>
        </main>
    );
};

export default DigitalClock;
