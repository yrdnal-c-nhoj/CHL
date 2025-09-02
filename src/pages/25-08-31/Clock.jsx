import React, { useState, useEffect, useMemo } from 'react';

const UltraElaborateAnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);

    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate responsive size based on viewport
  const clockSize = Math.min(viewportSize.width * 0.95, viewportSize.height * 0.95);
  const center = clockSize / 2;

  const milliseconds = time.getMilliseconds();
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const millisecondAngle = (milliseconds / 1000 * 360) - 90;
  const secondAngle = (seconds * 6) + (milliseconds / 1000 * 6) - 90;
  const minuteAngle = (minutes * 6) + (seconds / 60 * 6) - 90;
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5) + (seconds / 60 * 0.5) - 90;
  const hour24Angle = (hours * 15) + (minutes * 0.25) - 90;

  // Responsive scaling factors
  const scale = clockSize / 600;

  // Memoized marker calculations with responsive scaling
  const allMinuteMarkers = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6;
      const radian = (angle * Math.PI) / 180;
      const isMainHour = i % 5 === 0;
      const isFiveMin = i % 5 === 0 && i % 15 !== 0;
      const isQuarterHour = i % 15 === 0;
      const x1 = center + Math.cos(radian) * (280 * scale);
      const y1 = center + Math.sin(radian) * (280 * scale);
      const x2 = center + Math.cos(radian) * (isQuarterHour ? 250 : isFiveMin ? 260 : 270) * scale;
      const y2 = center + Math.sin(radian) * (isQuarterHour ? 250 : isFiveMin ? 260 : 270) * scale;
      const textX = center + Math.cos(radian) * (235 * scale);
      const textY = center + Math.sin(radian) * (235 * scale);
      return { angle, x1, y1, x2, y2, textX, textY, number: i, isMainHour, isFiveMin, isQuarterHour };
    });
  }, [center, scale]);

  const hourMarkers = useMemo(() => {
    const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    return Array.from({ length: 12 }, (_, i) => {
      const angle = i * 30;
      const radian = (angle * Math.PI) / 180;
      const textX = center + Math.cos(radian) * (200 * scale);
      const textY = center + Math.sin(radian) * (200 * scale);
      return { angle, textX, textY, roman: romanNumerals[i], number: i === 0 ? 12 : i };
    });
  }, [center, scale]);

  const hour24Markers = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = i * 15;
      const radian = (angle * Math.PI) / 180;
      const textX = center + Math.cos(radian) * (170 * scale);
      const textY = center + Math.sin(radian) * (170 * scale);
      return { angle, textX, textY, hour24: i };
    });
  }, [center, scale]);

  const degreeMarkers = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const degrees = i * 6;
      const radian = (degrees * Math.PI) / 180;
      const textX = center + Math.cos(radian) * (150 * scale);
      const textY = center + Math.sin(radian) * (150 * scale);
      return { degrees, textX, textY };
    });
  }, [center, scale]);

  const secondMarkers = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6;
      const radian = (angle * Math.PI) / 180;
      const textX = center + Math.cos(radian) * (125 * scale);
      const textY = center + Math.sin(radian) * (125 * scale);
      const x1 = center + Math.cos(radian) * (135 * scale);
      const y1 = center + Math.sin(radian) * (135 * scale);
      const x2 = center + Math.cos(radian) * (130 * scale);
      const y2 = center + Math.sin(radian) * (130 * scale);
      return { angle, textX, textY, x1, y1, x2, y2, second: i };
    });
  }, [center, scale]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + `.${date.getMilliseconds().toString().padStart(3, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a, #5b21b6, #4f46e5)',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #f9fafb, #e5e7eb)',
        borderRadius: '50%',
        width: `${clockSize}px`,
        height: `${clockSize}px`,
        minWidth: '320px',
        minHeight: '320px',
      }}>
        <svg 
          viewBox={`0 0 ${clockSize} ${clockSize}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.2))',
            display: 'block'
          }} 
          role="img" 
          aria-label="Analog clock displaying current time"
        >
          <style>
            {`
              :root {
                --gold: #92400e;
                --amber: #fbbf24;
                --gray-dark: #1f2937;
                --red: #dc2626;
                --yellow: #f59e0b;
                --blue-dark: #1e40af;
                --gray-light: #6b7280;
                --gray-medium: #d1d5db;
                --white: #fff;
                --black: #000;
              }
            `}
          </style>
          <div className="sr-only">{formatTime(time)}</div>

          {/* Outer decorative rings */}
          <circle cx={center} cy={center} r={290 * scale} fill="none" stroke="var(--gold)" strokeWidth={6 * scale} />
          <circle cx={center} cy={center} r={285 * scale} fill="none" stroke="var(--amber)" strokeWidth={2 * scale} />
          <circle cx={center} cy={center} r={280 * scale} fill="var(--white)" stroke="var(--gray-dark)" strokeWidth={3 * scale} />

          {/* Multiple measurement rings */}
          <circle cx={center} cy={center} r={270 * scale} fill="none" stroke="#e5e7eb" strokeWidth={1 * scale} strokeDasharray={`${3 * scale},${3 * scale}`} />
          <circle cx={center} cy={center} r={250 * scale} fill="none" stroke="#d1d5db" strokeWidth={1 * scale} strokeDasharray={`${2 * scale},${2 * scale}`} />
          <circle cx={center} cy={center} r={230 * scale} fill="none" stroke="#e5e7eb" strokeWidth={1 * scale} strokeDasharray={`${3 * scale},${3 * scale}`} />
          <circle cx={center} cy={center} r={210 * scale} fill="none" stroke="#d1d5db" strokeWidth={1 * scale} strokeDasharray={`${2 * scale},${2 * scale}`} />
          <circle cx={center} cy={center} r={190 * scale} fill="none" stroke="#e5e7eb" strokeWidth={1 * scale} strokeDasharray={`${3 * scale},${3 * scale}`} />
          <circle cx={center} cy={center} r={170 * scale} fill="none" stroke="#d1d5db" strokeWidth={1 * scale} strokeDasharray={`${2 * scale},${2 * scale}`} />
          <circle cx={center} cy={center} r={150 * scale} fill="none" stroke="#e5e7eb" strokeWidth={1 * scale} strokeDasharray={`${3 * scale},${3 * scale}`} />
          <circle cx={center} cy={center} r={135 * scale} fill="none" stroke="var(--amber)" strokeWidth={2 * scale} />
          <circle cx={center} cy={center} r={120 * scale} fill="none" stroke="#e5e7eb" strokeWidth={1 * scale} />

          {/* Minute markers */}
          {allMinuteMarkers.map((marker, i) => (
            <g key={`minute-${i}`}>
              <line
                x1={marker.x1}
                y1={marker.y1}
                x2={marker.x2}
                y2={marker.y2}
                stroke={marker.isQuarterHour ? "var(--gold)" : marker.isFiveMin ? "var(--gray-dark)" : "var(--gray-light)"}
                strokeWidth={marker.isQuarterHour ? 4 * scale : marker.isFiveMin ? 3 * scale : 1.5 * scale}
              />
              {marker.isFiveMin && (
                <text
                  x={marker.textX}
                  y={marker.textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: `${14 * scale}px`, fontWeight: '700', fill: '#374151' }}
                >
                  {marker.number}
                </text>
              )}
            </g>
          ))}

          {/* Hour numbers (Arabic and Roman) */}
          {hourMarkers.map((marker, i) => (
            <g key={`hour-${i}`}>
              <text
                x={marker.textX}
                y={marker.textY - (8 * scale)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: `${30 * scale}px`, fontWeight: '700', fill: '#111827' }}
              >
                {marker.number}
              </text>
              <text
                x={marker.textX}
                y={marker.textY + (12 * scale)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: `${18 * scale}px`, fontFamily: 'serif', fill: '#b45309' }}
              >
                {marker.roman}
              </text>
            </g>
          ))}

          {/* 24-hour markers */}
          {hour24Markers.map((marker, i) => (
            <text
              key={`24hour-${i}`}
              x={marker.textX}
              y={marker.textY}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: `${12 * scale}px`, fontFamily: 'monospace', fill: '#1e40af' }}
            >
              {marker.hour24.toString().padStart(2, '0')}
            </text>
          ))}

          {/* Degree markers */}
          {degreeMarkers.map((marker, i) => (
            <text
              key={`degree-${i}`}
              x={marker.textX}
              y={marker.textY}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: `${12 * scale}px`, fill: '#7e22ce', fontFamily: 'monospace' }}
            >
              {marker.degrees}°
            </text>
          ))}

          {/* Second markers */}
          {secondMarkers.map((marker, i) => (
            <g key={`second-${i}`}>
              <line
                x1={marker.x1}
                y1={marker.y1}
                x2={marker.x2}
                y2={marker.y2}
                stroke="var(--red)"
                strokeWidth={0.5 * scale}
              />
              {i % 5 === 0 && (
                <text
                  x={marker.textX}
                  y={marker.textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: `${12 * scale}px`, fill: '#dc2626', fontFamily: 'monospace' }}
                >
                  {marker.second}
                </text>
              )}
            </g>
          ))}

          {/* Cardinal and intercardinal directions */}
          <text x={center} y={50 * scale} textAnchor="middle" style={{ fontSize: `${18 * scale}px`, fontWeight: '700', fill: '#b91c1c' }}>N • 0°</text>
          <text x={center + (230 * scale)} y={60 * scale} textAnchor="middle" style={{ fontSize: `${14 * scale}px`, fontWeight: '600', fill: '#dc2626' }} transform={`rotate(45 ${center + (230 * scale)} ${60 * scale})`}>NE • 45°</text>
          <text x={center + (250 * scale)} y={center + (5 * scale)} textAnchor="middle" style={{ fontSize: `${18 * scale}px`, fontWeight: '700', fill: '#b91c1c' }}>E • 90°</text>
          <text x={center + (230 * scale)} y={center + (250 * scale)} textAnchor="middle" style={{ fontSize: `${14 * scale}px`, fontWeight: '600', fill: '#dc2626' }} transform={`rotate(135 ${center + (230 * scale)} ${center + (250 * scale)})`}>SE • 135°</text>
          <text x={center} y={center + (270 * scale)} textAnchor="middle" style={{ fontSize: `${18 * scale}px`, fontWeight: '700', fill: '#b91c1c' }}>S • 180°</text>
          <text x={center - (230 * scale)} y={center + (250 * scale)} textAnchor="middle" style={{ fontSize: `${14 * scale}px`, fontWeight: '600', fill: '#dc2626' }} transform={`rotate(-135 ${center - (230 * scale)} ${center + (250 * scale)})`}>SW • 225°</text>
          <text x={center - (250 * scale)} y={center + (5 * scale)} textAnchor="middle" style={{ fontSize: `${18 * scale}px`, fontWeight: '700', fill: '#b91c1c' }}>W • 270°</text>
          <text x={center - (230 * scale)} y={60 * scale} textAnchor="middle" style={{ fontSize: `${14 * scale}px`, fontWeight: '600', fill: '#dc2626' }} transform={`rotate(-45 ${center - (230 * scale)} ${60 * scale})`}>NW • 315°</text>

          {/* Time zone markers */}
          <text x={center + (85 * scale)} y={center - (185 * scale)} textAnchor="middle" style={{ fontSize: `${12 * scale}px`, fill: '#16a34a' }} transform={`rotate(30 ${center + (85 * scale)} ${center - (185 * scale)})`}>15° • 1hr</text>
          <text x={center + (185 * scale)} y={center - (85 * scale)} textAnchor="middle" style={{ fontSize: `${12 * scale}px`, fill: '#16a34a' }} transform={`rotate(60 ${center + (185 * scale)} ${center - (85 * scale)})`}>30° • 2hr</text>
          <text x={center + (85 * scale)} y={center + (185 * scale)} textAnchor="middle" style={{ fontSize: `${12 * scale}px`, fill: '#16a34a' }} transform={`rotate(150 ${center + (85 * scale)} ${center + (185 * scale)})`}>150° • 10hr</text>
          <text x={center - (85 * scale)} y={center + (185 * scale)} textAnchor="middle" style={{ fontSize: `${12 * scale}px`, fill: '#16a34a' }} transform={`rotate(-150 ${center - (85 * scale)} ${center + (185 * scale)})`}>210° • 14hr</text>

          {/* Minute subdivision markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const baseAngle = i * 30;
            return Array.from({ length: 5 }, (_, j) => {
              const subAngle = baseAngle + (j * 6);
              const radian = (subAngle * Math.PI) / 180;
              const textX = center + Math.cos(radian) * (110 * scale);
              const textY = center + Math.sin(radian) * (110 * scale);
              const subMinute = (i * 5) + j;
              return (
                <text
                  key={`sub-${i}-${j}`}
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: `${12 * scale}px`, fill: '#4f46e5', fontFamily: 'monospace' }}
                >
                  {subMinute}
                </text>
              );
            });
          }).flat()}

          {/* 24-hour hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((hour24Angle * Math.PI) / 180) * (60 * scale)}
            y2={center + Math.sin((hour24Angle * Math.PI) / 180) * (60 * scale)}
            stroke="var(--blue-dark)"
            strokeWidth={8 * scale}
            strokeLinecap="round"
          />

          {/* Hour hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((hourAngle * Math.PI) / 180) * (120 * scale)}
            y2={center + Math.sin((hourAngle * Math.PI) / 180) * (120 * scale)}
            stroke="var(--gray-dark)"
            strokeWidth={8 * scale}
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((minuteAngle * Math.PI) / 180) * (160 * scale)}
            y2={center + Math.sin((minuteAngle * Math.PI) / 180) * (160 * scale)}
            stroke="#374151"
            strokeWidth={6 * scale}
            strokeLinecap="round"
          />

          {/* Second hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((secondAngle * Math.PI) / 180) * (200 * scale)}
            y2={center + Math.sin((secondAngle * Math.PI) / 180) * (200 * scale)}
            stroke="var(--red)"
            strokeWidth={3 * scale}
            strokeLinecap="round"
            style={{ transition: 'all 0.1s linear' }}
          />

          {/* Millisecond hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((millisecondAngle * Math.PI) / 180) * (220 * scale)}
            y2={center + Math.sin((millisecondAngle * Math.PI) / 180) * (220 * scale)}
            stroke="var(--yellow)"
            strokeWidth={1.5 * scale}
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Counterweight for second hand */}
          <line
            x1={center}
            y1={center}
            x2={center + Math.cos(((secondAngle + 180) * Math.PI) / 180) * (30 * scale)}
            y2={center + Math.sin(((secondAngle + 180) * Math.PI) / 180) * (30 * scale)}
            stroke="var(--red)"
            strokeWidth={3 * scale}
            strokeLinecap="round"
          />

          {/* Center mechanism */}
          <circle cx={center} cy={center} r={15 * scale} fill="var(--gray-dark)" />
          <circle cx={center} cy={center} r={10 * scale} fill="var(--amber)" />
          <circle cx={center} cy={center} r={6 * scale} fill="var(--red)" />
          <circle cx={center} cy={center} r={3 * scale} fill="var(--gray-dark)" />

          {/* Subseconds dial */}
          <circle cx={center - (100 * scale)} cy={center + (100 * scale)} r={45 * scale} fill="var(--white)" stroke="var(--gray-dark)" strokeWidth={2 * scale} />
          <text x={center - (100 * scale)} y={center + (50 * scale)} textAnchor="middle" style={{ fontSize: `${12 * scale}px`, fill: '#374151' }}>SUBSECONDS</text>
          {Array.from({ length: 10 }, (_, i) => {
            const angle = i * 36 - 90;
            const radian = (angle * Math.PI) / 180;
            const dialCenterX = center - (100 * scale);
            const dialCenterY = center + (100 * scale);
            const x1 = dialCenterX + Math.cos(radian) * (40 * scale);
            const y1 = dialCenterY + Math.sin(radian) * (40 * scale);
            const x2 = dialCenterX + Math.cos(radian) * (35 * scale);
            const y2 = dialCenterY + Math.sin(radian) * (35 * scale);
            return (
              <g key={`subsec-${i}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gray-light)" strokeWidth={1 * scale} />
                <text
                  x={dialCenterX + Math.cos(radian) * (30 * scale)}
                  y={dialCenterY + Math.sin(radian) * (30 * scale)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: `${12 * scale}px`, fill: '#6b7280' }}
                >
                  {i}
                </text>
              </g>
            );
          })}
          <line
            x1={center - (100 * scale)}
            y1={center + (100 * scale)}
            x2={center - (100 * scale) + Math.cos(((milliseconds / 100 * 36) - 90) * Math.PI / 180) * (35 * scale)}
            y2={center + (100 * scale) + Math.sin(((milliseconds / 100 * 36) - 90) * Math.PI / 180) * (35 * scale)}
            stroke="var(--yellow)"
            strokeWidth={2 * scale}
          />

          {/* Day/Date dial */}
          <circle cx={center + (100 * scale)} cy={center + (100 * scale)} r={45 * scale} fill="var(--white)" stroke="var(--gray-dark)" strokeWidth={2 * scale} />
          <text x={center + (100 * scale)} y={center + (50 * scale)} textAnchor="middle" style={{ fontSize: `${12 * scale}px`, fill: '#374151' }}>DAY OF MONTH</text>
          {Array.from({ length: 31 }, (_, i) => {
            const angle = (i * 360 / 31) - 90;
            const radian = (angle * Math.PI) / 180;
            const dialCenterX = center + (100 * scale);
            const dialCenterY = center + (100 * scale);
            const isCurrentDay = (i + 1) === time.getDate();
            if ((i + 1) % 5 === 0 || (i + 1) === 1) {
              return (
                <text
                  key={`day-${i}`}
                  x={dialCenterX + Math.cos(radian) * (30 * scale)}
                  y={dialCenterY + Math.sin(radian) * (30 * scale)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: `${12 * scale}px`, fill: isCurrentDay ? '#dc2626' : '#6b7280', fontWeight: isCurrentDay ? '700' : '400' }}
                >
                  {i + 1}
                </text>
              );
            }
            return null;
          })}
          <line
            x1={center + (100 * scale)}
            y1={center + (100 * scale)}
            x2={center + (100 * scale) + Math.cos(((time.getDate() * 360 / 31) - 90) * Math.PI / 180) * (35 * scale)}
            y2={center + (100 * scale) + Math.sin(((time.getDate() * 360 / 31) - 90) * Math.PI / 180) * (35 * scale)}
            stroke="var(--red)"
            strokeWidth={2 * scale}
          />
        </svg>

        {/* Corner time labels - positioned absolutely within the clock container */}
        <div style={{
          position: 'absolute',
          top: `${16 * scale}px`,
          left: `${16 * scale}px`,
          fontSize: `${Math.max(10, 12 * scale)}px`,
          fontWeight: '700',
          color: '#374151',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: `${Math.max(2, 4 * scale)}px ${Math.max(4, 8 * scale)}px`,
          borderRadius: `${4 * scale}px`,
          whiteSpace: 'nowrap',
        }}>
          00:00 MIDNIGHT
        </div>
        <div style={{
          position: 'absolute',
          top: `${16 * scale}px`,
          right: `${16 * scale}px`,
          fontSize: `${Math.max(10, 12 * scale)}px`,
          fontWeight: '700',
          color: '#374151',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: `${Math.max(2, 4 * scale)}px ${Math.max(4, 8 * scale)}px`,
          borderRadius: `${4 * scale}px`,
          whiteSpace: 'nowrap',
        }}>
          06:00 DAWN
        </div>
        <div style={{
          position: 'absolute',
          bottom: `${16 * scale}px`,
          right: `${16 * scale}px`,
          fontSize: `${Math.max(10, 12 * scale)}px`,
          fontWeight: '700',
          color: '#374151',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: `${Math.max(2, 4 * scale)}px ${Math.max(4, 8 * scale)}px`,
          borderRadius: `${4 * scale}px`,
          whiteSpace: 'nowrap',
        }}>
          12:00 NOON
        </div>
        <div style={{
          position: 'absolute',
          bottom: `${16 * scale}px`,
          left: `${16 * scale}px`,
          fontSize: `${Math.max(10, 12 * scale)}px`,
          fontWeight: '700',
          color: '#374151',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: `${Math.max(2, 4 * scale)}px ${Math.max(4, 8 * scale)}px`,
          borderRadius: `${4 * scale}px`,
          whiteSpace: 'nowrap',
        }}>
          18:00 DUSK
        </div>
      </div>
    </div>
  );
};

export default UltraElaborateAnalogClock;