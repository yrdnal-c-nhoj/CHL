export const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;

/**
 * Normalizes a date string (e.g., "25-4-2" to "25-04-02")
 */
export const normalizeDate = (d: string): string =>
  d
    .split('-')
    .map((n) => n.padStart(2, '0'))
    .join('-');

/**
 * Formats a title for display (removes "clock" case-insensitively)
 */
export const formatTitle = (title?: string | null): string =>
  title?.replace(/clock/i, '').trim() || 'Home';

/**
 * Formats a date string for display with dots (e.g., "25.04.02")
 */
export const formatDateDots = (dateString?: string | null): string =>
  dateString ? dateString.replace(/-/g, '.') : '';

/**
 * Formats a date string for display with slashes (e.g., "04/02/25")
 */
export const formatDateSlashes = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31
    ? `${mm}/${dd}/${yy}`
    : 'Invalid Date';
};

/**
 * Parses a YY-MM-DD string into a timestamp for comparison
 */
export const parseDateVal = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return 0;
  const [yy, mm, dd] = parts.map(Number);
  return new Date(2000 + yy, mm - 1, dd).getTime();
};

/**
 * Gets today's date in YY-MM-DD format
 */
export const getTodayDate = (): string => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};