// Thumbnail mapping for clock pages
//
// For each clock date (format: YY-MM-DD), CHL shows a thumbnail image.
// Historically the app looked in `/src/assets/thumbnails/[date]-*.webp`.
//
// Your 2026/26-06 artwork lives in `/src/assets/images/26_images/26-06/[date]/*.webp|*.gif|*.jpg|*.png`.
// This loader maps date -> first matching file inside that folder.
//
// If a thumbnail can’t be found, Thumbnail will render its fallback UI.

import { normalizeDate } from './dateUtils';

// Build thumbnail mapping from the pre-generated thumbnails folder:
//   /src/assets/thumbnails/YY-MM-DD-thumb.webp
// (and possibly other extensions for the same naming convention)
type AnyModule = { default?: string };

const modules = import.meta.glob( // This function dynamically imports modules matching a pattern.
  '/src/assets/thumbnails/*.{webp,gif,jpg,jpeg,png}',
  { eager: true },
) as Record<string, AnyModule>;


const thumbnailMap: Record<string, string> = {};

for (const [filePath, mod] of Object.entries(modules)) {
  const imageUrl = (mod as AnyModule).default;
  if (!imageUrl) continue;
  
  // Matches date pattern with optional -thumb suffix (e.g., 26-06-01.webp or 26-6-1-thumb.jpg)
  const match = filePath.match(/\/src\/assets\/thumbnails\/(\d{1,2}-\d{1,2}-\d{1,2})(?:-thumb)?\./);
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
export const getThumbnailByDate = (date: string): string | undefined => {
  return thumbnailMap[date];
};

export { thumbnailMap };
