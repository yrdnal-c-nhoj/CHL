import React from 'react';
import airpoImage from '@/assets/images/26_images/26-09/26-09-04/dickson.webm';

export const assets = [airpoImage];

const Clock_26_09_04 = () => {
    return (
        <main style={styles.container}>
            <img src={airpoImage} alt="airpo" style={styles.image} />
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
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
} as const;

Clock_26_09_04.displayName = 'Clock_26_09_04';

export default Clock_26_09_04;
