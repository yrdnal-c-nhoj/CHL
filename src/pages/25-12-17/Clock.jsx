import React, { useEffect, useState } from 'react'
import font251217z from './fa.ttf'
import bacbg251217 from './swagr.webp'

const DigitalClock = () => {
  const [time, setTime] = useState(getCurrentTime())

  const digitToLetter = d => 'EVJpLhcMkB'[parseInt(d)]

  function getCurrentTime () {
    const now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    hours = hours < 10 ? '0' + hours : '' + hours
    minutes = minutes < 10 ? '0' + minutes : '' + minutes
    seconds = seconds < 10 ? '0' + seconds : '' + seconds
    return { hours, minutes, seconds }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    boxSizing: 'border-box',
    margin: 0,
    padding: '10vh 0 0 0',
    position: 'relative',
    zIndex: 1 // Ensures content is above background
  }

  const clockContentStyle = {
    padding: '25px',
    borderRadius: '10px'
  }

  const digitBoxStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    color: '#B90E9FFF',
    fontFamily: 'TodayFont, sans-serif'
  }

  const encodedStyle = {
    fontSize: '35vh',
    textShadow: '1px 1px 0px #000000C0, -1px -1px 0px #F1F1F5FF'
  }

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: "TodayFont";
            src: url(${font251217z}) format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          .large-layout {
            display: flex;
            justify-content: center;
          }
          .large-layout .digit-box {
            width: 22vh;
            height: 12vh;
          }
          .small-layout {
            display: none;
            flex-direction: column;
            gap: 3vh;
          }
          .small-layout .time-row {
            display: flex;
            justify-content: center;
          }
          .small-layout .digit-box {
            width: 25vw;
            height: 32vw;
          }
          @media (max-width: 768px) {
            .large-layout {
              display: none;
            }
            .small-layout {
              display: flex;
            }
          }
          .background-filter {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-image: url(${bacbg251217});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: contrast(0.5) saturate(0.3); /* Adjust values as needed */
            z-index: 1;
          }
        `}
      </style>

      {/* Filtered background layer */}
      <div className='background-filter'></div>

      {/* Clock content overlay */}
      <div style={containerStyle}>
        <div style={clockContentStyle}>
          {/* Large screen */}
          <div className='large-layout'>
            {[
              ...time.hours.split(''),
              ...time.minutes.split(''),
              ...time.seconds.split('')
            ].map((d, i) => (
              <div key={i} className='digit-box' style={digitBoxStyle}>
                <span style={encodedStyle}>{digitToLetter(d)}</span>
              </div>
            ))}
          </div>

          {/* Small screen */}
          <div className='small-layout'>
            {[
              time.hours.split(''),
              time.minutes.split(''),
              time.seconds.split('')
            ].map((group, gi) => (
              <div key={gi} className='time-row'>
                {group.map((d, i) => (
                  <div
                    key={`${gi}-${i}`}
                    className='digit-box'
                    style={digitBoxStyle}
                  >
                    <span style={{ ...encodedStyle, fontSize: '40vw' }}>
                      {digitToLetter(d)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default DigitalClock
