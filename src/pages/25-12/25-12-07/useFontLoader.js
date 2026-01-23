// useFontLoader.js
import { useEffect } from 'react'

export default function useFontLoader(fontName, fontFile, format = 'truetype') {
  useEffect(() => {
    // Inject @font-face
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontFile}') format('${format}');
        font-display: swap;
        font-weight: normal;
        font-style: normal;
      }
    `
    document.head.appendChild(style)

    // Optional: preload
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.href = fontFile
    link.type = format === 'woff2' ? 'font/woff2' : 'font/ttf'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(style)
      document.head.removeChild(link)
    }
  }, [fontName, fontFile, format])
}
