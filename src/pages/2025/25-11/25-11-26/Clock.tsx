import React, { useEffect, useState, useRef, memo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';

import videoFile from '@/assets/images/25_images/25-11/25-11-26/esp.mp4';
import videoWebM from '@/assets/images/25_images/25-11/25-11-26/esp.mp4';
import fallbackImg from '@/assets/images/25_images/25-11/25-11-26/birds.webp';
import fontUrl_20251128 from '@/assets/fonts/25fonts/25-11-26-bird.ttf?url';
import styles from './Clock.module.css';

export const assets = [videoFile, videoWebM, fallbackImg, fontUrl_20251128];

export const fontConfigs = [
  {
    fontFamily: 'CustomFont_20251128',
    fontUrl: fontUrl_20251128,
  },
];

const ANIMATION_DURATION = 10000;
const STAGGER_DELAY = 800;

function DigitalTime({ time, timeText, setLetters }: { time: Date; timeText: string; setLetters: (letters: any[]) => void }) {
  useEffect(() => {
    if (!timeText) return;

    const chars = timeText.split('');
    const charCount = chars.length;
    const TOTAL_FLY_IN_TIME = charCount * STAGGER_DELAY;
    const SIT_DURATION =
      ANIMATION_DURATION - TOTAL_FLY_IN_TIME - charCount * STAGGER_DELAY;

    const lettersArr = chars.map((char) => {
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

    lettersArr.forEach((_, i) => {
      setTimeout(() => {
        setLetters((prev) => {
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

    const flyOutDelay = TOTAL_FLY_IN_TIME + SIT_DURATION;
    lettersArr.forEach((letter, i) => {
      setTimeout(
        () => {
          setLetters((prev) => {
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
  }, [timeText, setLetters]);

  return (
    <div className={styles.timeContainer} aria-live="polite">
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      {timeText.split('').map((l, idx) => (
        <span key={idx} className={styles.timeLetter}>
          {l}
        </span>
      ))}
    </div>
  );
}

function BackgroundVideo() {
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const videoRef = useRef(null);

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

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        <source src={videoWebM} type="video/webm" />
      </video>
      <div className={styles.fallback} aria-hidden={!videoFailed}>
        {videoFailed && (
          <span style={{ display: 'none' }}>Fallback background image</span>
        )}
      </div>
    </>
  );
}

function NtpClock() {
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();

  const [timeText, setTimeText] = useState('');
  const [letters, setLetters] = useState<any[]>([]);

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
    const timerRef = { current: null as ReturnType<typeof setTimeout> | null };
    const scheduleUpdate = () => {
      updateTime();
      timerRef.current = setTimeout(scheduleUpdate, ANIMATION_DURATION);
    };
    timerRef.current = setTimeout(scheduleUpdate, ANIMATION_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main className={styles.container}>
      <DigitalTime time={time} timeText={timeText} setLetters={setLetters} />
      <BackgroundVideo />
    </main>
  );
}

const MemoizedNtpClock = memo(NtpClock);
MemoizedNtpClock.displayName = 'Clock_25_11_26';
export default MemoizedNtpClock;
