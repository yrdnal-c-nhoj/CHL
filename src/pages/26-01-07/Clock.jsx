import { useEffect, useState } from 'react'

const FlipNumber = ({ value }) => {
  const [displayedValue, setDisplayedValue] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (value !== displayedValue) {
      setPrevValue(displayedValue)
      setIsFlipping(true)

      // After animation completes, update the displayed value
      const timer = setTimeout(() => {
        setDisplayedValue(value)
        setIsFlipping(false)
      }, 600) // matches animation duration

      return () => clearTimeout(timer)
    }
  }, [value, displayedValue])

  const formattedValue = String(displayedValue).padStart(2, '0')
  const formattedPrev = String(prevValue).padStart(2, '0')

  return (
    <div className='flip-container'>
      <div className={`flip-card ${isFlipping ? 'flipping' : ''}`}>
        {/* Top half - stays visible */}
        <div className='top-half'>
          <span>{formattedValue}</span>
        </div>

        {/* Bottom half - stays visible */}
        <div className='bottom-half'>
          <span>{formattedValue}</span>
        </div>

        {/* Flipping top (shows previous value flipping out) */}
        <div className='flipping-top'>
          <span>{formattedPrev}</span>
        </div>

        {/* Flipping bottom (shows new value flipping in) */}
        <div className='flipping-bottom'>
          <span>{formattedValue}</span>
        </div>
      </div>

      <style jsx>{`
        .flip-container {
          position: relative;
          width: 80px;
          height: 120px;
          perspective: 1000px;
          margin: 0 8px;
        }

        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .top-half,
        .bottom-half,
        .flipping-top,
        .flipping-bottom {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background: #1a1a1a;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 80px;
          font-weight: bold;
          font-family: 'Arial Narrow', Arial, sans-serif;
        }

        .top-half {
          top: 0;
          border-bottom: 1px solid #000;
          transform-origin: bottom;
        }

        .bottom-half {
          bottom: 0;
          border-top: 1px solid #333;
          transform-origin: top;
          align-items: flex-start;
          padding-top: 12px;
        }

        .bottom-half span {
          transform: translateY(-50%);
        }

        .flipping-top {
          top: 0;
          border-bottom: 1px solid #000;
          transform-origin: bottom;
          transform: rotateX(0deg);
          animation: ${isFlipping ? 'flipTop 0.6s ease-in forwards' : 'none'};
        }

        .flipping-bottom {
          bottom: 0;
          border-top: 1px solid #333;
          transform-origin: top;
          transform: rotateX(90deg);
          animation: ${isFlipping
            ? 'flipBottom 0.6s ease-out forwards'
            : 'none'};
        }

        @keyframes flipTop {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-90deg);
          }
        }

        @keyframes flipBottom {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `}</style>
    </div>
  )
}

const FlipClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#111',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FlipNumber value={parseInt(hours[0])} />
        <FlipNumber value={parseInt(hours[1])} />

        <div
          style={{
            color: '#444',
            fontSize: '80px',
            margin: '0 20px',
            fontWeight: 'bold'
          }}
        >
          :
        </div>

        <FlipNumber value={parseInt(minutes[0])} />
        <FlipNumber value={parseInt(minutes[1])} />
      </div>
    </div>
  )
}

export default FlipClock
