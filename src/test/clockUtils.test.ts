import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useClockTime,
  formatTime,
  calculateAngles,
  generateTickMarks,
  isValidTime,
  timeStringToDate,
} from '../utils/clockUtils';

describe('useClockTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return current time', () => {
    const testTime = new Date('2024-01-15T10:30:00');
    vi.setSystemTime(testTime);

    const { result } = renderHook(() => useClockTime());

    expect(result.current.getTime()).toBe(testTime.getTime());
  });

  it('should update time every second', () => {
    const initialTime = new Date('2024-01-15T10:30:00');
    vi.setSystemTime(initialTime);

    const { result } = renderHook(() => useClockTime());

    expect(result.current.getTime()).toBe(initialTime.getTime());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.getTime()).toBe(initialTime.getTime() + 1000);
  });

  it('should cancel animation frame on unmount', () => {
    const cancelFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = renderHook(() => useClockTime());

    unmount();

    expect(cancelFrameSpy).toHaveBeenCalled();
    cancelFrameSpy.mockRestore();
  });
});

describe('formatTime', () => {
  it('should format time in 12h format by default', () => {
    const date = new Date('2024-01-15T14:30:45');
    const result = formatTime(date);

    expect(result).toEqual({
      hours: '02',
      minutes: '30',
      seconds: '45',
    });
  });

  it('should format time in 24h format', () => {
    const date = new Date('2024-01-15T14:30:45');
    const result = formatTime(date, '24h');

    expect(result).toEqual({
      hours: '14',
      minutes: '30',
      seconds: '45',
    });
  });

  it('should handle midnight in 12h format', () => {
    const date = new Date('2024-01-15T00:00:00');
    const result = formatTime(date, '12h');

    expect(result.hours).toBe('12');
  });

  it('should handle noon in 12h format', () => {
    const date = new Date('2024-01-15T12:00:00');
    const result = formatTime(date, '12h');

    expect(result.hours).toBe('12');
  });

  it('should pad single digits with zeros', () => {
    const date = new Date('2024-01-15T01:02:03');
    const result = formatTime(date);

    expect(result).toEqual({
      hours: '01',
      minutes: '02',
      seconds: '03',
    });
  });
});

describe('calculateAngles', () => {
  it('should calculate correct angles at 12:00:00', () => {
    const time = new Date('2024-01-15T12:00:00');
    const angles = calculateAngles(time);

    expect(angles.hour).toBe(0);
    expect(angles.minute).toBe(0);
    expect(angles.second).toBe(0);
  });

  it('should calculate correct angles at 3:00:00', () => {
    const time = new Date('2024-01-15T15:00:00');
    const angles = calculateAngles(time);

    expect(angles.hour).toBe(90);
    expect(angles.minute).toBe(0);
    expect(angles.second).toBe(0);
  });

  it('should calculate correct angles at 6:00:00', () => {
    const time = new Date('2024-01-15T18:00:00');
    const angles = calculateAngles(time);

    expect(angles.hour).toBe(180);
    expect(angles.minute).toBe(0);
    expect(angles.second).toBe(0);
  });

  it('should calculate correct angles at 9:00:00', () => {
    const time = new Date('2024-01-15T09:00:00');
    const angles = calculateAngles(time);

    expect(angles.hour).toBe(270);
    expect(angles.minute).toBe(0);
    expect(angles.second).toBe(0);
  });

  it('should calculate minute hand with seconds adjustment', () => {
    const time = new Date('2024-01-15T12:30:30');
    const angles = calculateAngles(time);

    expect(angles.minute).toBe(183); // 30 * 6 + 30 * 0.1 = 183
  });

  it('should calculate hour hand with minutes adjustment', () => {
    const time = new Date('2024-01-15T13:30:00');
    const angles = calculateAngles(time);

    expect(angles.hour).toBe(45); // 1 * 30 + 30 * 0.5 = 45
  });

  it('should calculate second hand correctly', () => {
    const time = new Date('2024-01-15T12:00:45');
    const angles = calculateAngles(time);

    expect(angles.second).toBe(270); // 45 * 6 = 270
  });
});

