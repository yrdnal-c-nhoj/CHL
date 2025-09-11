import React from 'react';

const MedievalSVG = () => (
  <svg
    viewBox="0 0 800 1000"
    preserveAspectRatio="none"
    style={{ width: '100%', height: '90%' }}
  >
    <defs>
      {/* Bark texture pattern */}
      <pattern id="barkTexture" patternUnits="userSpaceOnUse" width="8" height="12">
        <rect width="8" height="12" fill="#8B4513" />
        <path d="M0 0 L8 3 L0 6 L8 9 L0 12" stroke="#654321" strokeWidth="1" fill="none" />
        <circle cx="2" cy="4" r="0.5" fill="#654321" />
        <circle cx="6" cy="8" r="0.5" fill="#654321" />
      </pattern>

      {/* Banner weave pattern */}
      <pattern id="weave" patternUnits="userSpaceOnUse" width="30" height="30">
        <rect width="30" height="30" fill="#8B0000" opacity="0.5" />
        <rect x="0" y="0" width="15" height="15" fill="#A0222A" opacity="0.5" />
        <rect x="15" y="15" width="15" height="15" fill="#A0222A" opacity="0.5" />
        <line x1="0" y1="7.5" x2="30" y2="7.5" stroke="#654321" strokeWidth="0.7" opacity={0.5 * 0.3} />
        <line x1="0" y1="22.5" x2="30" y2="22.5" stroke="#654321" strokeWidth="0.7" opacity={0.5 * 0.3} />
        <line x1="7.5" y1="0" x2="7.5" y2="30" stroke="#654321" strokeWidth="0.7" opacity={0.5 * 0.3} />
        <line x1="22.5" y1="0" x2="22.5" y2="30" stroke="#654321" strokeWidth="0.7" opacity={0.5 * 0.3} />
      </pattern>
    </defs>

    {/* LEFT TREE */}
    <ellipse cx="75" cy="850" rx="35" ry="150" fill="url(#barkTexture)" />
    <ellipse cx="75" cy="700" rx="30" ry="120" fill="url(#barkTexture)" />
    <ellipse cx="75" cy="580" rx="25" ry="100" fill="url(#barkTexture)" />
    <ellipse cx="75" cy="480" rx="22" ry="80" fill="url(#barkTexture)" />
    {/* Branches */}
    <ellipse cx="45" cy="450" rx="12" ry="60" fill="url(#barkTexture)" transform="rotate(-25 45 450)" />
    <ellipse cx="105" cy="420" rx="10" ry="50" fill="url(#barkTexture)" transform="rotate(30 105 420)" />
    <ellipse cx="35" cy="380" rx="8" ry="40" fill="#8B4513" transform="rotate(-45 35 380)" />
    <ellipse cx="115" cy="350" rx="9" ry="45" fill="#8B4513" transform="rotate(40 115 350)" />
    {/* Smaller branches */}
    <ellipse cx="25" cy="320" rx="5" ry="25" fill="#8B4513" transform="rotate(-60 25 320)" />
    <ellipse cx="125" cy="300" rx="4" ry="20" fill="#8B4513" transform="rotate(55 125 300)" />
    <ellipse cx="50" cy="280" rx="6" ry="30" fill="#8B4513" transform="rotate(-20 50 280)" />
    <ellipse cx="100" cy="260" rx="5" ry="25" fill="#8B4513" transform="rotate(25 100 260)" />
    {/* Foliage clusters */}
    <circle cx="20" cy="310" r="25" fill="#228B22" />
    <circle cx="35" cy="295" r="30" fill="#32CD32" />
    <circle cx="50" cy="320" r="28" fill="#228B22" />
    <circle cx="130" cy="290" r="22" fill="#32CD32" />
    <circle cx="115" cy="275" r="25" fill="#228B22" />
    <circle cx="140" cy="305" r="20" fill="#32CD32" />
    <circle cx="45" cy="250" r="32" fill="#228B22" />
    <circle cx="65" cy="235" r="28" fill="#32CD32" />
    <circle cx="25" cy="240" r="25" fill="#228B22" />
    <circle cx="105" cy="230" r="26" fill="#32CD32" />
    <circle cx="125" cy="215" r="24" fill="#228B22" />
    <circle cx="85" cy="210" r="22" fill="#32CD32" />
    {/* Crown */}
    <circle cx="75" cy="180" r="45" fill="#228B22" />
    <circle cx="55" cy="160" r="35" fill="#32CD32" />
    <circle cx="95" cy="170" r="38" fill="#228B22" />
    <circle cx="75" cy="140" r="30" fill="#32CD32" />
    {/* Roots */}
    <ellipse cx="45" cy="980" rx="8" ry="30" fill="#8B4513" transform="rotate(-30 45 980)" />
    <ellipse cx="105" cy="985" rx="10" ry="35" fill="#8B4513" transform="rotate(25 105 985)" />
    <ellipse cx="75" cy="990" rx="12" ry="25" fill="#8B4513" />

    {/* RIGHT TREE */}
    <ellipse cx="725" cy="870" rx="38" ry="170" fill="url(#barkTexture)" />
    <ellipse cx="725" cy="700" rx="33" ry="130" fill="url(#barkTexture)" />
    <ellipse cx="725" cy="570" rx="28" ry="110" fill="url(#barkTexture)" />
    <ellipse cx="725" cy="460" rx="25" ry="90" fill="url(#barkTexture)" />
    {/* Branches */}
    <ellipse cx="680" cy="430" rx="14" ry="65" fill="url(#barkTexture)" transform="rotate(-35 680 430)" />
    <ellipse cx="770" cy="400" rx="12" ry="55" fill="url(#barkTexture)" transform="rotate(25 770 400)" />
    <ellipse cx="660" cy="360" rx="10" ry="45" fill="url(#barkTexture)" transform="rotate(-50 660 360)" />
    <ellipse cx="790" cy="330" rx="11" ry="50" fill="url(#barkTexture)" transform="rotate(45 790 330)" />
    {/* Smaller branches */}
    <ellipse cx="645" cy="300" rx="6" ry="28" fill="#8B4513" transform="rotate(-65 645 300)" />
    <ellipse cx="805" cy="280" rx="5" ry="22" fill="#8B4513" transform="rotate(60 805 280)" />
    <ellipse cx="690" cy="260" rx="7" ry="32" fill="#8B4513" transform="rotate(-25 690 260)" />
    <ellipse cx="760" cy="240" rx="6" ry="28" fill="#8B4513" transform="rotate(30 760 240)" />
    {/* Foliage clusters */}
    <circle cx="635" cy="290" r="28" fill="#228B22" />
    <circle cx="655" cy="275" r="32" fill="#32CD32" />
    <circle cx="670" cy="305" r="30" fill="#228B22" />
    <circle cx="810" cy="270" r="24" fill="#32CD32" />
    <circle cx="790" cy="255" r="27" fill="#228B22" />
    <circle cx="800" cy="290" r="22" fill="#32CD32" />
    <circle cx="685" cy="230" r="35" fill="#228B22" />
    <circle cx="705" cy="215" r="30" fill="#32CD32" />
    <circle cx="665" cy="210" r="28" fill="#228B22" />
    <circle cx="765" cy="210" r="28" fill="#32CD32" />
    <circle cx="785" cy="195" r="26" fill="#228B22" />
    <circle cx="745" cy="190" r="24" fill="#32CD32" />
    {/* Crown */}
    <circle cx="725" cy="160" r="50" fill="#228B22" />
    <circle cx="700" cy="135" r="38" fill="#32CD32" />
    <circle cx="750" cy="145" r="42" fill="#228B22" />
    <circle cx="725" cy="115" r="35" fill="#32CD32" />
    <circle cx="775" cy="125" r="30" fill="#228B22" />
    <circle cx="675" cy="120" r="32" fill="#32CD32" />
    {/* Roots */}
    <ellipse cx="690" cy="995" rx="10" ry="32" fill="#8B4513" transform="rotate(-25 690 995)" />
    <ellipse cx="760" cy="990" rx="12" ry="38" fill="#8B4513" transform="rotate(30 760 990)" />
    <ellipse cx="725" cy="1000" rx="15" ry="28" fill="#8B4513" />

    {/* Rope and banner */}
    <path d="M 130 200 Q 400 240 670 180" stroke="#8B4513" strokeWidth="10" fill="none" />
    <path d="M 130 200 Q 400 240 670 180" stroke="#A0522D" strokeWidth="6" fill="none" />
    <path d="M 130 200 Q 400 240 670 180" stroke="#D2691E" strokeWidth="2" fill="none" />

    <path d="M 200 230 Q 400 275 600 220 L 600 820 Q 400 870 200 820 Z" fill="#A52BDDFF" stroke="#654321" strokeWidth="2" opacity="0.7" />

    {/* Banner fabric with weave pattern at 0.7 opacity */}
    <path
      d="M 230 260 Q 400 295 570 250 L 570 790 Q 400 840 230 790 Z"
      fill="url(#weave)"
      opacity="0.7"
    />

    {/* Embroidered borders */}
    <rect x="230" y="260" width="30" height="530" fill="#DAA520" />
    {[...Array(10)].map((_, i) => (
      <circle key={`l-circle-${i}`} cx="245" cy={280 + i * 50} r="8" fill={i % 2 === 0 ? "#8B0000" : "#FFD700"} />
    ))}
    {[...Array(10)].map((_, i) => (
      <path key={`l-tri-${i}`} d={`M 235 ${275 + i * 50} L 255 ${275 + i * 50} L 245 ${295 + i * 50} Z`} fill={i % 2 === 0 ? "#FFD700" : "#8B0000"} />
    ))}

    <rect x="540" y="250" width="30" height="530" fill="#DAA520" />
    {[...Array(10)].map((_, i) => (
      <circle key={`r-circle-${i}`} cx="555" cy={270 + i * 50} r="8" fill={i % 2 === 0 ? "#8B0000" : "#FFD700"} />
    ))}
    {[...Array(10)].map((_, i) => (
      <path key={`r-tri-${i}`} d={`M 545 ${265 + i * 50} L 565 ${265 + i * 50} L 555 ${285 + i * 50} Z`} fill={i % 2 === 0 ? "#FFD700" : "#8B0000"} />
    ))}

    {/* Rope ties */}
    <rect x="180" y="220" width="12" height="40" fill="#937627FF" transform="rotate(15 186 240)" />
    <rect x="608" y="210" width="12" height="40" fill="#9E7E42FF" transform="rotate(-15 614 230)" />

    {/* Banner shadow */}
    <path d="M 210 810 Q 400 850 590 800 L 600 820 Q 400 870 200 820 Z" fill="#000000" opacity="0.25" />

    {/* Fabric wrinkles */}
    <path d="M 300 340 Q 400 355 510 340" stroke="#654321" strokeWidth="2" fill="none" opacity="0.3" />
    <path d="M 320 510 Q 400 525 480 510" stroke="#654321" strokeWidth="2" fill="none" opacity="0.3" />
    <path d="M 350 650 Q 400 665 450 650" stroke="#654321" strokeWidth="2" fill="none" opacity="0.3" />

    {/* Moss and small plants */}
    <ellipse cx="65" cy="920" rx="8" ry="4" fill="#228B22" opacity="0.6" />
    <ellipse cx="85" cy="930" rx="6" ry="3" fill="#32CD32" opacity="0.6" />
    <ellipse cx="715" cy="940" rx="10" ry="5" fill="#228B22" opacity="0.6" />
    <ellipse cx="735" cy="935" rx="7" ry="4" fill="#32CD32" opacity="0.6" />
  </svg>
);

export default MedievalSVG;