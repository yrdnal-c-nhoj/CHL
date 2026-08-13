/**
 * ⚠️ DEPRECATED - Enhanced Font Loader
 *
 * This module exists for backward compatibility with existing clock pages.
 * All new development should use the canonical font loading approach:
 *
 *   - Import `useSuspenseFontLoader` from '@/utils/fontLoader'
 *   - Import `ClockLoadingFallback` from '@/utils/fontLoader'
 *
 * DO NOT use `useGlobalStyles` or `useKeyframes` in new clocks —
 * use CSS Modules (@/styles/*.module.css) instead.
 */

import { useEffect, useMemo, useState } from 'react';

// Internal implementation only.
// Deprecated exports removed; callers should use '@/utils/fontLoader'.
