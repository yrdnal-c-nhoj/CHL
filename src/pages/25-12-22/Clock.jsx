import React, { useRef, useEffect, useState } from 'react'
import videoFile from './candle.mp4'
import fallbackImage from './candle.webp'

const xxx251120 = '/fonts/25-12-22-candle.ttf'
const FONT_FAMILY = 'MyClockFont_20251120'
const fontUrl = new URL(xxx251120, import.meta.url).href

export default function PixelInverseClock() {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  
  // We use a Ref for the video status because the draw loop 
  // needs the "live" value without waiting for a React re-render.
  const isVideoReady = useRef(false)
  const [fontLoaded, setFontLoaded] = useState(false)

  /* ================= FONT LOAD ================= */
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      setFontLoaded(true)
    }).catch(err => {
      console.error("", err)
      setFontLoaded(true) // Continue anyway with fallback font
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

    /* ---------- VIDEO LOGIC ---------- */
    const onCanPlay = () => {
      video.play()
        .then(() => { isVideoReady.current = true })
        .catch(() => { isVideoReady.current = false })
    }

    video.addEventListener('canplay', onCanPlay)
    // If video is already cached/loaded
    if (video.readyState >= 3) onCanPlay()

    /* ---------- RESIZE & DPI SCALING ---------- */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      
      // Set physical pixels
      canvas.width = w * dpr
      canvas.height = h * dpr
      
      // Set logical CSS pixels
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      
      // Scale context to match DPI
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

      // 1. Draw Background with filter
      ctx.save()
      ctx.filter = 'contrast(0.7) brightness(2.9) saturate(4.8)'
      
      // Check the Ref and the actual video buffer
      if (isVideoReady.current && video.readyState >= 2) {
        // Draw mirrored video
        ctx.translate(w, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, w, h)
      } else if (fallbackImg.complete) {
        ctx.drawImage(fallbackImg, 0, 0, w, h)
      } else {
        ctx.fillStyle = '#111'
        ctx.fillRect(0, 0, w, h)
      }
      ctx.restore()

      // 2. Setup Clock Styling
      const now = new Date()
      const ms = now.getMilliseconds()
      const sec = now.getSeconds() + ms / 1000
      const min = now.getMinutes() + sec / 60
      const hr = (now.getHours() % 12) + min / 60

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 3. Draw Numbers
      const offset = radius * 0.85
      ctx.font = `${radius * 0.5}px "${FONT_FAMILY}", sans-serif`
      
      for (let n = 1; n <= 12; n++) {
        const a = (n / 12) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * offset
        const y = cy + Math.sin(a) * offset

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(a + Math.PI / 2)
        
        // Shadow/Outline for readability
        ctx.fillStyle = 'rgba(0,0,0)'
        ctx.fillText(n, 2, 2)
        // ctx.fillStyle = '#110C05FF'
        // ctx.fillText(n, 0, 0)
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

      // Hour Hand
      drawHand(radius * 0.5, 8, hr * Math.PI / 6 - Math.PI / 2, 'black')
      // Minute Hand
      drawHand(radius * 0.8, 5, min * Math.PI / 30 - Math.PI / 2, 'black')
      // Second Hand
      drawHand(radius * 0.9, 2, sec * Math.PI / 30 - Math.PI / 2, '#ff4444')

      // Center Dot
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
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [fontLoaded])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: '#000'
        }}
      />
      {/* Keep video "visible" to the browser but hidden from user 
          to prevent the browser from pausing the stream.
      */}
      <video
        ref={videoRef}
        src={videoFile}
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0.01, 
          pointerEvents: 'none'
        }}
      />
    </>
  )
}