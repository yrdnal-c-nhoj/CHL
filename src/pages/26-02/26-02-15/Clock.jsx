// PixelInverseClock.jsx
import React, { useRef, useEffect, useState } from 'react'
import videoFile from '../../../assets/images/26-02-15/caldera.mp4'
import fontFile from '../../../assets/fonts/26-02-15-fire.ttf'

const FONT_FAMILY = 'MyClockFont_20251120'

export default function PixelInverseClock() {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const [fontLoaded, setFontLoaded] = useState(false)

  // Load the custom font
  useEffect(() => {
    const font = new FontFace(FONT_FAMILY, `url(${fontFile})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      setFontLoaded(true)
    }).catch(err => console.error("Font loading failed:", err))
  }, [])

  useEffect(() => {
    if (!fontLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const video = videoRef.current

    // Disable smoothing for sharp pixel look
    ctx.imageSmoothingEnabled = false

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('orientationchange', resizeCanvas)

    const getPixel = (x, y, w, data) => {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4
      return { r: data[i], g: data[i + 1], b: data[i + 2] }
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2

      // ───────────────────────────────────────────────
      // 1. Draw tiled, mirrored, uncropped background video
      // ───────────────────────────────────────────────
      const vidW = video.videoWidth
      const vidH = video.videoHeight

      if (vidW > 0 && vidH > 0) {
        const vidAspect = vidW / vidH

        // Size of one video instance — keep original aspect ratio
        let tileWidth, tileHeight

        // We choose the smaller scale so the whole video is visible (contain behavior)
        if (w / h > vidAspect) {
          // Screen wider than video → fit to height
          tileHeight = h
          tileWidth = tileHeight * vidAspect
        } else {
          // Screen taller or same → fit to width
          tileWidth = w
          tileHeight = tileWidth / vidAspect
        }

        // Center offset for a single centered copy
        const offsetX = (w - tileWidth) / 2
        const offsetY = (h - tileHeight) / 2

        ctx.save()
        // Mirror the entire scene horizontally
        ctx.translate(w, 0)
        ctx.scale(-1, 1)

        // Calculate how many tiles needed in each direction (with overlap margin)
        const tilesX = Math.ceil((w + Math.abs(offsetX) * 2) / tileWidth) + 2
        const tilesY = Math.ceil((h + Math.abs(offsetY) * 2) / tileHeight) + 2

        // Tile the video
        for (let ty = -2; ty < tilesY; ty++) {
          for (let tx = -2; tx < tilesX; tx++) {
            const x = offsetX + tx * tileWidth
            const y = offsetY + ty * tileHeight

            // Because context is mirrored, draw at mirrored position
            ctx.drawImage(video, -x - tileWidth, y, tileWidth, tileHeight)
          }
        }

        ctx.restore()
      } else {
        // Video not ready → black background
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, w, h)
      }

      // ───────────────────────────────────────────────
      // Get pixels after background is drawn
      // ───────────────────────────────────────────────
      const image = ctx.getImageData(0, 0, w, h)
      const data = image.data

      const now = new Date()
      const ms = now.getMilliseconds()
      const sec = now.getSeconds() + ms / 1000
      const min = now.getMinutes() + sec / 60
      const hr = (now.getHours() % 12) + min / 60

      // Clock Dimensions
      const radiusX = w * 0.5
      const radiusY = Math.min(w, h) * 0.15

      // ───────────────────────────────────────────────
      // 2. Render Numbers (Opacity 0.8)
      // ───────────────────────────────────────────────
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${radiusY * 0.4}px "${FONT_FAMILY}", sans-serif`

      const numOffsetX = radiusX * 0.85
      const numOffsetY = radiusY * 0.85

      for (let n = 1; n <= 12; n++) {
        const angle = (n / 12) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(angle) * numOffsetX
        const y = cy + Math.sin(angle) * numOffsetY
        const p = getPixel(x, y, w, data)

        ctx.save()
        ctx.globalAlpha = 0.8
        ctx.fillStyle = `rgb(${255 - p.r},${255 - p.g},${255 - p.b})`
        ctx.translate(x, y)
        ctx.rotate(angle + Math.PI / 2)
        ctx.fillText(n.toString(), 0, 0)
        ctx.restore()
      }

      // ───────────────────────────────────────────────
      // 3. Render Hands (Opacity 0.7)
      // ───────────────────────────────────────────────
      const drawHand = (lenX, lenY, thick, ang) => {
        const x = cx + Math.cos(ang) * lenX
        const y = cy + Math.sin(ang) * lenY
        const p = getPixel(x, y, w, data)

        ctx.save()
        ctx.globalAlpha = 0.7
        ctx.strokeStyle = `rgb(${255 - p.r},${255 - p.g},${255 - p.b})`
        ctx.lineWidth = Math.max(1, Math.min(radiusX, radiusY) * thick)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.restore()
      }

      // Hour Hand
      drawHand(radiusX * 0.3, radiusY * 0.46, 0.04, (hr * Math.PI) / 6 - Math.PI / 2)
      // Minute Hand
      drawHand(radiusX * 0.8, radiusY * 1.0, 0.025, (min * Math.PI) / 30 - Math.PI / 2)
      // Second Hand
      drawHand(radiusX * 1.0, radiusY * 1.4, 0.012, (sec * Math.PI) / 30 - Math.PI / 2)

      // ───────────────────────────────────────────────
      // 4. Center Dot (Solid 1.0)
      // ───────────────────────────────────────────────
      const center = getPixel(cx, cy, w, data)
      ctx.fillStyle = `rgb(${255 - center.r},${255 - center.g},${255 - center.b})`
      ctx.beginPath()
      ctx.arc(cx, cy, Math.min(radiusX, radiusY) * 0.06, 0, Math.PI * 2)
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    // Start video and drawing
    video.play().catch(() => {})
    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('orientationchange', resizeCanvas)
    }
  }, [fontLoaded])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'block',
          zIndex: 1,
          filter: 'saturate(3.9) contrast(1.0)',
          touchAction: 'none'
        }}
      />
      <video
        ref={videoRef}
        src={videoFile}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',     // helps during loading
          zIndex: 0,
          imageRendering: 'pixelated',
          backgroundColor: '#000',
          display: 'none'           // we draw it to canvas
        }}
      />
    </>
  )
}