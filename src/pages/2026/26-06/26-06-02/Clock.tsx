// Forward everything to the canonical PascalCase file to avoid circular imports and case-collision errors
import CanonicalClock, { assets as CanonicalAssets } from './Clock';
export default CanonicalClock;
export const assets = CanonicalAssets;