# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email <cubistheart@gmail.com> with details
3. Allow reasonable time for assessment and fix before disclosure

You will receive acknowledgment within 48 hours and updates on the fix progress.

## Automated Security

- Weekly `npm audit` runs via GitHub Actions
- Automated PRs created for patchable vulnerabilities
@@ -47,15 +59,20 @@
import React, { useMemo } from 'react';
-import type { FontConfig } from '@/types/clock';
-import { useClockTime } from '@/utils/hooks';
+import { useClockTime, formatTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
+import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

// 1. Export assets for preloading
-import bgImage from '../../../assets/images/YY-MM/YY-MM-DD/bg.webp';
-export { bgImage };
+import bgImage from '@/assets/images/YYYY/YY-MM/YY-MM-DD/bg.webp';
+export const assets = [bgImage];

// 2. Font configuration
const fontConfigs: FontConfig[] = [
-  { fontFamily: 'MyFont', fontUrl: '/fonts/my-font.woff2' },
+  { 
+    fontFamily: 'MyFont', 
+    fontUrl: new URL('@/assets/fonts/YYYY/YY-MM-DD-font.woff2', import.meta.url).href 
+  },
];

// 3. Component
@@ -64,7 +81,7 @@
  useSuspenseFontLoader(fontConfigs);

  const formatted = useMemo(() => {
-    return time.toLocaleTimeString();
+    return formatTime(time, '24h');
  }, [time]);

  return (
@@ -107,10 +124,10 @@
### Complete Font Loading Example

```tsx
-import React, { Suspense } from 'react';
-import { useSuspenseFontLoader } from '@/utils/fontLoader';
-import type { FontConfig } from '@/types/clock';
-
const fontConfigs: FontConfig[] = [
  { 
    fontFamily: 'MyClockFont', 
@@ -118,6 +135,16 @@
    fontWeight: '400'
  },
];
+```
+
+## Best Practices
+
+1. **Asset Exports**: Always export an `assets` array containing images or videos. The `useClockPage` hook uses this to hide the loading overlay only when media is ready.
+2. **Video Handling**: For video backgrounds, use `muted`, `playsInline`, and `autoPlay`. Provide a `fallbackImg` in case of autoplay restrictions or network failure.
+3. **Animation Performance**: Use `will-change` on elements animated by `useSmoothClock` or CSS `@keyframes` to trigger GPU acceleration.
+4. **Responsive Sizing**: Use `vh`, `vw`, or `vmin` units for font sizes to ensure the clock fits perfectly on all screens without media query bloat.
+
+## Time Formatting Utilities
+
+Prefer `@/utils/clockUtils` over native `toLocaleTimeString` for consistent rendering across different browsers/locales.
- Strict Node.js 24.x LTS requirement for consistent cryptographic and ESM behavior
