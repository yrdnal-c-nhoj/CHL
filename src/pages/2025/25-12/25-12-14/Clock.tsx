import React, { useState, useEffect, useMemo } from 'react';

import screw251214 from '@/assets/fonts/2025/25-12-14-steel.ttf?url';
import bgImage from '@/assets/images/2025/25-12/25-12-14/steel.webp';
import digitTexture from '@/assets/images/2025/25-12/25-12-14/steel2.webp';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useClockTime } from '@/utils/hooks'; // Import the standardized clock hook


// Font imported with today's date (December 16, 2025)
const DigitalClock: React.FC = () => {
    const time = useClockTime(); // Use the standardized clock hook
    const [fontLoaded, setFontLoaded] = useState<boolean>(false);
    // Load and detect the custom font as early as possible
    useEffect(() => {
        if (!document.fonts) {
            setFontLoaded(true); // fallback if FontFaceSet API not supported
            return;
        }

        const font = new FontFace('screw251214', `url(${screw251214})`);

        document.fonts.add(font);

        font
            .load()
            .then(() => {
                setFontLoaded(true);
            })
            .catch(() => {
                setFontLoaded(true); // proceed even if load fails
            });

        // Also listen to the global fonts ready state for safety
        document.fonts.ready.then(() => {
            if (document.fonts.check('1em screw251214')) {
                setFontLoaded(true);
            }
        });
    }, []);

    const { hours, minutes } = useMemo(() => {
        return {
            hours: time.getHours().toString().padStart(2, '0'),
            minutes: time.getMinutes().toString().padStart(2, '0'),
        };
    }, [time]);

    const [textureOffsets] = useState(() =>
        allDigits.map(() => ({
            x: Math.floor(Math.random() * 100),
            y: Math.floor(Math.random() * 100),
        })),
    );

    const containerStyle: React.CSSProperties = {
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        fontFamily: fontLoaded ? '"screw251214", monospace' : 'monospace', // solid fallback before custom font loads
    };

    const clockStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '2vmin',
        alignItems: 'center',
        opacity: fontLoaded ? 1 : 0, // hide until font is ready (avoids FOUC)
        transition: 'opacity 0.2s ease-in',
    };

    const rowStyle: React.CSSProperties = {
        display: 'flex',
        gap: '1.5vmin',
        alignItems: 'center',
    };

    const digitBoxStyle: React.CSSProperties = {
        width: '24vmin',
        height: '24vmin',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    let textureIndex = 0;

    const renderDigits = (digits, prefix) =>
        digits.map((digit, i) => {
            const offset = textureOffsets[textureIndex++];
            return (
                <span key={`${prefix}-${i}`} style={digitBoxStyle}>
                    <span
                        className="digit-text"
                        style={{
                            backgroundImage: `url(${digitTexture})`,
                            backgroundPosition: `${offset.x}% ${offset.y}%`,
                        }}
                    >
                        {digit}
                    </span>
                </span>
            );
        });

    return (
        <div style={containerStyle}>
            <div style={clockStyle}>
                <div style={rowStyle}>{renderDigits(hoursDigits, 'hours')}</div>
                <div style={rowStyle}>{renderDigits(minutesDigits, 'minutes')}</div>
            </div>
            <style>
                {`
          @font-face {
            font-family: 'screw251214';
            src: url(${screw251214}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          .digit-text {
            font-size: 28vmin;
            font-family: inherit;
            line-height: 1;
            font-variant-numeric: tabular-nums;
            font-feature-settings: "tnum";
            background-size: 320% 320%;
            background-repeat: no-repeat;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            filter: contrast(1.15) brightness(1.05);
            text-shadow: -0.3vh -0.3vh 0.0vh rgba(255,255,255,0.35),
                         0.3vh  0.3vh 0.0vh rgba(0,0,0,0.55);
            transform: translateZ(0);
            display: inline-block;
            white-space: nowrap;
          }
        `}
            </style>
        </div>
    );
};

export default DigitalClock;
