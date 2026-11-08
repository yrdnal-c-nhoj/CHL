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
 * Validates a date string in YY-MM-DD format
 */
export const isValidDate = (str: string | undefined): boolean => {
  if (!str || !DATE_REGEX.test(str)) return false;
  const parts = str.split('-');
  const yy = Number(parts[0]);
  const mm = Number(parts[1]);
  const dd = Number(parts[2]);
  if (Number.isNaN(yy) || Number.isNaN(mm) || Number.isNaN(dd)) return false;
  // Assumes 20xx
  const date = new Date(2000 + yy, mm - 1, dd);
  return !isNaN(date.getTime());
};

/**
 * Formats a title for display (removes "clock" case-insensitively)
 */
export const formatTitle = (title?: string | null): string =>
  title?.replace(/clock/i, '').trim() || 'Home';

/**
 * Formats a date string for display as "Day Month 'Year" (e.g., "15 APR '25")
 */
export const formatDateDots = (dateString?: string | null): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [yy, mm, dd] = parts.map(Number);

  if (yy === undefined || mm === undefined || dd === undefined)
    return 'Invalid Date';

  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
    const month = monthNames[mm - 1];
    return `${dd} ${month} '${yy}`;
  }
  return 'Invalid Date';
};

/**
 * Standard date format used across the list and home views
 */
export const formatDateStandard = (dateString?: string | null): string => {
  return formatDateDots(dateString);
};

/**
 * Formats a date string for display with slashes (e.g., "04/02/25")
 */
export const formatDateSlashes = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);

  if (yy === undefined || mm === undefined || dd === undefined)
    return 'Invalid Date';

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

  if (yy === undefined || mm === undefined || dd === undefined) return 0;

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
