import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import customFont821 from '../../../assets/fonts/25-08-21-wide.ttf?url';
import styles from './Clock.module.css';

const NumberLineClock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'CustomFont', fontUrl: customFont821 }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  const [itemWidths, setItemWidths] = useState<any>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidths = () => {
      const refs = [
        { ref: secondsRef.current, key: 'seconds' },
        { ref: minutesRef.current, key: 'minutes' },
        { ref: hoursRef.current, key: 'hours' },
      ];

      let newContainerWidth = 0;
      const newItemWidths = { hours: 0, minutes: 0, seconds: 0 };

      refs.forEach(({ ref, key }) => {
        if (!ref) return;

        if (key === 'seconds') {
          newContainerWidth = ref.clientWidth;
        }

        const firstNumberItem = ref.children[1];
        if (firstNumberItem) {
          const style = window.getComputedStyle(firstNumberItem);
          const marginLeft = parseFloat(style.marginLeft);
          const marginRight = parseFloat(style.marginRight);
          const width = firstNumberItem.offsetWidth + marginLeft + marginRight;
          newItemWidths[key] = width;
        }
      });

      setItemWidths(newItemWidths);
      setContainerWidth(newContainerWidth);
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  useEffect(() => {
    if (
      !itemWidths.seconds ||
      !itemWidths.minutes ||
      !itemWidths.hours ||
      !containerWidth
    )
      return;

    let animationFrameId;

    const updateScrollPositions = () => {
      const now = new Date();

      // Get 24-hour format and convert to 12-hour
      let hours24 = now.getHours();
      let hours12 = hours24 % 12;
      if (hours12 === 0) hours12 = 12; // Convert 0 to 12 for 12 AM/PM

      const minutes = now.getMinutes();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000; // Smooth scroll

      if (hoursRef.current) {
        // Position between numbers - at 0 minutes, center between 12 and 1
        const currentHour = hours12 - 1; // Convert to 0-based index (0-11)
        const hourPosition = currentHour + minutes / 60; // Progress through the hour
        // Position between the current hour and next hour
        const targetScrollLeft =
          hourPosition * itemWidths.hours -
          containerWidth / 2 +
          itemWidths.hours;
        hoursRef.current.scrollLeft = targetScrollLeft;
      }

      if (minutesRef.current) {
        // Position between numbers - progress through the minute
        const minutePosition = minutes + seconds / 60;
        const targetScrollLeft =
          minutePosition * itemWidths.minutes -
          containerWidth / 2 +
          itemWidths.minutes;
        minutesRef.current.scrollLeft = targetScrollLeft;
      }

      if (secondsRef.current) {
        // Position between numbers - progress through the second
        const targetScrollLeft =
          seconds * itemWidths.seconds -
          containerWidth / 2 +
          itemWidths.seconds;
        secondsRef.current.scrollLeft = targetScrollLeft;
      }

      animationFrameId = requestAnimationFrame(updateScrollPositions);
    };

    animationFrameId = requestAnimationFrame(updateScrollPositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [itemWidths, containerWidth]);

  const renderNumberLine = (count: number, ref: React.RefObject<HTMLDivElement>, margin: string) => (
    <div className={styles.numberLineContainer}>
      <div className={styles.numberLineWrapper}>
        {/* Center indicator */}
        <div className={styles.centerIndicator} />
        {/* Scrollable number line */}
        <div
          ref={ref}
          className={styles.scrollable}
        >
          {/* Left padding */}
          <div className={styles.padding} />

          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className={styles.numberItem}
              style={{ margin: `0 ${margin}` }}
            >
              <div className={styles.numberText}>
                {ref === hoursRef
                  ? (i + 1).toString().padStart(2, '0')
                  : i.toString().padStart(2, '0')}
              </div>
              <div
                className={`${styles.tickMark} ${i % 5 === 0 ? styles.tickMarkLarge : styles.tickMarkSmall}`}
              />
            </div>
          ))}

          {/* Right padding */}
          <div className={styles.padding} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {renderNumberLine(12, hoursRef, '10rem')}
        {renderNumberLine(60, minutesRef, '10rem')}
        {renderNumberLine(60, secondsRef, '10rem')}
      </div>
    </div>
  );
};

export default NumberLineClock;
