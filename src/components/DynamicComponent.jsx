import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '../utils/fontLoader';
import backgroundImage from '../assets/background.jpg';
import customFont from '../assets/fonts/custom-font.woff2?url';

export default function DynamicComponent() {
  const fontFamily = 'DynamicCustomFont';

  const fontConfigs = useMemo(
    () => [{ fontFamily, fontUrl: customFont }],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: `'${fontFamily}', sans-serif`,
      color: 'white',
      fontSize: '2rem',
      textAlign: 'center',
      padding: '1rem',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '2rem',
        borderRadius: '0.5rem',
        maxWidth: '90%',
        boxSizing: 'border-box'
      }}>
        <h1>Dynamic Component</h1>
        <p>This component uses dynamic viewport units and custom fonts</p>
      </div>
    </div>
  );
}
