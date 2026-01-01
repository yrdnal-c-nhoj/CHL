import React, { useRef, useEffect, useState } from 'react'
import videoFile from './candle.mp4'
import fallbackImage from './candle.webp'
import './Clock.css'

const xxx251120 = '/fonts/25-12-22-candle.ttf'
const FONT_FAMILY = 'MyClockFont_20251120'
const fontUrl = new URL(xxx251120, import.meta.url).href

export default function PixelInverseClock() {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  
  const isVideoReady = useRef(false)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  /* ================= FONT LOAD ================= */
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      setFontLoaded(true)
    }).catch(err => {
      console.error("Font load error:", err)
      setFontLoaded(true) 
    })
  }, [])

  /* ================= MAIN EFFECT ================= */
  useEffect(() => {
    if (!fontLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const video = videoRef.current
    const fallbackImg = new Image()
    fallbackImg.src = fallbackImage

    /* ---------- VIDEO LOGIC WITH SILENT FALLBACK ---------- */
    const attemptPlay = async () => {
      try {
        await video.play()
        isVideoReady.current = true
        setUseFallback(false)
      } catch (err) {
        console.warn("Autoplay blocked, using WebP:", err)
        isVideoReady.current = false
        setUseFallback(true)
      }
    }

    video.addEventListener('canplay', attemptPlay)
    // Mobile Chrome sometimes requires load() to kickstart the element
    video.load()

    if (video.readyState >= 3) attemptPlay()

    /* ---------- RESIZE & DPI SCALING ---------- */
    const handleResize = () => {
      // Use visualViewport if available (better for mobile)
      const visualViewport = window.visualViewport || window
      const w = Math.max(document.documentElement.clientWidth || 0, visualViewport.width || 0)
      
      // For mobile, use the larger of window.innerHeight or document.documentElement.clientHeight
      // to account for the URL bar appearing/disappearing
      const h = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
        visualViewport.height || 0
      )
      
      // Set canvas dimensions
      canvas.width = w
      canvas.height = h
      
      // Set CSS dimensions
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      
      // Force a redraw after resize
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      animationRef.current = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    /* ================= DRAW LOOP ================= */
    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) * 0.45

      // 1. Background Logic
      ctx.save()
      
      // Apply filter with better browser support
      try {
        // Modern browsers
        ctx.filter = 'contrast(0.7) brightness(2.9) saturate(4.8)';
      } catch (e) {
        console.warn('Filter not supported, applying fallback');
        // Fallback for browsers that don't support ctx.filter
        ctx.filter = 'none';
        // Apply color matrix as a fallback
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        
        // Get the source image data
        let sourceData;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        tempCanvas.width = w;
        tempCanvas.height = h;
        
        if (isVideoReady.current && video.readyState >= 2 && !useFallback) {
          // For video
          tempCtx.translate(w, 0);
          tempCtx.scale(-1, 1);
          tempCtx.drawImage(video, 0, 0, w, h);
        } else if (fallbackImg.complete) {
          // For fallback image
          tempCtx.drawImage(fallbackImg, 0, 0, w, h);
        } else {
          // Solid color fallback
          tempCtx.fillStyle = '#111';
          tempCtx.fillRect(0, 0, w, h);
        }
        
        sourceData = tempCtx.getImageData(0, 0, w, h).data;
        
        // Apply contrast, brightness, and saturation manually
        for (let i = 0; i < data.length; i += 4) {
          // Get RGB values
          let r = sourceData[i];
          let g = sourceData[i + 1];
          let b = sourceData[i + 2];
          
          // Apply brightness (2.9x)
          r = Math.min(255, r * 2.9);
          g = Math.min(255, g * 2.9);
          b = Math.min(255, b * 2.9);
          
          // Apply contrast (0.7)
          r = 128 + (r - 128) * 0.7;
          g = 128 + (g - 128) * 0.7;
          b = 128 + (b - 128) * 0.7;
          
          // Apply saturation (4.8x)
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
          r = gray + (r - gray) * 4.8;
          g = gray + (g - gray) * 4.8;
          b = gray + (b - gray) * 4.8;
          
          // Clamp values
          data[i] = Math.max(0, Math.min(255, r));
          data[i + 1] = Math.max(0, Math.min(255, g));
          data[i + 2] = Math.max(0, Math.min(255, b));
          data[i + 3] = 255; // Alpha
        }
        
        // Draw the processed image
        ctx.putImageData(imageData, 0, 0);
        return; // Skip the rest of the drawing for this frame
      }

      // If filter is supported, use the standard drawing path
      if (isVideoReady.current && video.readyState >= 2 && !useFallback) {
        // Draw Video (Mirrored)
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();
      } else {
        // Draw WebP Fallback
        if (fallbackImg.complete) {
          ctx.drawImage(fallbackImg, 0, 0, w, h);
        } else {
          ctx.fillStyle = '#111';
          ctx.fillRect(0, 0, w, h);
        }
      }
      ctx.restore()

      // 2. Clock Logic
      const now = new Date()
      const ms = now.getMilliseconds()
      const sec = now.getSeconds() + ms / 1000
      const min = now.getMinutes() + sec / 60
      const hr = (now.getHours() % 12) + min / 60

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 3. Numbers
      const offset = radius * 0.85
      ctx.font = `${radius * 0.5}px "${FONT_FAMILY}", sans-serif`
      
      for (let n = 1; n <= 12; n++) {
        const a = (n / 12) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * offset
        const y = cy + Math.sin(a) * offset
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(a + Math.PI / 2)
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.fillText(n, 2, 2)
        ctx.restore()
      }

      /* ---- HANDS ---- */
      const drawHand = (len, thick, ang, color) => {
        ctx.strokeStyle = color
        ctx.lineWidth = thick
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len)
        ctx.stroke()
      }

      drawHand(radius * 0.5, 8, hr * Math.PI / 6 - Math.PI / 2, 'black')
      drawHand(radius * 0.8, 5, min * Math.PI / 30 - Math.PI / 2, 'black')
      drawHand(radius * 0.9, 2, sec * Math.PI / 30 - Math.PI / 2, '#ff4444')

      // Center Pin
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
      video.removeEventListener('canplay', attemptPlay)
    }
  }, [fontLoaded, useFallback]) // useFallback included to ensure state consistency

  if (!fontLoaded) return null

  return (
    <div className="clock-container">
      <video
        ref={videoRef}
        src={videoFile}
        loop
        muted
        playsInline
        autoPlay
        style={{ 
          display: 'none', 
          opacity: 0, 
          position: 'absolute', 
          pointerEvents: 'none' 
        }}
      />
      <canvas
        ref={canvasRef}
        className="clock-canvas"
      />
    </div>
  )
}
