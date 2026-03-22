import React, { useState, useEffect } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import busterImg from '../../../assets/images/26-02/26-02-05/buster.webp';
import hand1Img from '../../../assets/images/26-02/26-02-05/hand1.webp';
import hand2Img from '../../../assets/images/26-02/26-02-05/hand2.webp';

// Interface for hand style function parameters
interface HandStyleParams {
  height: number;
  width: number;
  image: string;
  angle: number;
  overlap?: number;
}

const Analog260205Clock: React.FC = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const time = useMillisecondClock();

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + minutes / 60) / 12) * 360;


  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    backgroundImage: `url(${busterImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 0,
    overflow: 'hidden',
    opacity: 1,
    transition: 'opacity 0.3s ease-in',
    visibility: 'visible',
  };

  const clockFaceStyle = {
    position: 'relative',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
  };
  
  const handStyle = ({ height, width, image, angle, overlap = 5 }: HandStyleParams) => {
    const skewAmount = Math.sin((angle * Math.PI) / 180) * 15; // Max 15px skew

    return {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: `${width}px`,
      height: `${height}px`,
      backgroundImage: `url(${image})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter:
        'saturate(1.2) contrast(1.8) brightness(1.2) drop-shadow(2px 2px 8px rgba(20, 35, 80, 0.87))',
      marginLeft: `-${width / 2}px`,

      transformOrigin: `center ${height - overlap}px`,
      transform: `rotate(${angle}deg) translateY(${overlap}px) skewY(${skewAmount}deg)`,
    };
  };

  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>
        <div style={handStyle({ height: 110, width: 40, image: hand1Img, angle: hourAngle })} />
        <div style={handStyle({ height: 200, width: 50, image: hand2Img, angle: minuteAngle })} />
      </div>
    </div>
  );
};

export default Analog260205Clock;
