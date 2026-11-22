import { useEffect, useRef } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import batsVideo from '@/assets/images/26_images/26-11/26-11-22/bats.webm';
import clockFont from '@/assets/fonts/26fonts/26-11-22.ttf?url';

import styles from './Clock.module.css';

export const assets = [batsVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_22',
  fontUrl: clockFont,
};

const DIGIT_TO_LETTER: Record<string, string> = {
  '0': '2',
  '1': '6',
  '2': 'A',
  '3': 'M',
  '4': '4',
  '5': 'F',
  '6': 'R',
  '7': '9',
  '8': 'q',
  '9': 'd',
};

const Clock_26_11_22 = () => {
  const time = useSmoothClock(16);
  useSuspenseFontLoader([fontConfig]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !video || !maskCanvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    let isRendering = false;

    const render = () => {
      if (isRendering) return;
      isRendering = true;

      const { width, height } = canvas;
      if (width === 0 || height === 0) {
        isRendering = false;
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      // Match original CSS sizing: clamp(2rem, 20vh, 11rem)
      const vh = height * 0.01;
      const fontSize = Math.max(32, Math.min(vh * 20, 176)); // 2rem=32px, 11rem=176px
      const lineHeight = fontSize * 0.7;

      // Clear main canvas
      ctx.clearRect(0, 0, width, height);

      // Draw video frame to main canvas
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, width, height);
      }

      // Get time string
      const currentTime = timeRef.current;
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const seconds = currentTime.getSeconds().toString().padStart(2, '0');
      const letters = `${hours}${minutes}${seconds}`
        .split('')
        .map((ch) => DIGIT_TO_LETTER[ch] ?? ch);

      // Render text to mask canvas (white text on transparent)
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.font = `${fontSize}px 'ClockFont_26_11_22'`;
      maskCtx.textAlign = 'center';
      maskCtx.textBaseline = 'middle';
      maskCtx.fillStyle = '#fff';

      const totalHeight = letters.length * lineHeight;
      const startY = (height - totalHeight) / 2 + fontSize / 2;

      letters.forEach((letter, i) => {
        const y = startY + i * lineHeight;
        maskCtx.fillText(letter, width / 2, y);
      });

      // Get mask image data
      const maskData = maskCtx.getImageData(0, 0, width, height);

      // Get main canvas image data (video + inverted text will be drawn next)
      const mainData = ctx.getImageData(0, 0, width, height);

      // Apply difference blend + filter only to text pixels
      for (let i = 0; i < mainData.data.length; i += 4) {
        const maskAlpha = maskData.data[i + 3];
        if (maskAlpha !== undefined && maskAlpha > 0) {
          // Difference blend: invert
          const rVal = mainData.data[i];
          const gVal = mainData.data[i + 1];
          const bVal = mainData.data[i + 2];
          if (rVal !== undefined && gVal !== undefined && bVal !== undefined) {
            let r = 255 - rVal;
            let g = 255 - gVal;
            let b = 255 - bVal;

            // Saturate 200%
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const l = (max + min) / 2;
            const s = max === min ? 0 : max - min;
            const saturationFactor = 5; // 200%
            if (s > 0) {
              const factor = saturationFactor;
              r = l + (r - l) * factor;
              g = l + (g - l) * factor;
              b = l + (b - l) * factor;
            }

            // Contrast 200%
            const contrastFactor = 2;
            r = 128 + (r - 128) * contrastFactor;
            g = 128 + (g - 128) * contrastFactor;
            b = 128 + (b - 128) * contrastFactor;

            // Brightness 700%
            const brightnessFactor = 0.5;
            r *= brightnessFactor;
            g *= brightnessFactor;
            b *= brightnessFactor;

            mainData.data[i] = Math.max(0, Math.min(255, r));
            mainData.data[i + 1] = Math.max(0, Math.min(255, g));
            mainData.data[i + 2] = Math.max(0, Math.min(255, b));
          }
        }
      }

      // Put filtered data back
      ctx.putImageData(mainData, 0, 0);

      isRendering = false;
      animationRef.current = requestAnimationFrame(render);
    };

    const startRender = () => {
      animationRef.current = requestAnimationFrame(render);
    };

    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      startRender();
    } else {
      video.addEventListener('canplay', startRender, { once: true });
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [timeRef]);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <video
        ref={videoRef}
        src={batsVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <canvas
        ref={maskCanvasRef}
        className={styles.maskCanvas}
        aria-hidden="true"
      />
    </main>
  );
};

Clock_26_11_22.displayName = 'Clock_26_11_22';

export default Clock_26_11_22;
