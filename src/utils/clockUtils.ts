/**
 * clockUtils.ts
 *
 * Provides utility functions for consistent time formatting across clock components.
 * This centralizes logic and ensures adherence to the BorrowedTime Standard (BTS).
 */

/**
 * Pads a number with a leading zero if it's a single digit.
 * @param num The number to pad.
 * @returns The padded string.
 */
const pad = (num: number): string => num.toString().padStart(2, '0');

/**
 * Formats a Date object into a string based on the specified format.
 * @param date The Date object to format.
 * @param format The desired output format ('24h', '12h', '12h-stylized').
 * @returns The formatted time string.
 */
export const formatTime = (date: Date, format: '24h' | '12h' | '12h-stylized' = '24h'): string => {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  switch (format) {
    case '24h':
      return `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
    case '12h':
      const hours12 = hours24 % 12 || 12;
      const ampm = hours24 >= 12 ? 'PM' : 'AM';
      return `${hours12}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    case '12h-stylized':
      let stylizedHours = date.getHours();
      const stylizedMinutes = date.getMinutes();
      const stylizedAmpm = stylizedHours >= 12 ? 'pm' : 'am';
      stylizedHours = stylizedHours % 12 || 12;
      return `${stylizedHours}${stylizedMinutes.toString().padStart(2, '0')} ${stylizedAmpm}`.split('').join(' ');
    default:
      return date.toLocaleTimeString(); // Fallback for unknown formats
  }
};