import React, { useRef, useEffect, useState } from 'react'
import { useFontLoader } from '../../../utils/fontLoader';import videoFile from '../../../assets/images/25-12-22/candle.mp4'
import fallbackImage from '../../../assets/images/25-12-22/candle.webp'
import fontFile from '../../../assets/fonts/25-12-22-candle.ttf'

const FONT_FAMILY = 'MyClockFont_20251120'

export default function PixelInverseClock() {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  
  const isVideoReady = useRef(false)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  // Inline styles
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
    zIndex: 0,
    // Fallback for browsers that don't support dvh
    minHeight: '100vh',
    // Handle mobile Safari viewport issues
    WebkitOverflowScrolling: 'touch'
  }

  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
    opacity: 0,
    animation: 'fadeIn 0.2s ease-in forwards 0.1s',
    zIndex: 0,
    pointerEvents: 'none',
    objectFit: 'cover',
    // Ensure canvas fills container properly
    minWidth: '100%',
    minHeight: '100%'
  }

  const videoStyle = {
    display: 'none',
    opacity: 0,
    position: 'absolute',
    pointerEvents: 'none'
  }

  /* ================= FONT LOAD ================= */
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontFile})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      setFontLoaded(true)
    }).catch(err => {
      console.error("Font load error:", err)
      setFontLoaded(true) 
    })

    // Inject keyframes for fade-in animation
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement)
      }
    }
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
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)
    }

    window.addEventListener('resize', resize)
    resize()

    /* ================= DRAW LOOP ================= */
    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) * 0.45

      // 1. Background Logic
      ctx.save()
      ctx.filter = 'contrast(0.7) brightness(2.9) saturate(4.8)'

      if (isVideoReady.current && video.readyState >= 2 && !useFallback) {
        // Draw Video (Mirrored)
        ctx.translate(w, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, w, h)
      } else {
        // Draw WebP Fallback
        if (fallbackImg.complete) {
          ctx.drawImage(fallbackImg, 0, 0, w, h)
        } else {
          ctx.fillStyle = '#111'
          ctx.fillRect(0, 0, w, h)
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
    <div style={containerStyle}>
      <video
        ref={videoRef}
        src={videoFile}
        loop
        muted
        playsInline
        autoPlay
        style={videoStyle}
      />
      <canvas
        ref={canvasRef}
        style={canvasStyle}
      />
    </div>
  )
}
