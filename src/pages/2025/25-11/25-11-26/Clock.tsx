import React, { useEffect, useState, useRef } from 'react';

import fontUrl_20251128 from '@/assets/fonts/2025/25-11-26-bird.ttf?url';
import fallbackImg from '@/assets/images/2025/25-11/25-11-26/birds.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const videoFile = '/assets/media/25-11-26-esp.mp4';
const videoWebM = '/assets/media/25-11-26-esp.mp4';

// Media file paths in public folder

// Export assets for preloading
export { fallbackImg };

export const fontConfigs = [
    {
        fontFamily: 'CustomFont_20251128',
        fontUrl: fontUrl_20251128,
    },
];

// --- Digital Time Component ---
function DigitalTime() {
    const [timeText, setTimeText] = useState<string>('');
    const [letters, setLetters] = useState<any[]>([]);

    const ANIMATION_DURATION = 10000; // 10 seconds
    const STAGGER_DELAY = 800;

    useSuspenseFontLoader(fontConfigs);

    const updateTime = () => {
        const now = new Date();
        const pastDate = new Date(now.getTime() - ANIMATION_DURATION);
        const hours24 = pastDate.getHours();
        const minutes = pastDate.getMinutes();
        const seconds = pastDate.getSeconds();

        let hour12 = hours24 % 12;
        if (hour12 === 0) hour12 = 12;

        const formattedTime = `${String(hour12).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;
        setTimeText(formattedTime);
    };

    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, ANIMATION_DURATION);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!timeText) return;

        const chars = timeText.split('');
        const charCount = chars.length;
        const TOTAL_FLY_IN_TIME = charCount * STAGGER_DELAY;
        const SIT_DURATION =
            ANIMATION_DURATION - TOTAL_FLY_IN_TIME - charCount * STAGGER_DELAY;

        const lettersArr = chars.map((char: string) => {
            const enterFromRight = Math.random() > 0.5;
            return {
                char,
                enterFromRight,
                style: {
                    display: 'inline-block',
                    opacity: 0,
                    transform: `translate(${enterFromRight ? '120vw' : '-120vw'}, -25vh)`,
                    transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
                },
            };
        });
        setLetters(lettersArr);

        // Fly in
        lettersArr.forEach((_letter: any, i: number) => {
            setTimeout(() => {
                setLetters((prev: any[]) => {
                    const newArr = [...prev];
                    newArr[i].style = {
                        ...newArr[i].style,
                        opacity: 1,
                        transform: 'translate(0, 0)',
                    };
                    return newArr;
                });
            }, i * STAGGER_DELAY);
        });

        // Fly out
        const flyOutDelay = TOTAL_FLY_IN_TIME + SIT_DURATION;
        lettersArr.forEach((letter: any, i: number) => {
            setTimeout(
                () => {
                    setLetters((prev: any[]) => {
                        const newArr = [...prev];
                        newArr[i].style = {
                            ...newArr[i].style,
                            opacity: 0,
                            transform: `translate(${letter.enterFromRight ? '-120vw' : '120vw'}, -25vh)`,
                        };
                        return newArr;
                    });
                },
                flyOutDelay + i * STAGGER_DELAY,
            );
        });
    }, [timeText]);

    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        color: '#8D6222FF',
        fontSize: '10vh',
        textAlign: 'center',
        letterSpacing: '0.05em',
        textShadow: '1px 0 0 white',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        fontFamily: `"CustomFont_20251128", sans-serif`,
    };

    return (
        <div style={containerStyle} aria-live="polite">
            {letters.map((l: any, idx: number) => (
                <span key={idx} style={l.style}>
                    {l.char}
                </span>
            ))}
        </div>
    );
}

// --- Background Video Component ---
const BackgroundVideo: React.FC = () => {
    const [videoFailed, setVideoFailed] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const onError = () => setVideoFailed(true);
        const onCanPlay = () => setVideoFailed(false);

        v.addEventListener('error', onError);
        v.addEventListener('stalled', onError);
        v.addEventListener('canplay', onCanPlay);

        v.play?.().catch(onError);

        return () => {
            v.removeEventListener('error', onError);
            v.removeEventListener('stalled', onError);
            v.removeEventListener('canplay', onCanPlay);
        };
    }, []);

    const containerStyle: React.CSSProperties = {
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
    };

    const videoStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
    };

    const fallbackStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${fallbackImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: videoFailed ? 'block' : 'none',
        zIndex: 5,
    };

    return (
        <div
            style={containerStyle}
            role="region"
            aria-label="Background video and time"
        >
            <DigitalTime />
            <video
                ref={videoRef}
                style={videoStyle}
                loop
                muted
                playsInline
                autoPlay
                preload="metadata"
            >
                <source src={videoFile} type="video/mp4" />
                <source src={videoWebM} type="video/webm" />
            </video>
            <div style={fallbackStyle} aria-hidden={!videoFailed}>
                {videoFailed && (
                    <span style={{ display: 'none' }}>Fallback background image</span>
                )}
            </div>
        </div>
    );
};

export default BackgroundVideo;
