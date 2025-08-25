import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Moon, Atom, Globe, Timer } from 'lucide-react';

const TimeMeasurementDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // Update every 100ms for smooth animations
    
    return () => clearInterval(timer);
  }, []);

  // Calculate various time measurements
  const now = currentTime;
  const sessionDuration = now - startTime;
  
  // Atomic/Physics Time
  const cesiumOscillations = Math.floor(sessionDuration * 9192631770); // Cesium-133 transitions per ms
  const plankTimes = Math.floor(sessionDuration * (1 / 5.39124e-44)); // Planck time units
  
  // Astronomical Time
  const siderealDay = 23 * 3600 + 56 * 60 + 4.0905; // seconds
  const siderealTime = (now.getTime() / 1000 / siderealDay) % 1;
  const julianDay = Math.floor(now.getTime() / 86400000) + 2440587.5;
  
  // Geological Time
  const earthAge = 4.54e9; // years
  const yearsSinceEarth = now.getFullYear() - (-earthAge);
  
  // Biological Rhythms
  const heartbeats = Math.floor(sessionDuration / 1000 * 1.17); // ~70 bpm average
  const breathCycles = Math.floor(sessionDuration / 1000 / 4); // ~15 per minute
  
  // Internet Time
  const beatTime = Math.floor((now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 86.4);
  
  // Unix timestamp
  const unixTime = Math.floor(now.getTime() / 1000);
  
  // Network Time Protocol
  const ntpTime = unixTime + 2208988800; // NTP epoch offset
  
  // Binary/Hexadecimal time
  const binaryTime = unixTime.toString(2);
  const hexTime = unixTime.toString(16).toUpperCase();
  
  // Decimal time (French Revolutionary)
  const decimalDay = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  const decimalHours = Math.floor(decimalDay * 10);
  const decimalMinutes = Math.floor((decimalDay * 1000) % 100);
  const decimalSeconds = Math.floor((decimalDay * 100000) % 100);

  const timeCategories = [
    {
      title: "Standard Time",
      icon: <Clock className="w-6 h-6" />,
      items: [
        { label: "Local Time", value: now.toLocaleTimeString() },
        { label: "UTC Time", value: now.toUTCString() },
        { label: "ISO 8601", value: now.toISOString() },
        { label: "Unix Timestamp", value: unixTime.toLocaleString() },
        { label: "Milliseconds", value: now.getTime().toLocaleString() },
        { label: "Session Duration", value: `${Math.floor(sessionDuration/1000)}s ${sessionDuration%1000}ms` }
      ]
    },
    {
      title: "Alternative Formats",
      icon: <Timer className="w-6 h-6" />,
      items: [
        { label: "Binary Time", value: binaryTime },
        { label: "Hexadecimal Time", value: `0x${hexTime}` },
        { label: "Internet Time", value: `@${beatTime}` },
        { label: "NTP Time", value: ntpTime.toLocaleString() },
        { label: "Decimal Time", value: `${decimalHours}:${decimalMinutes}:${decimalSeconds}` },
        { label: "Epoch Days", value: Math.floor(unixTime / 86400).toLocaleString() }
      ]
    },
    {
      title: "Astronomical Time",
      icon: <Sun className="w-6 h-6" />,
      items: [
        { label: "Julian Day", value: julianDay.toFixed(5) },
        { label: "Sidereal Time", value: `${(siderealTime * 24).toFixed(4)} hours` },
        { label: "Solar Day Progress", value: `${((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400 * 100).toFixed(2)}%` },
        { label: "Year Progress", value: `${(((now - new Date(now.getFullYear(), 0, 1)) / (new Date(now.getFullYear() + 1, 0, 1) - new Date(now.getFullYear(), 0, 1))) * 100).toFixed(2)}%` },
        { label: "Lunar Cycle", value: `Day ${Math.floor(((now - new Date(2000, 0, 6)) / 86400000) % 29.53).toFixed(0)} of 29.53` },
        { label: "Season Progress", value: `${(((now.getMonth() % 3) * 30 + now.getDate()) / 90 * 100).toFixed(1)}%` }
      ]
    },
    {
      title: "Atomic & Physics",
      icon: <Atom className="w-6 h-6" />,
      items: [
        { label: "Cesium Oscillations", value: cesiumOscillations.toExponential(2) },
        { label: "Atomic Time (TAI)", value: `UTC + 37s` },
        { label: "Planck Times", value: plankTimes.toExponential(2) },
        { label: "Light Travel (1m)", value: `${(sessionDuration * 299792458).toExponential(2)} meters` },
        { label: "Radioactive Decay", value: `~${(sessionDuration * 1000).toExponential(2)} C-14 decays/gram` },
        { label: "Quantum Fluctuations", value: `${(sessionDuration / 1e-15).toExponential(2)} femtoseconds` }
      ]
    },
    {
      title: "Biological Time",
      icon: <Globe className="w-6 h-6" />,
      items: [
        { label: "Heartbeats", value: heartbeats.toLocaleString() },
        { label: "Breath Cycles", value: breathCycles.toLocaleString() },
        { label: "Cell Divisions", value: `~${Math.floor(sessionDuration / 1000 / 1440).toLocaleString()}` }, // ~24 hours average
        { label: "Circadian Phase", value: `${((now.getHours() + now.getMinutes()/60) / 24 * 100).toFixed(1)}%` },
        { label: "Ultradian Cycles", value: `${Math.floor((now.getHours() * 60 + now.getMinutes()) / 90)} of 16` },
        { label: "Metabolic Rate", value: `~${(sessionDuration / 1000 * 80).toFixed(0)} calories` }
      ]
    },
    {
      title: "Geological Time",
      icon: <Calendar className="w-6 h-6" />,
      items: [
        { label: "Years Since Earth", value: yearsSinceEarth.toExponential(2) },
        { label: "Geological Eon", value: "Phanerozoic" },
        { label: "Geological Era", value: "Cenozoic" },
        { label: "Geological Period", value: "Quaternary" },
        { label: "Epoch", value: "Holocene" },
        { label: "Continental Drift", value: `~${(sessionDuration / 1000 / 31557600 * 2.5).toFixed(6)} cm` } // ~2.5cm/year
      ]
    },
    {
      title: "Cultural & Historical",
      icon: <Calendar className="w-6 h-6" />,
      items: [     { label: "Unix Epoch Age", value: `${((now - new Date(1970, 0, 1)) / 31557600000).toFixed(8)} years` },
        { label: "Internet Age", value: `${((now - new Date(1969, 9, 29)) / 31557600000).toFixed(2)} years` }, // ARPANET
        { label: "Holocene Calendar", value: `${now.getFullYear() + 10000} HE` }
      ]
    },
    {
      title: "Computer Time",
      icon: <Timer className="w-6 h-6" />,
      items: [
        { label: "CPU Cycles", value: `~${(sessionDuration * 3e9).toExponential(2)}` }, // 3GHz estimate
        { label: "Frame Rate", value: `~${Math.floor(sessionDuration / 1000 * 60)} frames @ 60fps` },
        { label: "Network Packets", value: `~${Math.floor(sessionDuration / 100)}` }, // Rough estimate
        { label: "GPS Week", value: Math.floor((now - new Date(1980, 0, 6)) / (7 * 86400000)) },
        { label: "Leap Seconds", value: "37 since 1972" },
        { label: "System Uptime", value: `${(sessionDuration / 1000).toFixed(1)}s` }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Temporal Measurement Matrix
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Every conceivable way to measure the passage of time
          </p>
          <div className="text-sm text-gray-400">
            Session started: {startTime.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {timeCategories.map((category, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-purple-400">
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold text-purple-300">
                  {category.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col space-y-1">
                    <div className="text-sm text-gray-400 font-medium">
                      {item.label}
                    </div>
                    <div className="text-white font-mono text-sm bg-slate-900/50 rounded px-3 py-2 border border-slate-700/30">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Real-time Updates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Milliseconds</div>
                <div className="font-mono text-green-400">{now.getMilliseconds()}</div>
              </div>
              <div>
                <div className="text-gray-400">Session (ms)</div>
                <div className="font-mono text-blue-400">{sessionDuration}</div>
              </div>
              <div>
                <div className="text-gray-400">Unix Time</div>
                <div className="font-mono text-yellow-400">{unixTime}</div>
              </div>
              <div>
                <div className="text-gray-400">Heartbeats</div>
                <div className="font-mono text-red-400">{heartbeats}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeMeasurementDisplay;