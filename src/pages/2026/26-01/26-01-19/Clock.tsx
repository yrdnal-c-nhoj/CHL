import React, { useState, useEffect, useMemo } from 'react';

import custom260119Font from '@/assets/fonts/2026/26-01-19-migrate.ttf';
import backgroundImage from '@/assets/images/2026/26-01/26-01-19/fllap.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

const fontFamilyName = 'Custom260119Font';

export const fontConfigs = [
    { fontFamily: fontFamilyName, fontUrl: custom260119Font },
];

interface ClockNumbersProps {
    fontFamily: string;
}

// Memoize Numbers so they don't re-render every second
const ClockNumbers = React.memo<ClockNumbersProps>(({ fontFamily }) => (
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

interface ComplexYellowHandProps {
    rotation: number;
    zIndex: number;
    transition?: string;
    size: number;
}

const ComplexYellowHand: React.FC<ComplexYellowHandProps> = ({ rotation, zIndex, transition = 'none', size }) => {
    const radius = size / 2;
    const handWidth = size * 0.008;

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '50%',
                left: '50%',
                width: handWidth,
                height: 0,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                zIndex,
                transition,
            }}
        >
            {/* Arrow head (Black Border Layer) */}
            <div
                style={{
                    position: 'absolute',
                    top: `-${radius * 0.15}vh`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: `${handWidth / 2}vh solid transparent`,
                    borderRight: `${handWidth / 2}vh solid transparent`,
                    borderBottom: `${radius * 0.15}vh solid #000`,
                }}
            />
            {/* Arrow head (Yellow Fill) */}
            <div
                style={{
                    position: 'absolute',
                    top: `-${radius * 0.14}vh`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: `${handWidth / 2.5}vh solid transparent`,
                    borderRight: `${handWidth / 2.5}vh solid transparent`,
                    borderBottom: `${radius * 0.14}vh solid #F1E206`,
                }}
            />
        </div>
    );
};

const ManyHandClock: React.FC = () => {
    const time = useMillisecondClock();
    const [bgReady, setBgReady] = useState(false);

    useSuspenseFontLoader(fontConfigs);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setBgReady(true);
        img.src = backgroundImage;
    }, [backgroundImage]);

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const hourRot = ((hours + minutes / 60) / 12) * 360;
    const minuteRot = ((minutes + seconds / 60) / 60) * 360;
    const baseSecondRot = (seconds / 60) * 360;
    const tickingRot = Math.floor(seconds) * 6;

    const clockSize = 80;

    // Random behaviors driven by current second rotation
    const forgetfulPos = useMemo(() => baseSecondRot - Math.random() * 30, [baseSecondRot]);
    const sleepyPos1 = useMemo(() => baseSecondRot - Math.random() * 20, [baseSecondRot]);
    const sleepyPos2 = useMemo(() => baseSecondRot - Math.random() * 25, [baseSecondRot]);
    const panickedPos = useMemo(() => baseSecondRot + Math.random() * 40, [baseSecondRot]);

    const deviations = useMemo(() => [
        Math.sin(seconds % 1) * 12,
        (seconds % 1 < 0.6 ? -10 : (seconds % 1 - 0.6) * 25),
    ], [seconds]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100dvh',
                background: 'linear-gradient(180deg, #185591 0%, #835CD7 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <time dateTime={time.toISOString()} style={{ display: 'none' }} />
            <div
                style={{
                    width: `${clockSize}vh`,
                    height: `${clockSize}vh`,
                    position: 'relative',
                }}
                aria-hidden="true"
            >
                {/* Main Hands (Hour/Minute) */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        width: `${clockSize * 0.015}vh`,
                        height: `${clockSize * 0.25}vh`,
                        background: '#1E293B',
                        transform: `translateX(-50%) rotate(${hourRot}deg)`,
                        transformOrigin: 'bottom center',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px #8B5CF6',
                        zIndex: 15,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        width: `${clockSize * 0.01}vh`,
                        height: `${clockSize * 0.4}vh`,
                        background: '#1E293B',
                        transform: `translateX(-50%) rotate(${minuteRot}deg)`,
                        transformOrigin: 'bottom center',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px #8B5CF6',
                        zIndex: 11,
                    }}
                />

                {/* --- YELLOW HAND ARMY --- */}

                {/* Regular Second Hand (At very bottom of yellow pile) */}
                <ComplexYellowHand
                    rotation={baseSecondRot}
                    size={clockSize}
                    zIndex={1}
                    transition="none"
                />

                {/* Deviation Hands */}
                {deviations.map((dev, i) => (
                    <ComplexYellowHand
                        key={i}
                        rotation={baseSecondRot + dev}
                        size={clockSize}
                        zIndex={20 + i}
                        transition="transform 0.1s ease-out"
                    />
                ))}

                {/* Forgetful Hand */}
                <ComplexYellowHand
                    rotation={forgetfulPos}
                    size={clockSize}
                    zIndex={40}
                    transition="transform 0.5s ease-out"
                />

                {/* Sleepy Hands */}
                <ComplexYellowHand
                    rotation={sleepyPos1}
                    size={clockSize}
                    zIndex={41}
                    transition="transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                />
                <ComplexYellowHand
                    rotation={sleepyPos2}
                    size={clockSize}
                    zIndex={42}
                    transition="transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
                />

                {/* Ticking Hand */}
                <ComplexYellowHand
                    rotation={tickingRot}
                    size={clockSize}
                    zIndex={90}
                    transition="transform 0.15s cubic-bezier(0.2, 2, 0.4, 1)"
                />

                {/* Panicked Hand (Topmost) */}
                <ComplexYellowHand
                    rotation={panickedPos}
                    size={clockSize}
                    zIndex={150}
                />

                {/* Center Dot */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: `${clockSize * 0.02}vh`,
                        height: `${clockSize * 0.02}vh`,
                        background: '#330202',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 200,
                    }}
                />
            </div>
        </div>
    );
};

export default ManyHandClock;
