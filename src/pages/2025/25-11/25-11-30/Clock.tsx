// DigitalClock.jsx (Optimized for FOUT Prevention)
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import font251130 from '@/assets/fonts/2025/25-11-30-nono.ttf?url';
import backgroundImg from '@/assets/images/2025/25-11/25-11-30/crax.jpg';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import styles from './Clock.module.css';

const DigitalClock: React.FC = () => {
    const [now, setNow] = useState(() => new Date());

    const fontConfigs = useMemo<FontConfig[]>(
        () => [
            {
                fontFamily: 'ClockFont2025_12_01',
                fontUrl: font251130,
                options: {
                    weight: 'normal',
                    style: 'normal',
                },
            },
        ],
        [],
    );

    useSuspenseFontLoader(fontConfigs);

    // --- 2. Clock Update (Unchanged) ---
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = useCallback((date: Date) => {
        const HH = date.getHours().toString().padStart(2, '0');
        const MM = date.getMinutes().toString().padStart(2, '0');
        const SS = date.getSeconds().toString().padStart(2, '0');
        return { HH, MM, SS };
    }, []);

    const { HH, MM, SS } = formatTime(now);

    const isPhone = window.innerWidth < 768;

    const renderPair = (pair: string) => (
        <div className={styles.pair}>
            <span className={styles.digit}>{pair[0]}</span>
            <span className={styles.digit}>{pair[1]}</span>
        </div>
    );

    return (
        <div
            className={`${styles.container} ${isPhone ? styles.containerMobile : ''}`}
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            {isPhone ? (
                <div className={styles.column}>
                    {renderPair(HH)}
                    {renderPair(MM)}
                    {renderPair(SS)}
                </div>
            ) : (
                <div className={styles.row}>
                    {renderPair(HH)}
                    {renderPair(MM)}
                    {renderPair(SS)}
                </div>
            )}
        </div>
    );
};

export default DigitalClock;
