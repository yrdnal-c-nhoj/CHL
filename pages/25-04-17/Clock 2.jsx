import React, { useEffect } from "react";
import "./25-04-17.css";

const digitStyles = {
    '0': { bg: '#0E51FAFF', color: '#F87E04FF' },
    '1': { bg: '#FA0820FF', color: '#2F9B04FF' },
    '2': { bg: '#F7FF06FF', color: '#A205C2FF' },
    '3': { bg: '#2F9B04FF', color: '#FA0820FF' },
    '4': { bg: '#FC8004FF', color: '#0E51FAFF' },
    '5': { bg: '#A205C2FF', color: '#F7FF06FF' },
    '6': { bg: '#141313FF', color: '#F4F2F2FF' },
    '7': { bg: '#F4F2F2FF', color: '#141313FF' },
    '8': { bg: '#966105FF', color: '#F92FB9FF'},
    '9': { bg: '#F92FB9FF', color: '#966105FF' },
};

function StripeClock() {
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, '0');
            const m = now.getMinutes().toString().padStart(2, '0');
            const s = now.getSeconds().toString().padStart(2, '0');
            const timeStr = h + m + s;

            const clockDiv = document.getElementById('clock');
            if (!clockDiv) return;

            // Clear and re-render stripes
            clockDiv.innerHTML = '';
            for (let char of timeStr) {
                const style = digitStyles[char];
                const stripe = document.createElement('div');
                stripe.className = 'stripe';
                stripe.style.backgroundColor = style.bg;
                stripe.style.color = style.color;
                stripe.textContent = char;
                clockDiv.appendChild(stripe);
            }
        };

        updateClock(); // Initial render
        const intervalId = setInterval(updateClock, 1000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <>
            <div id="clock" className="clock-container"></div>
        </>
    );
}

export default StripeClock;
