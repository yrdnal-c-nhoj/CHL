import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/background.jpg';

// Generate a random 5-letter string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 7);
};\n
export default function DynamicComponent() {
  const [fontReady, setFontReady] = useState(false);
  const fontFamily = `CustomFont_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${generateRandomString()}`;
  const fontFile = new URL('../assets/fonts/custom-font.woff2', import.meta.url).href;

  useEffect(() => {
    // Create and inject @font-face
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontFile}') format('woff2');
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    // Wait for font to load
    const loadFont = async () => {
      try {
        await document.fonts.load(`1rem "${fontFamily}"`);
        setFontReady(true);
      } catch (error) {
        console.error('Error loading font:', error);
        setFontReady(true); // Continue rendering even if font fails
      }
    };

    loadFont();

    return () => {
      document.head.removeChild(style);
    };
  }, [fontFamily, fontFile]);

  if (!fontReady) {
    return null; // Prevent FOUT
  }

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
