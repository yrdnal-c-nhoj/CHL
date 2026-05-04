import React, { useState, useEffect, useMemo } from 'react';

import customFontpawww from '@/assets/fonts/2025/25-09-13-anim.ttf?url';
import bgImage from '@/assets/images/2025/25-09/25-09-13/anim.jpg';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const DigitalClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [prevTime, setPrevTime] = useState(new Date());
    const [isHorizontal, setIsHorizontal] = useState<boolean>(
        window.innerWidth >= 768,
    );

    const fontConfigs = useMemo(
        () => [
            {
                fontFamily: 'CustomClockFont',
                fontUrl: customFontpawww,
                options: { weight: 'normal', style: 'normal' },
            },
        ],
        [],
    );
    useSuspenseFontLoader(fontConfigs);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrevTime(time);
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, [time]);

    useEffect(() => {
        const handleResize = () => {
            setIsHorizontal(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDigits = (num: number): string[] => {
        return num.toString().padStart(2, '0').split('');
    };

    const current = {
        hours: formatDigits(time.getHours()),
        minutes: formatDigits(time.getMinutes()),
        seconds: formatDigits(time.getSeconds()),
    };

    const previous = {
        hours: formatDigits(prevTime.getHours()),
        minutes: formatDigits(prevTime.getMinutes()),
        seconds: formatDigits(prevTime.getSeconds()),
    };

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isHorizontal ? '2rem' : '1rem',
        padding: '2rem',
        fontFamily: 'CustomClockFont, monospace',
        fontSize: isHorizontal ? '3rem' : '2rem',
        color: '#fff',
        textShadow: '0 0 10px rgba(0,0,0,0.8)',
    };

    const rowStyle: React.CSSProperties = {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    };

    const digitBoxStyle: React.CSSProperties = {
        position: 'relative',
        width: isHorizontal ? '4rem' : '3rem',
        height: isHorizontal ? '5rem' : '4rem',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(5px)',
    };

    const digitStyle: React.CSSProperties = {
        fontSize: isHorizontal ? '2.5rem' : '2rem',
        fontWeight: 'bold',
        color: '#00ff88',
        textShadow: '0 0 5px rgba(0,255,136,0.5)',
    };

    const renderRow = (current: string[], previous: string[], boxStyle: React.CSSProperties) => {
        return current.map((digit, idx) => {
            const isChanged = digit !== previous[idx];
            return (
                <div key={idx} style={{ ...boxStyle, position: 'relative' }}>
                    <div style={digitStyle}>{digit}</div>
                    {isChanged && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,255,136,0.2)',
                                borderRadius: '0.5rem',
                                animation: 'pulse 0.5s ease-out',
                            }}
                        />
                    )}
                </div>
            );
        });
    };

    return (
        <div style={containerStyle}>
            {/* Hours */}
            <div style={rowStyle}>
                {renderRow(current.hours, previous.hours, digitBoxStyle)}
            </div>

            {/* Minutes */}
            <div style={rowStyle}>
                {renderRow(current.minutes, previous.minutes, digitBoxStyle)}
            </div>

            {/* Seconds */}
            <div style={rowStyle}>
                {renderRow(current.seconds, previous.seconds, digitBoxStyle)}
            </div>
        </div>
    );
};

export default DigitalClock;
