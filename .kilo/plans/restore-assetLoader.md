# Plan: Restore empty assetLoader.ts to fix missing preloadAssets export

## Root cause
`src/utils/assetLoader.ts` is empty (0 functional lines). It was wiped out but `src/hooks/useClockPage.ts` still imports from it:
- `import { preloadAssets } from '../utils/assetLoader'`
- `import type { AssetConfig } from '../utils/assetLoader'`

This causes the browser runtime error: "does not provide an export named 'preloadAssets'".

## Fix
Restore `src/utils/assetLoader.ts` from git commit `ba90f9184` (last known good version, 625 lines). The file contains:
- `export interface AssetConfig`
- `export function preloadAssets(assets: AssetConfig[]): Promise<void[]>`
- Helper hooks: `useImageLoader`, `useVideoLoader`, `useAudioLoader`
- Private preload functions: `preloadImage`, `preloadVideo`, `preloadAudio`, `preloadFont`
- Utility functions: `createAssetConfigs`, `isAssetLoaded`

## Validation
- `npm run build` completes
- Navigate to any clock page in browser; confirm no "preloadAssets" module error in console
- Confirm clocks render and assets load
