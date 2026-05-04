// VenusClock.jsx
import React, { useEffect, useState } from 'react';

import font20251015 from '@/assets/fonts/2025/25-10-16-venus.ttf';
import fullBg from '@/assets/images/2025/25-10/25-10-16/ve.jpg';
import bgLayer2 from '@/assets/images/2025/25-10/25-10-16/venus.webp';
import bgLayer1 from '@/assets/images/2025/25-10/25-10-16/venus2.webp';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const VenusClock: React.FC = () => {
    const [ready, setReady] = useState<boolean>(false);
    const [time, setTime] = useState(new Date());
    const [clockSizeVh, setClockSizeVh] = useState<number>(30); // default phone size

    const clockRadiusVh = clockSizeVh / 1.1;
    const symbols = ['y', 'Q', 'C', 'D', 'E', '9', 'G', 'H', 'I', 'p', '1', '5'];

    // --- Responsive clock size ---
    useEffect(() => {
        const handleResize = () => {
            const vw = window.innerWidth;
            if (vw < 768)
                setClockSizeVh(30); // phones
            else setClockSizeVh(40); // laptops/desktops
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Preload font + images ---
    useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-venus-font', '1');
        styleEl.innerHTML = `
  @font-face {
    font-family: 'Venus';
    src: url('${font20251015}') format('truetype');
    font-display: swap;
  }
  `;
        document.head.appendChild(styleEl);
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);

    // --- Asset loading ---
    const assetsLoaded = useMultiAssetLoader([fullBg, bgLayer1, bgLayer2]);
    const fontLoaded = useSuspenseFontLoader('Venus');

    useEffect(() => {
        if (assetsLoaded && fontLoaded) {
            setReady(true);
        }
    }, [assetsLoaded, fontLoaded]);

    // --- Clock update ---
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Styles ---
    const outerWrapperStyle: React.CSSProperties = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
    };

    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${clockSizeVh}vh`,
        height: `${clockSizeVh}vh`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        zIndex: 5,
    };

    const backgroundLayerStyle = (src: string, opacity: number): React.CSSProperties => ({
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url("${src}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
        zIndex: 2,
        pointerEvents: 'none',
    });

    const tickCommon: React.CSSProperties = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transformOrigin: 'center',
        background: '#5CC6AD',
    };

    const handCommonStyle: React.CSSProperties = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transformOrigin: 'center bottom',
        background: '#3f2e23',
        borderRadius: '0.1rem',
    };

    const numberStyle = (i: number): React.CSSProperties => ({
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${clockRadiusVh * 0.85}vh) rotate(-${i * 30}deg)`,
        fontSize: `${clockSizeVh * 0.15}vh`,
        fontFamily: 'Venus, serif',
        color: '#3f2e23',
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 9,
    });

    // --- Generate ticks ---
    const ticks = [];
    for (let t = 0; t < 60; t++) {
        const deg = (t / 60) * 360;
        const len = t % 5 === 0 ? 5.9 : 2.9;
        const thickness = t % 5 === 0 ? 0.01 * clockSizeVh : 0.01 * clockSizeVh;
        ticks.push(
            <div
                key={t}
                style={{
                    ...tickCommon,
                    width: `${thickness}vh`,
                    height: `${len}vh`,
                    transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-${clockRadiusVh - len / 2}vh)`,
                    background: '#5CC6ADFF',
                    borderRadius: '0.05rem',
                    boxShadow: `
            0.2vh 0.2vh 0.25vh #F0EEEDFF,
            -0.3vh 0.3vh 0.25vh #3f2e23,
            0.1vh -0.1vh 0.25vh #3f2e23,
            -0.1vh -0.1vh 0.25vh #3f2e23
          `,
                    zIndex: 8,
                }}
            />,
        );
    }

    const hourDeg = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
    const minuteDeg = (time.getMinutes() + time.getSeconds() / 60) * 6;
    const secondDeg = time.getSeconds() * 6;

    const hourStyle: React.CSSProperties = {
        ...handCommonStyle,
        width: '0.8vh',
        height: `${clockRadiusVh * 0.5}vh`,
        transform: `translate(-50%, -50%) rotate(${hourDeg}deg)`,
        zIndex: 10,
    };

    const minuteStyle: React.CSSProperties = {
        ...handCommonStyle,
        width: '0.5vh',
        height: `${clockRadiusVh * 0.75}vh`,
        transform: `translate(-50%, -50%) rotate(${minuteDeg}deg)`,
        zIndex: 11,
    };

    const secondStyle: React.CSSProperties = {
        ...handCommonStyle,
        width: '0.25vh',
        height: `${clockRadiusVh * 0.85}vh`,
        background: '#5CC6AD',
        transform: `translate(-50%, -50%) rotate(${secondDeg}deg)`,
        zIndex: 12,
    };

    if (!ready) {
        return (
            <div style={outerWrapperStyle}>
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#5CC6AD',
                        fontSize: '2rem',
                        fontFamily: 'Venus, serif',
                    }}
                >
                    Loading Venus Clock...
                </div>
            </div>
        );
    }

    return (
        <div style={outerWrapperStyle}>
            <img
                decoding="async"
                loading="lazy"
                src={fullBg}
                alt="background"
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'saturate(0.1)',
                    pointerEvents: 'none',
                }}
            />
            <div style={backgroundLayerStyle(bgLayer1, 1.1)} />
            <div
                id="venus-scroll-bg"
                style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    width: '200%',
                    height: `${clockSizeVh * 1.9}vh`,
                    transform: 'translateY(-50%)',
                    backgroundImage: `url("${bgLayer2}"), url("${bgLayer2}")`,
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: 'auto 100%',
                    opacity: 0.9,
                    zIndex: 1,
                    pointerEvents: 'none',
                    filter:
                        'brightness(1.1) contrast(1.4) saturate(1.2) hue-rotate(80deg)',
                }}
            />
            <div style={containerStyle}>
                {/* translucent white disc behind face */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `55vh`,
                        height: `55vh`,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        background: 'white',
                        opacity: 0.7,
                        zIndex: 6,
                        boxShadow: 'inset 0 0 2vh rgba(0,0,0,0.3)',
                    }}
                />

                {ticks}
                {symbols.map((char, i) => (
                    <div key={i} style={numberStyle(i)}>
                        {char}
                    </div>
                ))}
                <div style={hourStyle} />
                <div style={minuteStyle} />
                <div style={secondStyle} />
            </div>
        </div>
    );
};

export default VenusClock;
