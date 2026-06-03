// Redirect to canonical PascalCase file to resolve case-sensitivity collisions
import Clock, { assets as ClockAssets } from './Clock';
export default Clock;
export const assets = ClockAssets;
// Forward everything to the canonical PascalCase file to avoid circular imports and case-collision errors
import CanonicalClock, { assets as CanonicalAssets } from './Clock';
export default CanonicalClock;
export const assets = CanonicalAssets;