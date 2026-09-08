import React, { useState, useEffect } from 'react';
import airpoImage from '@/assets/images/26_images/26-09/26-09-04/dickson.webm';

export const assets = [airpoImage];

const Clock_26_09_04 = () => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            // Formats to HH:MM:SS format
            setTime(now.toLocaleTimeString());
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main style={styles.container}>
            {/* Digital Clock Overlay */}
            <div style={styles.clock}>{time}</div>

            {/* Video Element */}
            <video 
                src={airpoImage} 
                style={styles.image} 
                autoPlay 
                loop 
                muted 
                playsInline 
            />
        </main>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clock: {
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        color: '#ffffff',
        fontSize: '2rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain', // Changed from 'cover' to prevent cropping
        display: 'block',
    },
} as const;

Clock_26_09_04.displayName = 'Clock_26_09_04';

export default Clock_26_09_04;