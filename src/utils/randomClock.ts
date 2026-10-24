import type { ClockItem } from '@/types/data';

export function getRandomClockDate(
  items: Pick<ClockItem, 'date'>[],
  currentDate?: string,
): string | null {
  if (items.length === 0) return null;

  const otherItems = currentDate
    ? items.filter((item) => item.date !== currentDate)
    : items;
  const candidates = otherItems.length > 0 ? otherItems : items;
  const randomIndex = Math.floor(Math.random() * candidates.length);

  return candidates[randomIndex]?.date ?? null;
}