describe('generateTickMarks', () => {
  it('should generate 12 hour tick marks', () => {
    const tickMarks = generateTickMarks(100, 150, 150);
    const hourTicks = tickMarks.filter((t) => t.isHour);

    expect(hourTicks).toHaveLength(12);
  });

  it('should generate 48 minute tick marks', () => {
    const tickMarks = generateTickMarks(100, 150, 150);
    const minuteTicks = tickMarks.filter((t) => !t.isHour);

    expect(minuteTicks).toHaveLength(48); // 60 - 12 hour positions
  });

  it('should generate correct total number of ticks', () => {
    const tickMarks = generateTickMarks(100, 150, 150);

    expect(tickMarks).toHaveLength(60);
  });

  it('should have thicker hour ticks', () => {
    const tickMarks = generateTickMarks(100, 150, 150);
    const hourTick = tickMarks.find((t) => t.isHour);
    const minuteTick = tickMarks.find((t) => !t.isHour);

    expect(hourTick?.thickness).toBe(3);
    expect(minuteTick?.thickness).toBe(1);
  });

  it('should calculate correct coordinates for 12 oclock position', () => {
    const tickMarks = generateTickMarks(100, 150, 150);
    const twelveOClock = tickMarks[0]; // First tick should be at 12 oclock

    // At 12 o'clock, x should be centerX, y should be centerY - radius
    expect(twelveOClock.x2).toBeCloseTo(150, 0);
    expect(twelveOClock.y2).toBeCloseTo(50, 0);
  });

  it('should have shorter inner points for hour ticks', () => {
    const tickMarks = generateTickMarks(100, 150, 150);
    const hourTick = tickMarks.find((t) => t.isHour)!;

    // Hour ticks should be longer (difference between outer and inner should be 15)
    const hourLength = Math.sqrt(
      Math.pow(hourTick.x2 - hourTick.x1, 2) +
        Math.pow(hourTick.y2 - hourTick.y1, 2),
    );

    expect(hourLength).toBeCloseTo(15, 0);
  });

  it('should handle different radius values', () => {
    const tickMarks1 = generateTickMarks(50, 100, 100);
    const tickMarks2 = generateTickMarks(200, 100, 100);

    // The tick at 12 o'clock should scale with radius
    const twelveTick1 = tickMarks1.find(
      (t) => t.isHour && Math.abs(t.x2 - 100) < 1,
    )!;
    const twelveTick2 = tickMarks2.find(
      (t) => t.isHour && Math.abs(t.x2 - 100) < 1,
    )!;

    expect(twelveTick1.y2).toBeCloseTo(50, 0); // 100 - 50
    expect(twelveTick2.y2).toBeCloseTo(-100, 0); // 100 - 200
  });
});

describe('isValidTime', () => {
  it('should validate correct 24h time format', () => {
    expect(isValidTime('14:30')).toBe(true);
    expect(isValidTime('00:00')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
  });

  it('should validate correct 12h time format', () => {
    expect(isValidTime('2:30')).toBe(true);
    expect(isValidTime('12:00')).toBe(true);
  });

  it('should validate time with seconds', () => {
    expect(isValidTime('14:30:45')).toBe(true);
    expect(isValidTime('00:00:00')).toBe(true);
  });

  it('should reject invalid hours', () => {
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('25:30')).toBe(false);
  });

  it('should reject invalid minutes', () => {
    expect(isValidTime('12:60')).toBe(false);
    expect(isValidTime('14:99')).toBe(false);
  });

  it('should reject invalid formats', () => {
    expect(isValidTime('not-a-time')).toBe(false);
    expect(isValidTime('14')).toBe(false);
    expect(isValidTime('14:30:45:99')).toBe(false);
    expect(isValidTime('')).toBe(false);
  });
});

describe('timeStringToDate', () => {
  it('should convert HH:MM string to Date', () => {
    const result = timeStringToDate('14:30');

    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(0);
  });

  it('should handle midnight', () => {
    const result = timeStringToDate('00:00');

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it('should handle invalid input gracefully', () => {
    const result = timeStringToDate('invalid');

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it('should use current date as base', () => {
    const today = new Date();
    const result = timeStringToDate('10:30');

    expect(result.getFullYear()).toBe(today.getFullYear());
    expect(result.getMonth()).toBe(today.getMonth());
    expect(result.getDate()).toBe(today.getDate());
  });
});
