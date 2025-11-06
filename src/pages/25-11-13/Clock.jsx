import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Moon, Atom, Globe, Timer } from 'lucide-react';

export default function TimeMeasurementDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const now = currentTime;
  const sessionDuration = now - startTime;

  // Atomic/Physics Time
  const cesiumOscillations = Math.floor(sessionDuration * 9192631770);
  const plankTimes = Math.floor(sessionDuration * (1 / 5.39124e-44));

  // Astronomical Time
  const siderealDay = 23 * 3600 + 56 * 60 + 4.0905;
  const siderealTime = (now.getTime() / 1000 / siderealDay) % 1;
  const julianDay = Math.floor(now.getTime() / 86400000) + 2440587.5;

  // Geological Time
  const earthAge = 4.54e9;
  const yearsSinceEarth = now.getFullYear() - (-earthAge);

  // Biological Rhythms
  const heartbeats = Math.floor((sessionDuration / 1000) * 1.17);
  const breathCycles = Math.floor(sessionDuration / 1000 / 4);

  // Internet Time
  const beatTime = Math.floor(
    (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 86.4
  );

  // Unix timestamp
  const unixTime = Math.floor(now.getTime() / 1000);

  // Network Time Protocol
  const ntpTime = unixTime + 2208988800;

  // Binary/Hexadecimal time
  const binaryTime = unixTime.toString(2);
  const hexTime = unixTime.toString(16).toUpperCase();

  // Decimal time (French Revolutionary)
  const decimalDay =
    (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  const decimalHours = Math.floor(decimalDay * 10);
  const decimalMinutes = Math.floor((decimalDay * 1000) % 100);
  const decimalSeconds = Math.floor((decimalDay * 100000) % 100);

  const timeCategories = [
    // {
    //   title: 'Standard Time',
    //   icon: <Clock width={24} height={24} />,
    //   items: [
    //     { label: 'Local Time', value: now.toLocaleTimeString() },
    //     { label: 'UTC Time', value: now.toUTCString() },
    //     { label: 'ISO 8601', value: now.toISOString() },
    //     { label: 'Unix Timestamp', value: unixTime.toLocaleString() },
    //     { label: 'Milliseconds', value: now.getTime().toLocaleString() },
    //     {
    //       label: 'Session Duration',
    //       value: `${Math.floor(sessionDuration / 1000)}s ${
    //         sessionDuration % 1000
    //       }ms`,
    //     },
    //   ],
    // },
    {
      title: 'Alternative Formats',
      icon: <Timer width={24} height={24} />,
      items: [
        { label: 'Binary Time', value: binaryTime },
        { label: 'Hexadecimal Time', value: `0x${hexTime}` },
        { label: 'Internet Time', value: `@${beatTime}` },
        { label: 'NTP Time', value: ntpTime.toLocaleString() },
        {
          label: 'Decimal Time',
          value: `${decimalHours}:${decimalMinutes}:${decimalSeconds}`,
        },
        {
          label: 'Epoch Days',
          value: Math.floor(unixTime / 86400).toLocaleString(),
        },
      ],
    },
    {
      title: 'Astronomical Time',
      icon: <Sun width={24} height={24} />,
      items: [
        { label: 'Julian Day', value: julianDay.toFixed(5) },
        { label: 'Sidereal Time', value: `${(siderealTime * 24).toFixed(4)} hours` },
        {
          label: 'Solar Day Progress',
          value: `${(
            ((now.getHours() * 3600 +
              now.getMinutes() * 60 +
              now.getSeconds()) /
              86400) *
            100
          ).toFixed(2)}%`,
        },
        {
          label: 'Year Progress',
          value: `${(
            ((now - new Date(now.getFullYear(), 0, 1)) /
              (new Date(now.getFullYear() + 1, 0, 1) -
                new Date(now.getFullYear(), 0, 1))) *
            100
          ).toFixed(2)}%`,
        },
        {
          label: 'Lunar Cycle',
          value: `Day ${Math.floor(
            ((now - new Date(2000, 0, 6)) / 86400000) % 29.53
          ).toFixed(0)} of 29.53`,
        },
        {
          label: 'Season Progress',
          value: `${(((now.getMonth() % 3) * 30 + now.getDate()) / 90) * 100}%`,
        },
      ],
    },
    {
      title: 'Atomic & Physics',
      icon: <Atom width={24} height={24} />,
      items: [
        { label: 'Cesium Oscillations', value: cesiumOscillations.toExponential(2) },
        { label: 'Atomic Time (TAI)', value: 'UTC + 37s' },
        { label: 'Planck Times', value: plankTimes.toExponential(2) },
        {
          label: 'Light Travel (1m)',
          value: `${(sessionDuration * 299792458).toExponential(2)} meters`,
        },
        {
          label: 'Radioactive Decay',
          value: `~${(sessionDuration * 1000).toExponential(2)} C-14 decays/gram`,
        },
        {
          label: 'Quantum Fluctuations',
          value: `${(sessionDuration / 1e-15).toExponential(2)} femtoseconds`,
        },
      ],
    },
    {
      title: 'Biological Time',
      icon: <Globe width={24} height={24} />,
      items: [
        { label: 'Heartbeats', value: heartbeats.toLocaleString() },
        { label: 'Breath Cycles', value: breathCycles.toLocaleString() },
        {
          label: 'Cell Divisions',
          value: `~${Math.floor(sessionDuration / 1000 / 1440).toLocaleString()}`,
        },
        {
          label: 'Circadian Phase',
          value: `${(((now.getHours() + now.getMinutes() / 60) / 24) * 100).toFixed(
            1
          )}%`,
        },
        {
          label: 'Ultradian Cycles',
          value: `${Math.floor(
            (now.getHours() * 60 + now.getMinutes()) / 90
          )} of 16`,
        },
        {
          label: 'Metabolic Rate',
          value: `~${((sessionDuration / 1000) * 80).toFixed(0)} calories`,
        },
      ],
    },
    {
      title: 'Geological Time',
      icon: <Calendar width={24} height={24} />,
      items: [
        { label: 'Years Since Earth', value: yearsSinceEarth.toExponential(2) },
        { label: 'Geological Eon', value: 'Phanerozoic' },
        { label: 'Geological Era', value: 'Cenozoic' },
        { label: 'Geological Period', value: 'Quaternary' },
        { label: 'Epoch', value: 'Holocene' },
        {
          label: 'Continental Drift',
          value: `~${(
            (sessionDuration / 1000 / 31557600) *
            2.5
          ).toFixed(6)} cm`,
        },
      ],
    },
    {
      title: 'Cultural & Historical',
      icon: <Calendar width={24} height={24} />,
      items: [
        {
          label: 'Unix Epoch Age',
          value: `${(
            (now - new Date(1970, 0, 1)) /
            31557600000
          ).toFixed(8)} years`,
        },
        {
          label: 'Internet Age',
          value: `${(
            (now - new Date(1969, 9, 29)) /
            31557600000
          ).toFixed(2)} years`,
        },
        { label: 'Holocene Calendar', value: `${now.getFullYear() + 10000} HE` },
      ],
    },
    {
      title: 'Computer Time',
      icon: <Timer width={24} height={24} />,
      items: [
        { label: 'CPU Cycles', value: `~${(sessionDuration * 3e9).toExponential(2)}` },
        {
          label: 'Frame Rate',
          value: `~${Math.floor((sessionDuration / 1000) * 60)} frames @ 60fps`,
        },
        { label: 'Network Packets', value: `~${Math.floor(sessionDuration / 100)}` },
        {
          label: 'GPS Week',
          value: Math.floor((now - new Date(1980, 0, 6)) / (7 * 86400000)),
        },
        { label: 'Leap Seconds', value: '37 since 1972' },
        { label: 'System Uptime', value: `${(sessionDuration / 1000).toFixed(1)}s` },
      ],
    },
  ];

  const styles = {
    root: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #0f172a 0%, #6d28d9 50%, #0f172a 100%)',
      color: '#ffffff',
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    },
    container: { maxWidth: '1120px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '48px' },
    title: {
      fontSize: '3rem',
      fontWeight: 800,
      margin: '0 0 16px 0',
      backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    },
    subtitle: { fontSize: '0.9rem', color: '#94a3b8' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '12px',
      padding: '24px',
      boxSizing: 'border-box',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      color: '#c4b5fd',
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#c4b5fd',
      margin: 0,
    },
    itemWrap: { display: 'flex', flexDirection: 'column', gap: '16px' },
    item: {
      display: 'flex',
      flexDirection: 'row-reverse', // <- tick/label on the other side
      justifyContent: 'space-between',
      gap: '8px',
      alignItems: 'center',
    },
    itemLabel: { fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 },
    itemValue: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: '0.9rem',
      background: 'rgba(2, 6, 23, 0.5)',
      border: '1px solid rgba(51, 65, 85, 0.3)',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '8px 12px',
    },
    footer: { marginTop: '48px', textAlign: 'center' },
    footerBox: {
      background: 'rgba(30, 41, 59, 0.3)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '12px',
      padding: '24px',
      display: 'inline-block',
      minWidth: '280px',
    },
    footerTitle: {
      fontSize: '1.05rem',
      fontWeight: 600,
      color: '#c4b5fd',
      margin: '0 0 16px 0',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px',
    },
    footerStat: {
      display: 'flex',
      flexDirection: 'row-reverse', // <- tick/label on the other side
      justifyContent: 'space-between',
      gap: '8px',
      alignItems: 'center',
      fontSize: '0.9rem',
    },
    footerLabel: { color: '#94a3b8' },
    footerValue: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.subtitle}>
            Session started: {startTime.toLocaleString()}
          </div>
        </div>

        <div style={styles.grid}>
          {timeCategories.map((category, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ color: '#a78bfa' }}>{category.icon}</div>
                <h2 style={styles.cardTitle}>{category.title}</h2>
              </div>
              <div style={styles.itemWrap}>
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} style={styles.item}>
                    <div style={styles.itemLabel}>{item.label}</div>
                    <div style={styles.itemValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div style={styles.footerBox}>
            <h3 style={styles.footerTitle}>Real-time Updates</h3>
            <div style={styles.footerGrid}>
              <div style={styles.footerStat}>
                <div style={styles.footerLabel}>Milliseconds</div>
                <div style={{ ...styles.footerValue, color: '#4ade80' }}>
                  {now.getMilliseconds()}
                </div>
              </div>
              <div style={styles.footerStat}>
                <div style={styles.footerLabel}>Session (ms)</div>
                <div style={{ ...styles.footerValue, color: '#60a5fa' }}>
                  {sessionDuration}
                </div>
              </div>
              <div style={styles.footerStat}>
                <div style={styles.footerLabel}>Unix Time</div>
                <div style={{ ...styles.footerValue, color: '#facc15' }}>
                  {unixTime}
                </div>
              </div>
              <div style={styles.footerStat}>
                <div style={styles.footerLabel}>Heartbeats</div>
                <div style={{ ...styles.footerValue, color: '#f87171' }}>
                  {heartbeats}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
