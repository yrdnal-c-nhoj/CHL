import React, { useState, useEffect, useRef } from 'react'
import bgImage from './birds.webp'
import font251107kdvsf from './twobirds.ttf'

export default function PanicAnalogClock () {
  const rightImageDelay = 500 // 0.5s delay for right image
  const bottomImageOpacity = 1.0
  const topImageOpacity = 0.5
  const fontName = 'CustomClockFont'
  const [leftSrc, setLeftSrc] = useState(null)
  const [rightSrc, setRightSrc] = useState(null)
  const [fontUrl, setFontUrl] = useState(null)
  const [showImages, setShowImages] = useState({ left: false, right: false }) // Restore staggered image timing
  const [fadeBlack, setFadeBlack] = useState(false) // Black overlay fade
  const [rightImageLoaded, setRightImageLoaded] = useState(false) // Track right image load
  const urlsRef = useRef({ left: null, right: null, font: null })
  const timerRef = useRef(null)
  const [timeStr, setTimeStr] = useState('')

  const formatTime = d => {
    let h = d.getHours()
    const m = d.getMinutes()
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    if (h === 0) h = 12
    const mm = String(m).padStart(2, '0')
    return `${h}${mm} ${ampm}`
  }

  useEffect(() => {
    const update = () => setTimeStr(formatTime(new Date()))
    update()
    const now = new Date()
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    let intervalId = null
    const timeoutId = setTimeout(() => {
      update()
      intervalId = setInterval(update, 60_000)
    }, Math.max(0, msToNextMinute))
    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    let aborted = false
    ;(async () => {
      try {
        const imgRes = await fetch(bgImage, { cache: 'no-store' })
        const imgBuf = await imgRes.arrayBuffer()
        const imgBlobType = imgRes.headers.get('content-type') || 'image/gif'
        const blobLeft = new Blob([imgBuf], { type: imgBlobType })
        const blobRight = new Blob([imgBuf], { type: imgBlobType })
        const urlLeft = URL.createObjectURL(blobLeft)
        const urlRight = URL.createObjectURL(blobRight)
        const fontRes = await fetch(font251107kdvsf, { cache: 'no-store' })
        const fontBuf = await fontRes.arrayBuffer()
        const fontBlobType = fontRes.headers.get('content-type') || 'font/ttf'
        const fontBlob = new Blob([fontBuf], { type: fontBlobType })
        const urlFont = URL.createObjectURL(fontBlob)

        if (aborted) {
          URL.revokeObjectURL(urlLeft)
          URL.revokeObjectURL(urlRight)
          URL.revokeObjectURL(urlFont)
          return
        }

        urlsRef.current = { left: urlLeft, right: urlRight, font: urlFont }
        setLeftSrc(urlLeft)
        setRightSrc(urlRight)
        setFontUrl(urlFont)
        setShowImages({ left: true, right: false })

        timerRef.current = setTimeout(() => {
          if (!aborted) {
            setShowImages({ left: true, right: true })
            // Only fade black overlay after right image is shown and loaded
            if (rightImageLoaded) {
              setFadeBlack(true)
            }
          }
        }, rightImageDelay)
      } catch (e) {
        console.error('Fetch failed, using direct URLs:', e)
        setLeftSrc(`${bgImage}?l=${Date.now()}`)
        setRightSrc(`${bgImage}?r=${Date.now()}`)
        setShowImages({ left: true, right: false })
        setFontUrl(null)
        timerRef.current = setTimeout(() => {
          if (!aborted) {
            setShowImages({ left: true, right: true })
            // Only fade black overlay after right image is shown and loaded
            if (rightImageLoaded) {
              setFadeBlack(true)
            }
          }
        }, rightImageDelay)
      }
    })()

    return () => {
      aborted = true
      if (timerRef.current) clearTimeout(timerRef.current)
      if (urlsRef.current.left) URL.revokeObjectURL(urlsRef.current.left)
      if (urlsRef.current.right) URL.revokeObjectURL(urlsRef.current.right)
      if (urlsRef.current.font) URL.revokeObjectURL(urlsRef.current.font)
    }
  }, [rightImageLoaded])

  const baseImgStyle = {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'top center',
    pointerEvents: 'none',
    transition: 'opacity 0ms'
  }

  const stoneClockStyle = {
    position: 'absolute',
    bottom: '2vh',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 4,
    fontFamily: fontUrl
      ? `"${fontName}", Menlo, Monaco, Consolas, monospace`
      : 'Menlo, Monaco, Consolas, monospace',
    fontWeight: 900,
    fontSize: '10vh',
    lineHeight: 1,
    letterSpacing: '0.6vh',
    opacity: 0.9,
    userSelect: 'none',
    textShadow: '0.6vh 1vh 2vh rgba(0,0,0,0.7)',
    transform: 'perspective(80vh) rotateX(10deg) rotateY(-5deg) scale(1.02)',
    transformOrigin: 'center bottom'
  }

  const rockDigitStyle = {
    display: 'inline-block',
    padding: '0 0.05em',
    backgroundImage: [
      'linear-gradient(135deg, #bbbfc3 0%, #8e9499 100%)',
      'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.20) 0%, transparent 35%)',
      'radial-gradient(circle at 70% 60%, rgba(0,0,0,0.40) 0%, transparent 45%)',
      'radial-gradient(circle at 40% 80%, rgba(120,120,120,0.25) 0%, transparent 30%)',
      'linear-gradient(to top, rgba(255,255,255,0.10), rgba(0,0,0,0) 60%)'
    ].join(', '),
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: [
      '1.7vh 1.8vh 0 rgba(0,0,0,0.9)',
      '0.28vh 0.28vh 0 rgba(255,255,255,0.6)',
      '-0.2vh -0.2vh 0 rgba(0,0,0,0.65)',
      '0 1.6vh 2.8vh rgba(0,0,0,0.9)'
    ].join(', '),
    filter: 'saturate(0.85) contrast(1.1)',
    opacity: 0.8,
    animation: 'digitFade 1s ease forwards'
  }

  const rockPunctStyle = {
    display: 'inline-block',
    opacity: 0.6,
    padding: '0 0.05em'
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {fontUrl && (
        <style>
          {`
            @font-face {
              font-family: "${fontName}";
              src: url("${fontUrl}") format("truetype");
              font-weight: 900;
              font-style: normal;
              font-display: swap;
            }
            @keyframes digitFade {
              from { opacity: 0; -webkit-text-fill-color: black; }
              to { opacity: 0.8; -webkit-text-fill-color: transparent; }
            }
          `}
        </style>
      )}
      {/* Left background */}
      <img
        src={leftSrc || undefined}
        alt='background'
        style={{
          ...baseImgStyle,
          opacity: showImages.left ? bottomImageOpacity : 0,
          zIndex: 1
        }}
      />
      {/* Right background */}
      <img
        src={rightSrc || undefined}
        alt='reversed background'
        onLoad={() => {
          setRightImageLoaded(true)
          // If right image is already shown (post-delay), fade black now
          if (showImages.right) {
            setFadeBlack(true)
          }
        }}
        style={{
          ...baseImgStyle,
          opacity: showImages.right ? topImageOpacity : 0,
          transform: 'scaleX(-1)',
          zIndex: 1
        }}
      />
      {/* Clock */}
      {fontUrl && showImages.right && (
        <div style={stoneClockStyle}>
          {Array.from(timeStr).map((ch, idx) => {
            const isAlnum = /[0-9A-Za-z]/.test(ch)
            if (!isAlnum)
              return (
                <span key={idx} style={rockPunctStyle}>
                  {ch}
                </span>
              )
            const rot = (Math.random() * 4 - 2).toFixed(2)
            const lift = (Math.random() * 0.2 - 0.1).toFixed(2)
            const bright = (0.95 + Math.random() * 0.1).toFixed(2)
            const perDigitStyle = {
              ...rockDigitStyle,
              transform: `translateY(${lift}em) rotate(${rot}deg)`,
              filter: `${rockDigitStyle.filter} brightness(${bright})`
            }
            return (
              <span key={idx} style={perDigitStyle}>
                {ch}
              </span>
            )
          })}
        </div>
      )}
      {/* Black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: fadeBlack ? 0 : 1,
          transition: 'opacity 0.2s ease-in'
        }}
      />
    </div>
  )
}
