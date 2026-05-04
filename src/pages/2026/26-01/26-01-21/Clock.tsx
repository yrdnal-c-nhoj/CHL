import React, { useState, useEffect, useMemo, memo } from 'react';

import custom260121Font from '@/assets/fonts/2026/26-01-21-migrate.ttf';
import tileImage from '@/assets/images/2026/26-01/26-01-21/flap.webp';
import backgroundImage from '@/assets/images/2026/26-01/26-01-21/fllap.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const fontFamilyName = 'Custom260121Font';

export const fontConfigs = [
    { fontFamily: fontFamilyName, fontUrl: custom260121Font },
];

interface ClockNumbersProps {
    fontFamily: string;
}

// Memoize the Numbers so they don't re-render every second
const ClockNumbers = memo<ClockNumbersProps>(({ fontFamily }) => (
    <>
        {[...Array(12)].map((_, i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingTop: '2%',
                    transform: `rotate(${i * 30}deg)`,
                }}
            >
                <span style={{
                    fontSize: 'min(11vw, 11vh)',
                    color: '#830DD2',
                    textShadow: '0 0 15px #8B5CF6',
                    userSelect: 'none',
                    fontFamily
                }}>{i === 0 ? 12 : i}</span>
            </div>
        ))}
    </>
));

const AnalogBirdMigrateClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useSuspenseFontLoader(fontConfigs);

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourDeg = ((hours + minutes / 60) / 12) * 360;
    const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
    const secondDeg = (seconds / 60) * 360;

    const styles: Record<string, React.CSSProperties> = {
        container: {
            position: 'relative',
            width: '100vw',
            height: '100dvh',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #185591 0%, #835CD7 100%)',
        },
        backgroundLayer: {
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5)',
        },
        tileBase: {
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${tileImage})`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
        },
        clockFace: {
            position: 'relative',
            zIndex: 10,
            width: 'min(85vw, 85vh)',
            height: 'min(85vw, 85vh)',
        },
        hand: {
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            borderRadius: '10px',
            backgroundColor: '#830DD2',
            boxShadow: '0 0 20px #8B5CF6',
            zIndex: 15,
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundLayer} />
            <div style={styles.tileBase} />

            <div style={styles.clockFace}>
                <ClockNumbers fontFamily={fontFamilyName} />

                {/* Hour hand */}
                <div
                    style={{
                        ...styles.hand,
                        width: 'min(6vw, 6vh)',
                        height: 'min(25vw, 25vh)',
                        transform: `translateX(-50%) rotate(${hourDeg}deg)`,
                    }}
                />

                {/* Minute hand */}
                <div
                    style={{
                        ...styles.hand,
                        width: 'min(4vw, 4vh)',
                        height: 'min(35vw, 35vh)',
                        transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
                    }}
                />

                {/* Second hand */}
                <div
                    style={{
                        ...styles.hand,
                        width: 'min(2vw, 2vh)',
                        height: 'min(40vw, 40vh)',
                        transform: `translateX(-50%) rotate(${secondDeg}deg)`,
                    }}
                />
            </div>
        </div>
    );
};

export default AnalogBirdMigrateClock;
