import React, { useEffect, useRef } from 'react'
import mat250918font from './matrix.ttf' // Your Matrix-style font

export default function MatrixRain () {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Inject font
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Mat250918font';
        src: url(${mat250918font}) format('truetype');
      }
    `
    document.head.appendChild(style)

    const resizeCanvas = () => {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
    }
    resizeCanvas()

    // Clock string → ["0","7","3","5","P","M"]
    const getTimeChars = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      const timeStr =
        hours.toString().padStart(2, '0') +
        minutes.toString().padStart(2, '0') +
        ampm
      return timeStr.split('')
    }

    let fontSize = Math.max(44, canvas.width / 40)
    let columns = Math.floor(canvas.width / fontSize)

    // Initialize drops
    const drops = []
    const initDrops = () => {
      const chars = getTimeChars()
      for (let i = 0; i < columns; i++) {
        drops[i] = {
          y: Math.random() * canvas.height,
          speed: 1 + Math.random() * 0.5,
          length: Math.random() * 20 + 15,
          offset: Math.floor(Math.random() * chars.length)
        }
      }
    }
    initDrops()

    let animationId

    const draw = () => {
      // trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'Mat250918font', monospace`
      ctx.textAlign = 'center'

      const chars = getTimeChars() // update each frame for live time

      drops.forEach((drop, i) => {
        for (let j = 0; j < drop.length; j++) {
          let y = drop.y - j * fontSize

          if (y > canvas.height) y -= canvas.height + drop.length * fontSize
          if (y < -fontSize) y += canvas.height + drop.length * fontSize

          const charIndex = (drop.offset + j) % chars.length
          const char = chars[charIndex]

          if (j === 0) {
            ctx.fillStyle = '#ffffff' // bright leader
            ctx.shadowColor = '#00ff41'
            ctx.shadowBlur = 15
          } else {
            const alpha = 1 - j / drop.length
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`
            ctx.shadowColor = '#00ff41'
            ctx.shadowBlur = 6
          }

          ctx.fillText(char, i * fontSize + fontSize / 2, y)
          ctx.shadowBlur = 0
        }

        drop.y += drop.speed

        if (drop.y > canvas.height + drop.length * fontSize) {
          drop.y -= canvas.height + drop.length * fontSize
          drop.offset = Math.floor(Math.random() * chars.length)
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      resizeCanvas()
      fontSize = Math.max(44, canvas.width / 40)
      columns = Math.floor(canvas.width / fontSize)
      initDrops()
    }

    window.addEventListener('resize', handleResize)
    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      document.head.removeChild(style)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        background: '#000000',
        width: '100vw',
        height: '100dvh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}
