import React, { useState, useEffect, useMemo, memo } from 'react';

import custom260121Font from '@/assets/fonts/2026/26-01-21-migrate.ttf';
import tileImage from '@/assets/images/2026/26-01/26-01-21/flap.webp';
import backgroundImage from '@/assets/images/2026/26-01/26-01-21/fllap.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
// Explicit Asset Imports

// Export assets for preloading
export { backgroundImage, tileImage };

const fontFamilyName = 'Custom260121Font';

export const fontConfigs = [
    { fontFamily: fontFamilyName, fontUrl: custom260121Font },
    { fontFamily: fontFamilyName, fontUrl: custom260121Font },
];

interface ClockNumbersProps {
    fontFamily: string;
    fontFamily: string;
}

// Memoize the Numbers so they don't re-render every second
const ClockNumbers = memo<ClockNumbersProps>(({ fontFamily }) => (
    <>
        {[...Array(12)].map((_, i) => (
            <div
                key={i}
                style={{
                    ...(styles.numberSlot as React.CSSProperties),
                    transform: `rotate(${i * 30}deg)`,
                }}
            >
                <span style={{ ...styles.number, fontFamily }}>{i === 0 ? 12 : i}</span>
            </div>
        ))}
    </>
  <>
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        style={{
          ...(styles.numberSlot),
          transform: `rotate(${i * 30}deg)`,
        }}
      >
        <span style={{ ...styles.number, fontFamily }}>{i === 0 ? 12 : i}</span>
      </div>
    ))}
  </>
));

const AnalogBirdMigrateClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [time, setTime] = useState(new Date());

    useSuspenseFontLoader(fontConfigs);
    useSuspenseFontLoader(fontConfigs);

    useEffect(() => {
        let frameId: number;
        const tick = () => {
            setTime(new Date());
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, []);
    useEffect(() => {
        let frameId: number;
        const tick = () => {
            setTime(new Date());
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
    const minuteDeg = time.getMinutes() * 6;
    const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
    const minuteDeg = time.getMinutes() * 6;

    return (
        <div style={styles.wrapper}>
            {/* PERFORMANCE FIX: Isolated Background Layer */}
            <div style={styles.gpuAcceleratedLayer as React.CSSProperties}>
                <div style={styles.backgroundLayer as React.CSSProperties} />
                <div style={styles.backgroundLayer2 as React.CSSProperties} />
                <div
                    style={{ ...(styles.tileBase as React.CSSProperties), backgroundSize: '600px', opacity: 0.8 }}
                />
            </div>
            return (
            <div style={styles.wrapper}>
                {/* PERFORMANCE FIX: Isolated Background Layer */}
                <div style={styles.gpuAcceleratedLayer as React.CSSProperties}>
                    <div style={styles.backgroundLayer as React.CSSProperties} />
                    <div style={styles.backgroundLayer2 as React.CSSProperties} />
                    <div
                        style={{ ...(styles.tileBase as React.CSSProperties), backgroundSize: '600px', opacity: 0.8 }}
                    />
                </div>

                <div style={styles.clockFace as React.CSSProperties}>
                    <ClockNumbers fontFamily={fontFamilyName} />
                    <div style={styles.clockFace as React.CSSProperties}>
                        <ClockNumbers fontFamily={fontFamilyName} />

                        {/* Hour Hand */}
                        <div
                            style={{
                                ...styles.hand,
                                height: '24%',
                                width: 'min(1.8vw, 3px)',
                                transform: `translateX(-50%) rotate(${hourDeg}deg)`,
                            }}
                        />
                        {/* Hour Hand */}
                        <div
                            style={{
                                ...styles.hand,
                                height: '24%',
                                width: 'min(1.8vw, 3px)',
                                transform: `translateX(-50%) rotate(${hourDeg}deg)`,
                            }}
                        />

                        {/* Minute Hand */}
                        <div
                            style={{
                                ...styles.hand,
                                height: '45%',
                                width: 'min(1.2vw, 2px)',
                                transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
                            }}
                        />
                        {/* Minute Hand */}
                        <div
                            style={{
                                ...styles.hand,
                                height: '45%',
                                width: 'min(1.2vw, 2px)',
                                transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
                            }}
                        />

                        <div style={styles.pin} />
                    </div>
                </div>
                );
                <div style={styles.pin} />
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #4C6DF3 0%, #798158A2 100%)', // Blue to Dark Blue
    },
    gpuAcceleratedLayer: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        // Forces the GIF to be rendered by the GPU
        transform: 'translateZ(0)',
        willChange: 'transform',
        pointerEvents: 'none',
    },
    backgroundLayer: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.5)',
    },
    backgroundLayer2: {
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
    numberSlot: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '2%',
    },
    number: {
        fontSize: 'min(11vw, 11vh)',
        color: '#830DD2',
        textShadow: '0 0 15px #8B5CF6',
        userSelect: 'none',
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
    wrapper: {
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #4C6DF3 0%, #798158A2 100%)', // Blue to Dark Blue
    },
    gpuAcceleratedLayer: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        // Forces the GIF to be rendered by the GPU
        transform: 'translateZ(0)',
        willChange: 'transform',
        pointerEvents: 'none',
    },
    backgroundLayer: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.5)',
    },
    backgroundLayer2: {
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
    numberSlot: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '2%',
    },
    number: {
        fontSize: 'min(11vw, 11vh)',
        color: '#830DD2',
        textShadow: '0 0 15px #8B5CF6',
        userSelect: 'none',
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

export default AnalogBirdMigrateClock;
