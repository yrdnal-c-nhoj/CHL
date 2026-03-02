import React, { useState, useEffect } from 'react';

export default function SolarStandardTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [longitude, setLongitude] = useState(-71.1);
  const [latitude, setLatitude] = useState(42.3);
  const [selectedView, setSelectedView] = useState('all');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateSolarTime = (date, lng) => {
    const standardTime = date.getTime();
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    
    const timezoneCenter = Math.round(lng / 15) * 15;
    const longitudeDiff = lng - timezoneCenter;
    const minutesDiff = longitudeDiff * 4;
    
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const equationOfTime = -7.66 * Math.sin((360/365) * (dayOfYear + 1) * Math.PI / 180) 
                          + 9.87 * Math.sin(2 * (360/365) * (dayOfYear + 1) * Math.PI / 180);
    
    const solarTimeOffset = (minutesDiff + equationOfTime) * 60000;
    return new Date(standardTime + solarTimeOffset);
  };

  const solarTime = calculateSolarTime(currentTime, longitude);
  const timeDifferenceMinutes = Math.round((solarTime - currentTime) / 60000);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const getSunAngle = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / 1440) * 360 - 90;
  };

  const getEquationOfTime = (dayOfYear) => {
    return -7.66 * Math.sin((360/365) * dayOfYear * Math.PI / 180) 
           + 9.87 * Math.sin(2 * (360/365) * dayOfYear * Math.PI / 180);
  };

  // Styles
  const containerStyle = {
    width: '100%',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0a0e27 0%, #1a1a3e 50%, #2d1b4e 100%)',
    padding: '2vh',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#eee',
    overflowY: 'auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2vh'
  };

  const titleStyle = {
    fontSize: '3.5vh',
    marginBottom: '1.5vh',
    fontWeight: '600'
  };

  const navStyle = {
    display: 'flex',
    gap: '1vh',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2vh'
  };

  const buttonStyle = (isActive) => ({
    padding: '1vh 2vh',
    background: isActive ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
    border: `0.2vh solid ${isActive ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'}`,
    borderRadius: '0.5vh',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.6vh',
    transition: 'all 0.3s'
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(40vh, 1fr))',
    gap: '2vh',
    maxWidth: '180vh',
    margin: '0 auto'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '1vh',
    padding: '2vh',
    border: '0.2vh solid rgba(255, 255, 255, 0.1)'
  };

  const cardTitleStyle = {
    fontSize: '2.2vh',
    marginBottom: '1.5vh',
    color: '#ffd700',
    fontWeight: '500'
  };

  // Component 1: Dual Clocks
  const DualClocks = () => {
    const clockStyle = {
      width: '18vh',
      height: '18vh',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '0.4vh solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      margin: '0 auto'
    };

    const sunStyle = (angle) => ({
      position: 'absolute',
      width: '2.5vh',
      height: '2.5vh',
      background: 'radial-gradient(circle, #ffd700 0%, #ffa500 100%)',
      borderRadius: '50%',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-7vh)`,
      boxShadow: '0 0 1.5vh rgba(255, 215, 0, 0.8)',
      transition: 'transform 0.5s linear'
    });

    const clockMarkersStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    };

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>1. Dual Clock Faces</div>
        <div style={{display: 'flex', gap: '3vh', justifyContent: 'center', alignItems: 'center'}}>
          <div>
            <div style={{textAlign: 'center', fontSize: '1.6vh', marginBottom: '1vh', color: '#4ecdc4'}}>Standard</div>
            <div style={clockStyle}>
              <div style={clockMarkersStyle}>
                {[0, 90, 180, 270].map(angle => (
                  <div key={angle} style={{
                    position: 'absolute',
                    width: '0.2vh',
                    height: '1.5vh',
                    background: 'rgba(255, 255, 255, 0.5)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-8vh)`,
                    transformOrigin: 'center'
                  }} />
                ))}
              </div>
              <div style={sunStyle(getSunAngle(currentTime))} />
            </div>
            <div style={{textAlign: 'center', fontSize: '1.8vh', marginTop: '1vh', fontFamily: 'monospace'}}>
              {formatTime(currentTime)}
            </div>
          </div>
          <div>
            <div style={{textAlign: 'center', fontSize: '1.6vh', marginBottom: '1vh', color: '#ffd700'}}>Solar</div>
            <div style={clockStyle}>
              <div style={clockMarkersStyle}>
                {[0, 90, 180, 270].map(angle => (
                  <div key={angle} style={{
                    position: 'absolute',
                    width: '0.2vh',
                    height: '1.5vh',
                    background: 'rgba(255, 255, 255, 0.5)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-8vh)`,
                    transformOrigin: 'center'
                  }} />
                ))}
              </div>
              <div style={sunStyle(getSunAngle(solarTime))} />
            </div>
            <div style={{textAlign: 'center', fontSize: '1.8vh', marginTop: '1vh', fontFamily: 'monospace'}}>
              {formatTime(solarTime)}
            </div>
          </div>
        </div>
        <div style={{textAlign: 'center', marginTop: '2vh', fontSize: '2vh', color: '#ff6b6b'}}>
          Difference: {Math.abs(timeDifferenceMinutes)} min
        </div>
      </div>
    );
  };

  // Component 2: Analemma
  const Analemma = () => {
    const dayOfYear = Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / 86400000);
    
    const svgStyle = {
      width: '100%',
      height: '30vh',
      display: 'block'
    };

    const points = [];
    for (let day = 0; day < 365; day++) {
      const eot = getEquationOfTime(day);
      const x = 200 + eot * 3;
      const y = 150 + Math.sin((day / 365) * 2 * Math.PI) * 80;
      points.push({x, y, day});
    }

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>2. Analemma (Figure-8 Pattern)</div>
        <svg style={svgStyle} viewBox="0 0 400 300">
          <path
            d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="rgba(255, 215, 0, 0.5)"
            strokeWidth="2"
          />
          {points.map((p, i) => (
            i % 30 === 0 && (
              <circle key={i} cx={p.x} cy={p.y} r="2" fill="rgba(255, 215, 0, 0.3)" />
            )
          ))}
          <circle
            cx={points[dayOfYear]?.x || 200}
            cy={points[dayOfYear]?.y || 150}
            r="5"
            fill="#ff6b6b"
            stroke="#fff"
            strokeWidth="1"
          />
          <text x="200" y="20" fill="#fff" textAnchor="middle" fontSize="12">
            Day {dayOfYear} of 365
          </text>
          <text x="200" y="290" fill="#aaa" textAnchor="middle" fontSize="10">
            Equation of Time: {getEquationOfTime(dayOfYear).toFixed(1)} min
          </text>
        </svg>
      </div>
    );
  };

  // Component 3: Sun Path Arc
  const SunPathArc = () => {
    const svgStyle = {
      width: '100%',
      height: '25vh',
      display: 'block'
    };

    const standardPos = (getSunAngle(currentTime) + 90) / 180;
    const solarPos = (getSunAngle(solarTime) + 90) / 180;

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>3. Sun Path Arc</div>
        <svg style={svgStyle} viewBox="0 0 400 200">
          <path
            d="M 50 150 Q 200 20, 350 150"
            fill="none"
            stroke="rgba(135, 206, 250, 0.5)"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
          <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(139, 69, 19, 0.8)" strokeWidth="4" />
          <circle
            cx={50 + standardPos * 300}
            cy={150 - Math.sin(standardPos * Math.PI) * 130}
            r="8"
            fill="#4ecdc4"
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={50 + standardPos * 300}
            y={165 - Math.sin(standardPos * Math.PI) * 130}
            fill="#4ecdc4"
            textAnchor="middle"
            fontSize="10"
          >
            Standard
          </text>
          <circle
            cx={50 + solarPos * 300}
            cy={150 - Math.sin(solarPos * Math.PI) * 130}
            r="8"
            fill="#ffd700"
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={50 + solarPos * 300}
            y={165 - Math.sin(solarPos * Math.PI) * 130}
            fill="#ffd700"
            textAnchor="middle"
            fontSize="10"
          >
            Solar
          </text>
          <text x="50" y="175" fill="#aaa" fontSize="10">6 AM</text>
          <text x="195" y="175" fill="#aaa" fontSize="10" textAnchor="middle">Noon</text>
          <text x="345" y="175" fill="#aaa" fontSize="10" textAnchor="end">6 PM</text>
        </svg>
      </div>
    );
  };

  // Component 4: Time Offset Graph
  const TimeOffsetGraph = () => {
    const svgStyle = {
      width: '100%',
      height: '25vh',
      display: 'block'
    };

    const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
    const points = [];
    
    for (let h = 0; h < 24; h += 0.5) {
      const testDate = new Date(currentTime);
      testDate.setHours(Math.floor(h), (h % 1) * 60, 0);
      const testSolar = calculateSolarTime(testDate, longitude);
      const diff = (testSolar - testDate) / 60000;
      points.push({h, diff});
    }

    const maxDiff = Math.max(...points.map(p => Math.abs(p.diff)));
    const scale = 80 / (maxDiff || 1);

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>4. Time Offset Over 24 Hours</div>
        <svg style={svgStyle} viewBox="0 0 400 200">
          <line x1="30" y1="100" x2="370" y2="100" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          <path
            d={`M ${points.map((p, i) => `${30 + (p.h / 24) * 340},${100 - p.diff * scale}`).join(' L ')}`}
            fill="none"
            stroke="#ffd700"
            strokeWidth="2"
          />
          <line
            x1={30 + (currentHour / 24) * 340}
            y1="20"
            x2={30 + (currentHour / 24) * 340}
            y2="180"
            stroke="#ff6b6b"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle
            cx={30 + (currentHour / 24) * 340}
            cy={100 - timeDifferenceMinutes * scale}
            r="5"
            fill="#ff6b6b"
            stroke="#fff"
            strokeWidth="2"
          />
          <text x="30" y="195" fill="#aaa" fontSize="10">0:00</text>
          <text x="200" y="195" fill="#aaa" fontSize="10" textAnchor="middle">12:00</text>
          <text x="370" y="195" fill="#aaa" fontSize="10" textAnchor="end">24:00</text>
          <text x="200" y="15" fill="#fff" fontSize="11" textAnchor="middle">
            Current: {timeDifferenceMinutes > 0 ? '+' : ''}{timeDifferenceMinutes} min
          </text>
        </svg>
      </div>
    );
  };

  // Component 5: Split Sky
  const SplitSky = () => {
    const getSkyColor = (date) => {
      const hour = date.getHours() + date.getMinutes() / 60;
      if (hour >= 6 && hour < 12) {
        return ['#87CEEB', '#FFD700'];
      } else if (hour >= 12 && hour < 18) {
        return ['#87CEEB', '#FFA500'];
      } else if (hour >= 18 && hour < 20) {
        return ['#FF6B6B', '#4A0E4E'];
      } else {
        return ['#0a0e27', '#1a1a3e'];
      }
    };

    const standardColors = getSkyColor(currentTime);
    const solarColors = getSkyColor(solarTime);

    const skyStyle = (colors) => ({
      flex: 1,
      height: '25vh',
      background: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`,
      position: 'relative',
      borderRadius: '0.5vh',
      overflow: 'hidden'
    });

    const sunPosStyle = (date) => {
      const hour = date.getHours() + date.getMinutes() / 60;
      const x = ((hour - 6) / 12) * 100;
      const y = 50 - Math.sin(((hour - 6) / 12) * Math.PI) * 40;
      
      return {
        position: 'absolute',
        left: `${Math.max(5, Math.min(95, x))}%`,
        top: `${Math.max(10, Math.min(90, y))}%`,
        width: '3vh',
        height: '3vh',
        background: 'radial-gradient(circle, #fff 0%, #ffd700 50%, #ffa500 100%)',
        borderRadius: '50%',
        boxShadow: '0 0 2vh rgba(255, 215, 0, 0.8)',
        transform: 'translate(-50%, -50%)'
      };
    };

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>5. Split Sky Visualization</div>
        <div style={{display: 'flex', gap: '2vh', height: '25vh'}}>
          <div style={{flex: 1}}>
            <div style={{fontSize: '1.4vh', marginBottom: '0.5vh', textAlign: 'center', color: '#4ecdc4'}}>Standard Time</div>
            <div style={skyStyle(standardColors)}>
              <div style={sunPosStyle(currentTime)} />
            </div>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: '1.4vh', marginBottom: '0.5vh', textAlign: 'center', color: '#ffd700'}}>Solar Time</div>
            <div style={skyStyle(solarColors)}>
              <div style={sunPosStyle(solarTime)} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Component 6: Rotating Earth
  const RotatingEarth = () => {
    const svgStyle = {
      width: '100%',
      height: '30vh',
      display: 'block'
    };

    const rotation = (currentTime.getHours() * 60 + currentTime.getMinutes()) / 1440 * 360;

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>6. Earth with Sun Position</div>
        <svg style={svgStyle} viewBox="0 0 400 250">
          <defs>
            <radialGradient id="earthGrad">
              <stop offset="0%" stopColor="#4a9eff" />
              <stop offset="70%" stopColor="#1a5fb4" />
              <stop offset="100%" stopColor="#0a2f5f" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="125" r="80" fill="url(#earthGrad)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <line
            x1="200"
            y1="45"
            x2="200"
            y2="15"
            stroke="#ffd700"
            strokeWidth="3"
          />
          <circle cx="200" cy="10" r="8" fill="#ffd700" filter="blur(1px)" />
          <circle
            cx={200 + Math.cos((rotation - 90) * Math.PI / 180) * 60}
            cy={125 + Math.sin((rotation - 90) * Math.PI / 180) * 60}
            r="5"
            fill="#ff6b6b"
            stroke="#fff"
            strokeWidth="2"
          />
          <text x="200" y="220" fill="#fff" textAnchor="middle" fontSize="11">
            Your Location (Lat: {latitude.toFixed(1)}°, Lon: {longitude.toFixed(1)}°)
          </text>
          <text x="200" y="235" fill="#aaa" textAnchor="middle" fontSize="10">
            Earth rotation shows solar time
          </text>
        </svg>
      </div>
    );
  };

  // Component 7: Timeline Slider
  const TimelineSlider = () => {
    const standardMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const solarMinutes = solarTime.getHours() * 60 + solarTime.getMinutes();

    const timelineStyle = {
      position: 'relative',
      height: '8vh',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1vh',
      margin: '2vh 0'
    };

    const markerStyle = (pos, color, label) => ({
      position: 'absolute',
      left: `${(pos / 1440) * 100}%`,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    });

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>7. Timeline Comparison</div>
        <div style={timelineStyle}>
          <div style={markerStyle(standardMinutes, '#4ecdc4', 'Standard')}>
            <div style={{
              width: '3vh',
              height: '3vh',
              background: '#4ecdc4',
              borderRadius: '50%',
              border: '0.3vh solid #fff',
              marginBottom: '0.5vh'
            }} />
            <div style={{fontSize: '1.2vh', whiteSpace: 'nowrap'}}>Standard</div>
          </div>
          <div style={markerStyle(solarMinutes, '#ffd700', 'Solar')}>
            <div style={{
              width: '3vh',
              height: '3vh',
              background: '#ffd700',
              borderRadius: '50%',
              border: '0.3vh solid #fff',
              marginBottom: '0.5vh'
            }} />
            <div style={{fontSize: '1.2vh', whiteSpace: 'nowrap'}}>Solar</div>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.4vh', color: '#aaa'}}>
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    );
  };

  // Component 8: Dashboard
  const Dashboard = () => {
    const dayOfYear = Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / 86400000);
    const eot = getEquationOfTime(dayOfYear);

    const statStyle = {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '1.5vh',
      borderRadius: '0.5vh',
      textAlign: 'center'
    };

    return (
      <div style={cardStyle}>
        <div style={cardTitleStyle}>8. Complete Dashboard</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5vh'}}>
          <div style={statStyle}>
            <div style={{fontSize: '1.4vh', color: '#aaa', marginBottom: '0.5vh'}}>Time Difference</div>
            <div style={{fontSize: '2.5vh', color: '#ff6b6b', fontWeight: 'bold'}}>
              {timeDifferenceMinutes > 0 ? '+' : ''}{timeDifferenceMinutes} min
            </div>
          </div>
          <div style={statStyle}>
            <div style={{fontSize: '1.4vh', color: '#aaa', marginBottom: '0.5vh'}}>Equation of Time</div>
            <div style={{fontSize: '2.5vh', color: '#ffd700', fontWeight: 'bold'}}>
              {eot.toFixed(1)} min
            </div>
          </div>
          <div style={statStyle}>
            <div style={{fontSize: '1.4vh', color: '#aaa', marginBottom: '0.5vh'}}>Day of Year</div>
            <div style={{fontSize: '2.5vh', color: '#4ecdc4', fontWeight: 'bold'}}>
              {dayOfYear} / 365
            </div>
          </div>
          <div style={statStyle}>
            <div style={{fontSize: '1.4vh', color: '#aaa', marginBottom: '0.5vh'}}>Longitude Effect</div>
            <div style={{fontSize: '2.5vh', color: '#9b59b6', fontWeight: 'bold'}}>
              {((longitude - Math.round(longitude / 15) * 15) * 4).toFixed(1)} min
            </div>
          </div>
        </div>
        <div style={{marginTop: '2vh', padding: '1.5vh', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '0.5vh', fontSize: '1.4vh', lineHeight: '1.8'}}>
          <strong>Why they differ:</strong> Solar time is based on the sun's actual position. Standard time uses fixed time zones. 
          Differences arise from: (1) your longitude within the time zone, and (2) Earth's elliptical orbit (equation of time).
        </div>
      </div>
    );
  };

  const inputSectionStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '2vh',
    borderRadius: '1vh',
    marginBottom: '2vh',
    maxWidth: '80vh',
    margin: '0 auto 2vh'
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '0.2vh solid rgba(255, 255, 255, 0.3)',
    borderRadius: '0.5vh',
    padding: '1vh 2vh',
    fontSize: '1.6vh',
    color: '#fff',
    width: '15vh',
    marginLeft: '1vh'
  };

  const renderView = () => {
    switch(selectedView) {
      case '1': return <DualClocks />;
      case '2': return <Analemma />;
      case '3': return <SunPathArc />;
      case '4': return <TimeOffsetGraph />;
      case '5': return <SplitSky />;
      case '6': return <RotatingEarth />;
      case '7': return <TimelineSlider />;
      case '8': return <Dashboard />;
      default:
        return (
          <div style={gridStyle}>
            <DualClocks />
            <Analemma />
            <SunPathArc />
            <TimeOffsetGraph />
            <SplitSky />
            <RotatingEarth />
            <TimelineSlider />
            <Dashboard />
          </div>
        );
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Solar Time vs Standard Time - All Visualizations</h1>
        
        <div style={inputSectionStyle}>
          <label style={{fontSize: '1.6vh'}}>
            Longitude:
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
              step="0.1"
              style={inputStyle}
            />
          </label>
          <label style={{fontSize: '1.6vh', marginLeft: '2vh'}}>
            Latitude:
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              step="0.1"
              style={inputStyle}
            />
          </label>
        </div>

        <div style={navStyle}>
          <button style={buttonStyle(selectedView === 'all')} onClick={() => setSelectedView('all')}>
            All Views
          </button>
          <button style={buttonStyle(selectedView === '1')} onClick={() => setSelectedView('1')}>
            1. Dual Clocks
          </button>
          <button style={buttonStyle(selectedView === '2')} onClick={() => setSelectedView('2')}>
            2. Analemma
          </button>
          <button style={buttonStyle(selectedView === '3')} onClick={() => setSelectedView('3')}>
            3. Sun Path
          </button>
          <button style={buttonStyle(selectedView === '4')} onClick={() => setSelectedView('4')}>
            4. Offset Graph
          </button>
          <button style={buttonStyle(selectedView === '5')} onClick={() => setSelectedView('5')}>
            5. Split Sky
          </button>
          <button style={buttonStyle(selectedView === '6')} onClick={() => setSelectedView('6')}>
            6. Earth View
          </button>
          <button style={buttonStyle(selectedView === '7')} onClick={() => setSelectedView('7')}>
            7. Timeline
          </button>
          <button style={buttonStyle(selectedView === '8')} onClick={() => setSelectedView('8')}>
            8. Dashboard
          </button>
        </div>
      </div>

      {renderView()}
    </div>
  );
}