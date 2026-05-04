import React, { useEffect, useState, useMemo } from 'react';

import cust250921font from '@/assets/fonts/2025/25-09-21-ele.ttf?url';
import stripe2 from '@/assets/images/2025/25-09/25-09-21/air.webp?url';
import stripe4 from '@/assets/images/2025/25-09/25-09-21/earth.webp?url';
import stripe1 from '@/assets/images/2025/25-09/25-09-21/fire.gif?url';
import stripe3 from '@/assets/images/2025/25-09/25-09-21/h2o.webp?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const AnalogClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const fontVar = 'ElementalFont';

    const fontConfigs = useMemo<FontConfig[]>(
        () => [{ fontFamily: fontVar, fontUrl: cust250921font }],
        [],
    );

    useSuspenseFontLoader(fontConfigs);

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 16);
        return () => clearInterval(interval);
    }, []);

    const hour = time.getHours() % 12;
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const millisecond = time.getMilliseconds();

    const stripes = [stripe1, stripe2, stripe3, stripe4];

    const hourDeg = (hour + minute / 60 + second / 3600) * 30;
    const minuteDeg = (minute + second / 60 + millisecond / 60000) * 6;
    const secondDeg = (second + millisecond / 1000) * 6;

    // Hand style helper
    const handStyle = (
        width: string | number,
        height: string | number,
        top: string | number,
        rotateDeg: number,
    ): React.CSSProperties => ({
        position: 'absolute',
        width,
        height,
        top,
        left: '50%',
        transformOrigin: '50% 100%',
        transform: `rotate(${rotateDeg}deg)`,
        backgroundColor: 'transparent',
        borderRadius: '0.25rem',
        zIndex: 5, // lower than numbers
        boxShadow: `
      0.05rem 0.05rem 0 rgba(255, 250, 230, 0.8),
            -0.05rem -0.05rem 0 rgba(0, 0, 0, 0.8)
                `,
    });

    const numberStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.5rem',
        fontFamily: fontVar,
        color: '#fff',
        textShadow: '0.05rem 0.05rem 0 rgba(0,0,0,0.8)',
        zIndex: 10,
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                background: '#000',
                overflow: 'hidden',
            }}
        >
            {/* Background stripes */}
            {stripes.map((stripe, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${stripe})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.3,
                        zIndex: 1,
                    }}
                />
            ))}

            {/* Clock numbers */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
                const angle = (index * 30 - 90) * (Math.PI / 180);
                const radius = 35; // vw
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <div
                        key={num}
                        style={{
                            ...numberStyle,
                            transform: `translate(calc(-50% + ${x}vw), calc(-50% + ${y}vw))`,
                        }}
                    >
                        {num}
                    </div>
                );
            })}

            {/* Clock face + hands */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    height: '70vw',
                    borderRadius: '50%',
                    opacity: '0.8',
                    background: 'transparent',
                    zIndex: 5,
                }}
            >
                {/* Full viewport second hand */}
                <div
                    style={{
                        position: 'absolute',
                        width: '0.2rem',
                        height: '50dvh',
                        top: '50%',
                        left: '50%',
                        transformOrigin: '50% 0%',
                        transform: `rotate(${secondDeg}deg)`,
                        backgroundColor: 'transparent',
                        boxShadow: `
                0.05rem 0.05rem 0 rgba(255, 250, 230, 0.8),
                                    -0.05rem -0.05rem 0 rgba(0,0,0,0.8)
                                    `,
                    }}
                />

                {/* Hour hand */}
                <div style={handStyle('0.5rem', '25%', '25%', hourDeg)} />

                {/* Minute hand */}
                <div style={handStyle('0.35rem', '35%', '15%', minuteDeg)} />

                {/* Second hand */}
                <div style={handStyle('0.2rem', '40%', '10%', secondDeg)} />
            </div>
        </div>
    );
};

export default AnalogClock;
