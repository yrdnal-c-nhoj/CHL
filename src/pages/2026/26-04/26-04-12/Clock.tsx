import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

// Import hand images
import hourHandImg from '@/assets/images/2026/26-04/26-04-11/hand.webp';
import minuteHandImg from '@/assets/images/2026/26-04/26-04-11/hand2.webp';
import secondHandImg from '@/assets/images/2026/26-04/26-04-11/hand3.gif';
import bgImage from '@/assets/images/2026/26-04/26-04-11/background.jpeg';

// Import marker images
import m1 from '@/assets/images/2026/26-04/26-04-11/1.webp';
import m2 from '@/assets/images/2026/26-04/26-04-11/2.gif';
import m3 from '@/assets/images/2026/26-04/26-04-11/3.gif';
import m4 from '@/assets/images/2026/26-04/26-04-11/4.gif';
import m5 from '@/assets/images/2026/26-04/26-04-11/5.gif';
import m6 from '@/assets/images/2026/26-04/26-04-11/6.webp';
import m7 from '@/assets/images/2026/26-04/26-04-11/7.webp';
import m8 from '@/assets/images/2026/26-04/26-04-11/8.gif';
import m9 from '@/assets/images/2026/26-04/26-04-11/9.webp';
import m10 from '@/assets/images/2026/26-04/26-04-11/10.gif';
import m11 from '@/assets/images/2026/26-04/26-04-11/11.gif';
import m12 from '@/assets/images/2026/26-04/26-04-11/12.webp';
import m13 from '@/assets/images/2026/26-04/26-04-11/13.webp';
import centerImg from '@/assets/images/2026/26-04/26-04-11/center.webp';

const handImages = {
  hour: hourHandImg,
  minute: minuteHandImg,
  second: secondHandImg,
};

const allMatchImages = [
  m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13
];

// Fisher-Yates shuffle
const shuffle = (arr: number[]): number[] => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tempI = newArr[i]!;
    const tempJ = newArr[j]!;
    newArr[i] = tempJ;
    newArr[j] = tempI;
  }
  return newArr;
};

const Clock: React.FC = () => {
  const time = useClockTime();
  const [positionImages, setPositionImages] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const [randomizedMode, setRandomizedMode] = useState(false);
  const shuffledList = useRef<number[]>([]);
  const shuffleIndex = useRef(0);
  const lastProcessedSecond = useRef<number>(-1);

  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  useEffect(() => {
    if (seconds !== lastProcessedSecond.current) {
      lastProcessedSecond.current = seconds;

      setPositionImages(prev => {
        const next = [...prev];
        const positionToChange = (11 - (seconds % 12));

        if (!randomizedMode) {
          // Initial phase: fill all 12 positions, add 13th at second 1
          if (seconds === 1) {
            next[0] = 12;
            // Check if all 13 unique images are now displayed
            if (new Set(next).size === 13) {
              setRandomizedMode(true);
              shuffledList.current = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
              shuffleIndex.current = 0;
            }
          } else {
            const currentImages = new Set(next);
            const unusedImageIndex = allMatchImages.findIndex((_, idx) => !currentImages.has(idx));
            if (unusedImageIndex !== -1) {
              next[positionToChange] = unusedImageIndex;
            }
          }
        } else {
          // Randomized mode: pick from shuffled list
          const imageToShow = shuffledList.current[shuffleIndex.current];
          if (imageToShow !== undefined) {
            next[positionToChange] = imageToShow;
          }

          shuffleIndex.current++;
          if (shuffleIndex.current >= 13) {
            // Reshuffle for next cycle
            shuffledList.current = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            shuffleIndex.current = 0;
          }
        }
        return next;
      });
    }
  }, [seconds, randomizedMode]);

  const rotations = useMemo(() => {
    const s = seconds + milliseconds / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    
    return {
      secondDegrees: s * 6,
      minuteDegrees: m * 6,
      hourDegrees: h * 30,
    };
  }, [time, seconds, milliseconds]);

  const getHandStyle = (deg: number, transition: boolean): React.CSSProperties => ({
    transform: `translateX(-50%) rotate(${deg}deg)`,
    transition: transition && milliseconds >= 100 ? 'transform 0.1s linear' : 'none',
  });

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bgImage})` }}>
      <div className={styles.clockWrapper}>
        
        {/* Hour Markers (1 to 12) */}
        {positionImages.map((imageIdx, i) => {
          const hour = i + 1;
          const angle = hour * 30 - 90; // Offset by 90 to start at 3 o'clock position mathematically
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 40 * Math.cos(rad); // 40% radius to keep icons inside the circle
          const y = 50 + 40 * Math.sin(rad);

          return (
            <img
              key={i}
              src={allMatchImages[imageIdx]}
              alt={`marker-${hour}`}
              className={styles.marker}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}

        {/* Clock Hands */}
        <img
          src={handImages.hour}
          className={`${styles.hand} ${styles.hourHand}`}
          style={getHandStyle(rotations.hourDegrees, false)}
          alt="hour hand"
        />
        <img
          src={handImages.minute}
          className={`${styles.hand} ${styles.minuteHand}`}
          style={getHandStyle(rotations.minuteDegrees, false)}
          alt="minute hand"
        />
        <img
          src={handImages.second}
          className={`${styles.hand} ${styles.secondHand}`}
          style={getHandStyle(rotations.secondDegrees, true)}
          alt="second hand"
        />

        {/* Center Image */}
        <img
          src={centerImg}
          alt="center"
          className={styles.centerImage}
        />

      </div>
    </div>
  );
};

export default Clock;