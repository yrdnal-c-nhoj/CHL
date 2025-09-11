import React from 'react';

const MedievalBanner = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <svg 
        viewBox="0 0 800 600" 
        preserveAspectRatio="none"
        style={{
          width: '100vw',
          height: '100dvh',
          display: 'block'
        }}
      >
        {/* Sky background */}
        <rect width="800" height="600" fill="#87CEEB"/>
        
        {/* Ground */}
        <ellipse cx="400" cy="580" rx="400" ry="20" fill="#8B7355"/>
        
        {/* Left tree trunk */}
        <rect x="50" y="200" width="40" height="300" fill="#8B4513"/>
        {/* Left tree texture lines */}
        <line x1="55" y1="220" x2="85" y2="225" stroke="#654321" strokeWidth="2"/>
        <line x1="55" y1="250" x2="85" y2="255" stroke="#654321" strokeWidth="2"/>
        <line x1="55" y1="280" x2="85" y2="285" stroke="#654321" strokeWidth="2"/>
        <line x1="55" y1="310" x2="85" y2="315" stroke="#654321" strokeWidth="2"/>
        <line x1="55" y1="340" x2="85" y2="345" stroke="#654321" strokeWidth="2"/>
        
        {/* Right tree trunk */}
        <rect x="710" y="180" width="40" height="320" fill="#8B4513"/>
        {/* Right tree texture lines */}
        <line x1="715" y1="200" x2="745" y2="205" stroke="#654321" strokeWidth="2"/>
        <line x1="715" y1="230" x2="745" y2="235" stroke="#654321" strokeWidth="2"/>
        <line x1="715" y1="260" x2="745" y2="265" stroke="#654321" strokeWidth="2"/>
        <line x1="715" y1="290" x2="745" y2="295" stroke="#654321" strokeWidth="2"/>
        <line x1="715" y1="320" x2="745" y2="325" stroke="#654321" strokeWidth="2"/>
        
        {/* Rope between trees */}
        <path d="M 90 210 Q 400 240 710 190" stroke="#8B4513" strokeWidth="6" fill="none"/>
        {/* Rope texture */}
        <path d="M 90 210 Q 400 240 710 190" stroke="#A0522D" strokeWidth="3" fill="none"/>
        
        {/* Main fabric banner */}
        <path d="M 180 250 Q 400 280 620 240 L 620 480 Q 400 510 180 470 Z" fill="#8B0000" stroke="#654321" strokeWidth="2"/>
        
        {/* Fabric texture pattern definition */}
        <defs>
          <pattern id="weave" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#8B0000"/>
            <rect x="0" y="0" width="10" height="10" fill="#A0222A"/>
            <rect x="10" y="10" width="10" height="10" fill="#A0222A"/>
            <line x1="0" y1="5" x2="20" y2="5" stroke="#654321" strokeWidth="0.5" opacity="0.3"/>
            <line x1="0" y1="15" x2="20" y2="15" stroke="#654321" strokeWidth="0.5" opacity="0.3"/>
            <line x1="5" y1="0" x2="5" y2="20" stroke="#654321" strokeWidth="0.5" opacity="0.3"/>
            <line x1="15" y1="0" x2="15" y2="20" stroke="#654321" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Apply woven texture to banner */}
        <path d="M 200 260 Q 400 285 600 250 L 600 470 Q 400 500 200 460 Z" fill="url(#weave)"/>
        
        {/* Left embroidered border */}
        <rect x="200" y="260" width="30" height="200" fill="#DAA520"/>
        {/* Left border pattern circles */}
        <circle cx="215" cy="280" r="5" fill="#8B0000"/>
        <circle cx="215" cy="300" r="5" fill="#FFD700"/>
        <circle cx="215" cy="320" r="5" fill="#8B0000"/>
        <circle cx="215" cy="340" r="5" fill="#FFD700"/>
        <circle cx="215" cy="360" r="5" fill="#8B0000"/>
        <circle cx="215" cy="380" r="5" fill="#FFD700"/>
        <circle cx="215" cy="400" r="5" fill="#8B0000"/>
        <circle cx="215" cy="420" r="5" fill="#FFD700"/>
        <circle cx="215" cy="440" r="5" fill="#8B0000"/>
        
        {/* Left border decorative triangles */}
        <path d="M 205 275 L 225 275 L 215 285 Z" fill="#FFD700"/>
        <path d="M 205 295 L 225 295 L 215 305 Z" fill="#8B0000"/>
        <path d="M 205 315 L 225 315 L 215 325 Z" fill="#FFD700"/>
        <path d="M 205 335 L 225 335 L 215 345 Z" fill="#8B0000"/>
        <path d="M 205 355 L 225 355 L 215 365 Z" fill="#FFD700"/>
        <path d="M 205 375 L 225 375 L 215 385 Z" fill="#8B0000"/>
        <path d="M 205 395 L 225 395 L 215 405 Z" fill="#FFD700"/>
        <path d="M 205 415 L 225 415 L 215 425 Z" fill="#8B0000"/>
        <path d="M 205 435 L 225 435 L 215 445 Z" fill="#FFD700"/>
        
        {/* Right embroidered border */}
        <rect x="570" y="250" width="30" height="200" fill="#DAA520"/>
        {/* Right border pattern circles */}
        <circle cx="585" cy="270" r="5" fill="#8B0000"/>
        <circle cx="585" cy="290" r="5" fill="#FFD700"/>
        <circle cx="585" cy="310" r="5" fill="#8B0000"/>
        <circle cx="585" cy="330" r="5" fill="#FFD700"/>
        <circle cx="585" cy="350" r="5" fill="#8B0000"/>
        <circle cx="585" cy="370" r="5" fill="#FFD700"/>
        <circle cx="585" cy="390" r="5" fill="#8B0000"/>
        <circle cx="585" cy="410" r="5" fill="#FFD700"/>
        <circle cx="585" cy="430" r="5" fill="#8B0000"/>
        
        {/* Right border decorative triangles */}
        <path d="M 575 265 L 595 265 L 585 275 Z" fill="#FFD700"/>
        <path d="M 575 285 L 595 285 L 585 295 Z" fill="#8B0000"/>
        <path d="M 575 305 L 595 305 L 585 315 Z" fill="#FFD700"/>
        <path d="M 575 325 L 595 325 L 585 335 Z" fill="#8B0000"/>
        <path d="M 575 345 L 595 345 L 585 355 Z" fill="#FFD700"/>
        <path d="M 575 365 L 595 365 L 585 375 Z" fill="#8B0000"/>
        <path d="M 575 385 L 595 385 L 585 395 Z" fill="#FFD700"/>
        <path d="M 575 405 L 595 405 L 585 415 Z" fill="#8B0000"/>
        <path d="M 575 425 L 595 425 L 585 435 Z" fill="#FFD700"/>
        
        {/* Rope ties connecting banner to rope */}
        <rect x="175" y="240" width="8" height="25" fill="#8B4513" transform="rotate(15 179 252)"/>
        <rect x="617" y="230" width="8" height="25" fill="#8B4513" transform="rotate(-15 621 242)"/>
        
        {/* Banner shadows for depth */}
        <path d="M 185 475 Q 400 505 615 465 L 620 480 Q 400 510 180 470 Z" fill="#000000" opacity="0.2"/>
        
        {/* Small fabric wrinkles */}
        <path d="M 250 300 Q 300 305 350 300" stroke="#654321" strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M 300 350 Q 350 355 400 350" stroke="#654321" strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M 450 320 Q 500 325 550 320" stroke="#654321" strokeWidth="1" fill="none" opacity="0.3"/>
        
        {/* Tree leaves */}
        <circle cx="70" cy="180" r="45" fill="#228B22"/>
        <circle cx="50" cy="160" r="35" fill="#32CD32"/>
        <circle cx="90" cy="150" r="40" fill="#228B22"/>
        
        <circle cx="730" cy="160" r="50" fill="#228B22"/>
        <circle cx="710" cy="140" r="40" fill="#32CD32"/>
        <circle cx="750" cy="130" r="35" fill="#228B22"/>
        

      </svg>
    </div>
  );
};

export default MedievalBanner;