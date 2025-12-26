import React, { useRef, useEffect, useState } from 'react'

export default function PixelInverseClock() {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const isVideoReady = useRef(false)
  const backgroundColor = useRef('#ffffff')

  // Track start time of current cycle
  const cycleStartTime = useRef(Date.now())
  // Current opacity of the clock (1 = fully visible, 0 = invisible)
  const [clockOpacity, setClockOpacity] = useState(1)

  /* ================= MAIN EFFECT ================= */
  useEffect(() => {
    // Generate a random bright color for the background
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    backgroundColor.current = `rgb(${r}, ${g}, ${b})`

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const video = videoRef.current
    const fallbackImg = new Image()

    /* ---------- VIDEO LOGIC ---------- */
    const onCanPlay = () => {
      video.play().then(() => {
        isVideoReady.current = true
      }).catch(() => {
        isVideoReady.current = false
      })
    }
    video.addEventListener('canplay', onCanPlay)
    if (video.readyState >= 3) onCanPlay()

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

      // Calculate elapsed time in current cycle
      const elapsedMs = Date.now() - cycleStartTime.current
      const elapsedSeconds = elapsedMs / 1000

      // Determine clock opacity
      let opacity = 1
      if (elapsedSeconds >= 65) {
        // Fade out over 5 seconds (from 65s to 70s)
        opacity = Math.max(0, 1 - (elapsedSeconds - 65) / 5)
      }
      setClockOpacity(opacity)

      // If fully faded out, reset the cycle
      if (elapsedSeconds >= 70) {
        cycleStartTime.current = Date.now()
        // Generate new random background
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        backgroundColor.current = `rgb(${r}, ${g}, ${b})`
        setClockOpacity(1)
      }

      // 1. Draw Background
      ctx.save()
      ctx.filter = 'contrast(0.7) brightness(1.1)'
      if (isVideoReady.current && video.readyState >= 2) {
        ctx.translate(w, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, w, h)
      } else if (fallbackImg.complete) {
        ctx.drawImage(fallbackImg, 0, 0, w, h)
      } else {
        ctx.fillStyle = backgroundColor.current
        ctx.fillRect(0, 0, w, h)
      }
      ctx.restore()

      // 2. Draw Clock with opacity
      if (opacity > 0) {
        ctx.save()
        ctx.globalAlpha = opacity // Apply fade

        const now = new Date()
        const ms = now.getMilliseconds()
        const sec = now.getSeconds() + ms / 1000
        const min = now.getMinutes() + sec / 60
        const hr = (now.getHours() % 12) + min / 60

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

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
        drawHand(radius * 0.5, 8, hr * Math.PI / 6 - Math.PI / 2, 'white')
        // Minute Hand
        drawHand(radius * 0.8, 5, min * Math.PI / 30 - Math.PI / 2, 'white')
        // Second Hand
        drawHand(radius * 0.9, 2, sec * Math.PI / 30 - Math.PI / 2, 'white')
        // Center Dot
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(cx, cy, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: backgroundColor.current
        }}
      />
      <video
        ref={videoRef}
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