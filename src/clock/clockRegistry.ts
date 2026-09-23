import type { ComponentType } from 'react';

export interface ClockModule {
  default: ComponentType;
  assets?: unknown;
}

const CLOCK_MODULES = import.meta.glob(
  '../pages/**/Clock.tsx',
) as Record<string, () => Promise<ClockModule>>;

function getDateFromPath(path: string): string | null {
  const match = path.match(/\/(\d{2}-\d{2}-\d{2})\/Clock\.tsx$/i);
  return match?.[1] ?? null;
}

/**
 * The filesystem is the authoritative registry of available clocks.
 *
 * A date exists here only when a corresponding Clock.tsx exists. Metadata
 * such as title and tags is maintained separately in clockpages.json.
 */
export const CLOCK_LOOKUP: Record<
  string,
  () => Promise<ClockModule>
> = Object.entries(CLOCK_MODULES).reduce(
  (lookup, [path, importFn]) => {
    const date = getDateFromPath(path);
    if (date) lookup[date] = importFn;
    return lookup;
  },
  {} as Record<string, () => Promise<ClockModule>>,
);

export const CLOCK_DATES = Object.keys(CLOCK_LOOKUP).sort();

export function getClockImport(
  date: string,
): (() => Promise<ClockModule>) | undefined {
  return CLOCK_LOOKUP[date];
}
export function getLatestClockDate(
  throughDate?: string,
): string | null {
  const eligibleDates = throughDate
    ? CLOCK_DATES.filter((date) => date <= throughDate)
    : CLOCK_DATES;

  return eligibleDates[eligibleDates.length - 1] ?? null;
}