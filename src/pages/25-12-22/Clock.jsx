import React, { useRef, useEffect, useState } from 'react'
import videoFile from './candle.mp4'
import fallbackImage from './candle.webp'

const xxx251120 = '/fonts/25-12-22-candle.ttf'
const FONT_FAMILY = 'MyClockFont_20251120'
const fontUrl = new URL(xxx251120, import.meta.url).href

export default function PixelInverseClock () {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)

  const [fontLoaded, setFontLoaded] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  /* ================= FONT LOAD ================= */
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      setFontLoaded(true)
    })
  }, [])

  /* ================= MAIN EFFECT ================= */
  useEffect(() => {
    if (!fontLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    ctx.imageSmoothingEnabled = false

    const video = videoRef.current

    /* ---------- FALLBACK IMAGE ---------- */
    const fallbackImg = new Image()
    fallbackImg.src = fallbackImage

    /* ---------- VIDEO EVENTS ---------- */
    const onCanPlay = () => setVideoReady(true)
    const onError = () => setVideoReady(false)

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('error', onError)

    video.play().catch(() => setVideoReady(false))

    /* ---------- RESIZE ---------- */
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', resize)

    const CLOCK_SCALE = 0.9

    /* ================= DRAW LOOP ================= */
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2

      /* ---- BACKGROUND (VIDEO OR WEBP) ---- */
      ctx.save()
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
      ctx.filter = 'contrast(0.5) saturate(1.5) brightness(1.1)'

      if (videoReady && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, w, h)
      } else if (fallbackImg.complete) {
        ctx.drawImage(fallbackImg, 0, 0, w, h)
      }

      ctx.restore()

      /* ---- TIME ---- */
      const now = new Date()
      const sec = now.getSeconds() + now.getMilliseconds() / 1000
      const min = now.getMinutes() + sec / 60
      const hr = (now.getHours() % 12) + min / 60

      const radius = Math.min(w, h) * CLOCK_SCALE * 0.5
      const clockColor = '#000000FF'

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${radius * 0.5}px "${FONT_FAMILY}", sans-serif`

      /* ---- NUMBERS ---- */
      const offset = radius * 0.85
      for (let n = 1; n <= 12; n++) {
        const a = (n / 12) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * offset
        const y = cy + Math.sin(a) * offset

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(a + Math.PI / 2)

        ctx.fillStyle = 'white'
        ctx.fillText(n, 1, 1)

        ctx.fillStyle = 'black'
        ctx.fillText(n, -1, -1)

        ctx.fillStyle = clockColor
        ctx.fillText(n, 0, 0)

        ctx.restore()
      }

      /* ---- HANDS ---- */
      const drawHand = (len, thick, ang, color) => {
        const x = cx + Math.cos(ang) * len
        const y = cy + Math.sin(ang) * len

        ctx.strokeStyle = color
        ctx.lineWidth = Math.max(1, radius * thick)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      drawHand(radius * 0.46, 0.04, hr * Math.PI / 6 - Math.PI / 2, clockColor)
      drawHand(radius * 1.0, 0.025, min * Math.PI / 30 - Math.PI / 2, clockColor)
      drawHand(radius * 1.4, 0.012, sec * Math.PI / 30 - Math.PI / 2, '#E64545FF')

      /* ---- CENTER DOT ---- */
      ctx.fillStyle = clockColor
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.06, 0, Math.PI * 2)
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    /* ================= CLEANUP ================= */
    return () => {
      cancelAnimationFrame(animationRef.current)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('error', onError)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
    }
  }, [fontLoaded])

  /* ================= JSX ================= */
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'block',
          zIndex: 1,
          touchAction: 'none'
        }}
      />

      <video
        ref={videoRef}
        src={videoFile}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          display: 'none',
          imageRendering: 'pixelated'
        }}
      />
    </>
  )
}
