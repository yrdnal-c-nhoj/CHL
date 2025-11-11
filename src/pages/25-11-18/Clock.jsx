import React, { useState, useEffect } from 'react';

const TimeRing = ({ count, size, currentRotation, isHour = false }) => {
    const step = 360 / count;
    const radius = size * 0.4;

    const ringStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
    };

    const numberContainerStyle = {
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: `rotate(${currentRotation}deg)`,
        transition: 'transform 0.1s linear',
    };

    const numberStyle = (angle) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        
        return {
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: isHour ? '2.5vmin' : '1.8vmin',
            fontWeight: isHour ? '600' : '400',
            color: isHour ? '#2c3e50' : (count === 60 ? '#34495e' : '#7f8c8d'),
            backgroundColor: isHour ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
            borderRadius: '50%',
            padding: '0.3vmin',
            whiteSpace: 'nowrap',
        };
    };

    return (
        <div style={ringStyle}>
            <div style={numberContainerStyle}>
                {Array.from({ length: count }).map((_, i) => {
                    const angle = i * step;
                    const value = isHour ? (i === 0 ? 12 : i) : i;
                    return (
                        <div key={i} style={numberStyle(angle)}>
                            {value}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Clock = () => {
    const [time, setTime] = useState(new Date());
    const [dimensions, setDimensions] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 50);
        return () => clearInterval(timerId);
    }, []);

    const currentMs = time.getMilliseconds();
    const currentSecond = time.getSeconds();
    const currentMinute = time.getMinutes();
    const currentHour = time.getHours() % 12;

    const totalSeconds = currentSecond + currentMs / 1000;
    const totalMinutes = currentMinute + totalSeconds / 60;
    const totalHours = currentHour + totalMinutes / 60;

    const secondsRotation = -totalSeconds * 6;
    const minutesRotation = -totalMinutes * 6;
    const hoursRotation = -totalHours * 30;

    const size = Math.min(dimensions.width, dimensions.height) * 0.9;
    const secondRingSize = size;
    const minuteRingSize = size * 0.7;
    const hourRingSize = size * 0.5;

    const containerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        overflow: 'hidden',
    };

    const targetLineStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '50%',
        height: '2px',
        backgroundColor: '#e74c3c',
        transform: 'translateY(-50%)',
        transformOrigin: 'left center',
        zIndex: 10,
    };

    const centerDotStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '3vmin',
        height: '3vmin',
        borderRadius: '50%',
        backgroundColor: '#2c3e50',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    };

    return (
        <div style={containerStyle}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <div style={targetLineStyle}></div>
                
                <TimeRing
                    count={60}
                    size={secondRingSize}
                    currentRotation={secondsRotation}
                />
                <TimeRing
                    count={60}
                    size={minuteRingSize}
                    currentRotation={minutesRotation}
                />
                <TimeRing
                    count={12}
                    size={hourRingSize}
                    currentRotation={hoursRotation}
                    isHour={true}
                />
                
                <div style={centerDotStyle}></div>
            </div>
        </div>
    );
};

export default Clock;