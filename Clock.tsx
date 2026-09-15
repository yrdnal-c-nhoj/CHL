import React, { useEffect, useState } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

const Clock: React.FC = () => {
  const fontConfigs = [
    {
      fontFamily: '26-09-12',
      fontUrl: '/path/to/26-09-12.ttf',
    },
  ];

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    // Font loading configuration (memoized)
    const fontConfigs = [
      {
        fontFamily: '26-09-12',
        fontUrl: '/path/to/26-09-12.ttf',
      },
    ];

    // Load fonts with error handling
    const loadFonts = async () => {
      try {
        const fontFace = new FontFace('26-09-12', `url(${fontConfigs[0].fontUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);
      } catch (error) {
        console.error('Failed to load font:', error);
      }
    };

    loadFonts();
  }, []);

  return (
    <div style={{ fontFamily: '26-09-12' }}>
      {/* Your clock component content */}
    </div>
  );
};

export default Clock;
