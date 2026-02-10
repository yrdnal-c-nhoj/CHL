# Centralized Font Loading Utility

This document explains how to use the centralized font loading utility to reduce code duplication across clock components.

## Overview

The `fontLoader.js` utility provides:
- **Caching**: Prevents duplicate font loading
- **Error handling**: Graceful fallbacks and timeouts
- **React hooks**: Easy integration with components
- **Performance**: Parallel loading for multiple fonts

## Usage Examples

### Basic Usage

```jsx
import React from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import myFont from '../../../assets/fonts/my-font.ttf';

const MyComponent = () => {
  const fontLoaded = useFontLoader('MyFont', myFont);
  
  if (!fontLoaded) return <div>Loading...</div>;
  
  return <div style={{ fontFamily: 'MyFont' }}>Content</div>;
};
```

### Advanced Options

```jsx
const fontLoaded = useFontLoader('MyFont', myFont, {
  fallback: true,        // Set ready even if font fails (default: true)
  timeout: 3000         // Timeout in ms (default: 5000)
});
```

### Multiple Fonts

```jsx
import { useMultipleFontLoader } from '../../../utils/fontLoader';

const fonts = [
  { fontFamily: 'PrimaryFont', fontUrl: primaryFont },
  { fontFamily: 'SecondaryFont', fontUrl: secondaryFont }
];

const allFontsLoaded = useMultipleFontLoader(fonts);
```

### Non-React Usage

```jsx
import { loadFont } from '../../../utils/fontLoader';

// Load font manually
const fontReady = await loadFont('MyFont', myFont);
```

## Migration Guide

### Before (Manual Font Loading)

```jsx
const [fontLoaded, setFontLoaded] = useState(false);

useEffect(() => {
  const font = new FontFace('MyFont', `url(${myFont})`);
  font.load()
    .then(loaded => {
      document.fonts.add(loaded);
      setFontLoaded(true);
    })
    .catch(() => setFontLoaded(true));
}, []);
```

### After (Using Utility)

```jsx
const fontLoaded = useFontLoader('MyFont', myFont);
```

## Benefits

1. **Reduced Code Duplication**: Eliminates repetitive font loading patterns
2. **Better Error Handling**: Centralized timeout and error management
3. **Performance**: Caching prevents duplicate network requests
4. **Consistency**: Standardized loading behavior across components
5. **Maintainability**: Single place to update font loading logic

## File Structure

```
src/
├── utils/
│   └── fontLoader.js          # Centralized font loading utility
├── templates/
│   ├── AnalogClockTemplate.jsx   # Updated to use utility
│   └── DigitalClockTemplate.jsx # Updated to use utility
└── pages/
    └── [date]/[date]/Clock.jsx  # Individual clock components
```

## Implementation Status

✅ **Completed**:
- Template files (AnalogClockTemplate.jsx, DigitalClockTemplate.jsx)
- 52 clock components updated via batch script
- Manual fixes for complex patterns

🔄 **In Progress**:
- Remaining ~60 clock components need manual review
- Components with unique font loading patterns

📋 **Next Steps**:
1. Review remaining files with complex patterns
2. Update components using inline `<style>` font declarations
3. Test font loading across different browsers
4. Add font loading metrics/monitoring

## Common Patterns Found

1. **Standard FontFace Pattern**: Most common, easily automated
2. **Unique Font Names**: Some components generate unique font names
3. **Inline Style Declarations**: Components using `<style>` tags
4. **Multiple Font Loading**: Components loading multiple fonts
5. **Font + Image Loading**: Components loading fonts and images together

## Testing

To test the font loading utility:

```jsx
// Clear cache for testing
import { clearFontCache } from '../../../utils/fontLoader';
clearFontCache();

// Test loading
const fontLoaded = useFontLoader('TestFont', testFont);
console.log('Font loaded:', fontLoaded);
```
