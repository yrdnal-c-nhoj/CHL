import React, { useEffect, useState } from 'react';

import m250915font from '@/assets/fonts/2025/25-09-15-plaid.ttf?url';
import backgroundImageUrl from '@/assets/images/2025/25-09/25-09-15/plaid.jpg';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

interface SkewFlatClockProps {
    horizontalColors?: string[];
    verticalColors?: string[];
    verticalRepeats?: number;
    horizontalRepeats?: number;
}

const SkewFlatClock: React.FC<SkewFlatClockProps> = ({
    horizontalColors = ['#BB100AFF', '#FFFFFF', '#026033FF'],
    verticalColors = ['#BB100AFF', '#FFFFFF', '#026033FF'],
    verticalRepeats = 40,
    horizontalRepeats = 30,
}) => {
    const [time, setTime] = useState<string>('');
    const [hue, setHue] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useSuspenseFontLoader([
        {
            fontFamily: 'MyCustomFont',
            fontUrl: m250915font,
        },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toTimeString().slice(0, 8));
            setHue((now.getSeconds() * 6) % 360);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const createTartanGrid = (colors: string[]) => {
        const rows = [];
        for (let row = 0; row < verticalRepeats; row++) {
            const rowColor = colors[row % colors.length];
            const cols = [];
            for (let col = 0; col < horizontalRepeats; col++) {
                cols.push(
                    <span
                        key={`${row}-${col}`}
                        style={{
                            height: '100dvh',
                            width: '100vw',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#F3EFEFFF',
                            filter: `hue-rotate(${hue}deg)`,
                            display: 'inline-block',
                            marginRight: '0.1rem',
                            color: rowColor,
                            opacity: 0.65,
                            fontFamily: 'MyCustomFont',
                        }}
                    >
                        <div
                            role="timer"
                            aria-live="polite"
                            style={{
                                height: '200dvh',
                                width: '200vw',
                                backgroundImage: `url(${backgroundImageUrl})`,
                                backgroundRepeat: 'repeat',
                                backgroundSize: '15rem 15rem',
                                transform: 'rotate(-17deg)',
                                transformOrigin: 'center',
                                position: 'relative',
                            }}
                        >
                            {/* Horizontal threads */}
                            <div style={{
                                fontSize: '2.6rem',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transformOrigin: 'center',
                                transform: 'translate(-50%, -50%) rotate(0deg)'
                            }}>
                                {createTartanGrid(horizontalColors)}
                            </div>
                        </div>
                    </span>,
                );
            }
            rows.push(
                <div key={row} style={{ whiteSpace: 'nowrap', lineHeight: '1.05' }}>
                    {cols}
                </div>,
            );
        }
        return rows;
    };

    const baseGridStyle: React.CSSProperties = {
        fontSize: '2.6rem',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: 'center',
        transform: 'translate(-50%, -50%)',
    };

    if (!isLoaded) {
        return (
            <div
                style={{ height: '100dvh', width: '100vw', backgroundColor: 'black' }}
            />
        );
    }

    return (
        <div
            style={{
                height: '100dvh',
                width: '100vw',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F3EFEFFF',
                filter: `hue-rotate(${hue}deg)`,
            }}
        >
            <div
                role="timer"
                aria-live="polite"
                style={{
                    height: '200dvh',
                    width: '200vw',
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '15rem 15rem',
                    transform: 'rotate(-17deg)',
                    transformOrigin: 'center',
                    position: 'relative',
                }}
            >
                {/* Horizontal threads */}
                <div style={{ ...baseGridStyle, transform: 'rotate(0deg)' }}>
                    {createTartanGrid(horizontalColors)}
                </div>

                {/* Vertical threads */}
                <div style={{ ...baseGridStyle, transform: 'rotate(90deg)' }}>
                    {createTartanGrid(verticalColors)}
                </div>
            </div>
        </div>
    );
};

export default SkewFlatClock;
