import React, { useEffect, useState, useRef } from 'react'
import bgImage from './roundhay.webp'
import bgImage2 from './ro.jpeg' // second background
import roundhayFont from './rou.ttf'
import ifont25100013 from './line.otf'

export default function Clock () {
  const [ready, setReady] = useState(false)
  const [now, setNow] = useState(new Date())
  const tickRef = useRef(null)

  const fontSizeVH = 4 // base size for digits and labels
  const dividerScale = 1.4 // divider scale relative to fontSizeVH

  const z = n => (n < 10 ? `0${n}` : `${n}`)

  // Shared color and shadow for digits and labels
  const sharedTextStyle = {
    color: '#F3D784FF',
    textShadow: `
    0px 1px 0 #ff00ff,
      0px -1px 0 #0BCFCFFF
    `,
    fontFamily: "'RoundhayFont', serif"
  }

  const digitBoxStyle = {
    ...sharedTextStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    fontSize: `${fontSizeVH}vh`,
    width: `${fontSizeVH * 0.65}vh`,
    height: `${fontSizeVH}vh`
  }

  const labelStyle = {
    ...sharedTextStyle,
    fontSize: `${fontSizeVH}vh`
  }

  const dividerStyle = {
    ...sharedTextStyle,
    fontFamily: "'Ifont25100013', serif",
    fontSize: `${fontSizeVH * dividerScale}vh`,
    opacity: 0.9,
    color: '#F3D889FF',
    textShadow: `
      0px 1px 0 #ff00ff,
      0px -1px 0 #0BCFCFFF
    `,
    margin: '0', // tighter spacing
    lineHeight: '0.4' // tight vertical line spacing
  }

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a0b2e',
    backgroundImage: `url(${bgImage}), url(${bgImage2})`,
    backgroundSize: 'contain, cover',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: '50% center, center',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums'
  }

  const lineStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5vw',
    lineHeight: '1.3'
  }

  const digitsRowStyle = {
    display: 'flex',
    gap: '0.3vw'
  }

  useEffect(() => {
    let mounted = true
    let imageLoaded = false
    let image2Loaded = false
    let font1Loaded = false
    let font2Loaded = false

    const checkReady = () => {
      if (imageLoaded && image2Loaded && font1Loaded && font2Loaded && mounted)
        setReady(true)
    }

    const img1 = new Image()
    img1.src = bgImage
    img1.onload = img1.onerror = () => {
      imageLoaded = true
      checkReady()
    }

    const img2 = new Image()
    img2.src = bgImage2
    img2.onload = img2.onerror = () => {
      image2Loaded = true
      checkReady()
    }

    const f1 = new FontFace('RoundhayFont', `url(${roundhayFont})`)
    f1.load()
      .then(font => {
        document.fonts.add(font)
        font1Loaded = true
        checkReady()
      })
      .catch(() => {
        font1Loaded = true
        checkReady()
      })

    const f2 = new FontFace('Ifont25100013', `url(${ifont25100013})`)
    f2.load()
      .then(font => {
        document.fonts.add(font)
        font2Loaded = true
        checkReady()
      })
      .catch(() => {
        font2Loaded = true
        checkReady()
      })

    return () => {
      mounted = false
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    tickRef.current = setInterval(() => setNow(new Date()), 25)
    return () => clearInterval(tickRef.current)
  }, [ready])

  if (!ready) return null

  const hours24 = now.getHours()
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12 // 12-hour format
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const milliseconds = Math.floor(now.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0')
  const isAM = hours24 < 12

  const renderDigits = value => (
    <div style={digitsRowStyle}>
      {String(value)
        .split('')
        .map((digit, i) => (
          <div key={i} style={digitBoxStyle}>
            {digit}
          </div>
        ))}
    </div>
  )

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0'
        }}
      >
        <div style={dividerStyle}>u</div>

        <div style={lineStyle}>{renderDigits(z(hours12))}</div>

        <div style={lineStyle}>{renderDigits(z(minutes))}</div>

        <div style={lineStyle}>{renderDigits(z(seconds))}</div>

        <div style={lineStyle}>{renderDigits(milliseconds)}</div>

        <div style={lineStyle}>
          <div
            style={{
              ...digitBoxStyle,
              width: 'auto',
              height: 'auto',
              whiteSpace: 'nowrap',
              padding: '0 0.5vh'
            }}
          >
            {isAM ? 'Ante Meridiem' : 'Post Meridiem'}
          </div>
        </div>
        <div style={dividerStyle}>W</div>
      </div>
    </div>
  )
}
