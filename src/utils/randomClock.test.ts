import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRandomClockDate } from './randomClock';

const items = [{ date: '26-03-05' }, { date: '26-03-04' }];

describe('getRandomClockDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a different date when alternatives exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(getRandomClockDate(items, '26-03-05')).toBe('26-03-04');
  });

  it('returns the only available date', () => {
    expect(getRandomClockDate([{ date: '26-03-05' }], '26-03-05')).toBe(
      '26-03-05',
    );
  });

  it('returns null when there are no clocks', () => {
    expect(getRandomClockDate([])).toBeNull();
  });
});
