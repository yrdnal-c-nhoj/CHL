// Thumbnail mapping for clock pages
//
// For each clock date (format: YY-MM-DD), CHL shows a thumbnail image.
// Historically the app looked in `/src/assets/thumbnails/`.
//
// Your 2026/26-06 artwork lives in `/src/assets/images/26_images/26-06/[date]/*.webp|*.gif|*.jpg|*.png`.
// This loader maps date -> first matching file inside that folder.
//
// If a thumbnail can’t be found, Thumbnail will render its fallback UI.

import { normalizeDate } from './dateUtils';

type ImageModule = { default: string };

const allModules = import.meta.glob(
  [
    '/src/assets/thumbnails/*.{webp,gif,jpg,jpeg,png}',
    '/src/assets/images/26_images/26-06/**/*.{webp,gif,jpg,jpeg,png}',
  ],
  { eager: true },
) as Record<string, ImageModule>;

const thumbnailMap: Record<string, string> = {};

for (const [filePath, mod] of Object.entries(allModules)) {
  const imageUrl = mod.default;
  if (!imageUrl) continue;

  // Matches YY-MM-DD in the path.
  const match = filePath.match(/(\d{2}-\d{2}-\d{2})/);
  if (!match || !match[1]) continue;

  const date = normalizeDate(match[1]);

  // Keep first discovered asset for the date.
  if (!thumbnailMap[date]) {
    thumbnailMap[date] = imageUrl;
  }
}

/**
 * Returns the thumbnail URL for a given date (YY-MM-DD).
 */
export const getThumbnailByDate = (date: string): string | undefined => thumbnailMap[date];

export { thumbnailMap };
