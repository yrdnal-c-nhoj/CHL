/**
 * Templates Index
 * 
 * Central export for all clock templates.
 * 
 * Templates:
 * - BaseClock: Standardized architecture (recommended starting point)
 * - MasterTemplate: Legacy template with useClock hook
 * - ClockTemplate: JS template with inline useClock
 * - AnalogClockTemplate: Analog clock with SVG/rotations
 * - DigitalClockTemplate: Digital display template
 * - WordClockTemplate: Word-based time display
 */

export { default as BaseClock } from './BaseClock';
export { default as MasterTemplate } from './MasterTemplate';
export { default as ClockTemplate } from './ClockTemplate';
export { default as AnalogClockTemplate } from './AnalogClockTemplate';
export { default as DigitalClockTemplate } from './DigitalClockTemplate';
export { default as WordClockTemplate } from './WordClockTemplate';
