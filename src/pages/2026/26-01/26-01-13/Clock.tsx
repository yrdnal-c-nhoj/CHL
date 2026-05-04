import React, { useState, useEffect, useRef } from 'react';

const DiscClock: React.FC = () => {
    const [rotation, setRotation] = useState({ h: 0, m: 0, s: 0 });
    const requestRef = useRef<number>();
    const [ready, setReady] = useState<boolean>(false);

    // Use requestAnimationFrame for buttery smooth movement
    const animate = () => {
        const now = new Date();
        const ms = now.getMilliseconds();
        const s = now.getSeconds();
        const m = now.getMinutes();
        const h = now.getHours();

        // Calculate degrees including partial progress for smoothness
        // This creates a "sweeping" motion rather than a "ticking" one
        setRotation({
            s: (s + ms / 1000) * 6, // 360 / 60
            m: (m + s / 60) * 6,
            h: ((h % 12) + m / 60) * 30, // 360 / 12
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        setReady(true);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const styles: Record<string, React.CSSProperties> = {
        container: {
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            margin: 0,
            overflow: 'hidden',
            fontFamily: 'sans-serif',
        },
        clockBase: {
            position: 'relative' as const,
            width: '100vmin',
            height: '100vmin',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        disc: {
            position: 'absolute' as const,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            willChange: 'transform', // Optimization for animations
        },
        leadLine: {
            position: 'absolute' as const,
            top: '0',
            left: '50%',
            width: '2px',
            height: '50%',
            transform: 'translateX(-50%)',
        },
        centerPin: {
            width: '12px',
            height: '12px',
            backgroundColor: '#000',
            borderRadius: '50%',
            zIndex: 10,
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.clockBase}>
                {/* Hour disc */}
                <div
                    style={{
                        ...styles.disc,
                        width: '80vmin',
                        height: '80vmin',
                        backgroundColor: '#FF6B6B',
                        transform: `rotate(${rotation.h}deg)`,
                    }}
                >
                    <div style={styles.leadLine} />
                </div>

                {/* Minute disc */}
                <div
                    style={{
                        ...styles.disc,
                        width: '60vmin',
                        height: '60vmin',
                        backgroundColor: '#4ECDC4',
                        transform: `rotate(${rotation.m}deg)`,
                    }}
                >
                    <div style={styles.leadLine} />
                </div>

                {/* Second disc */}
                <div
                    style={{
                        ...styles.disc,
                        width: '40vmin',
                        height: '40vmin',
                        backgroundColor: '#45B7D1',
                        transform: `rotate(${rotation.s}deg)`,
                    }}
                >
                    <div style={styles.leadLine} />
                </div>

                {/* Center pin */}
                <div style={styles.centerPin} />
            </div>
        </div>
    );
};

export default DiscClock;
