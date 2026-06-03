// Thumbnail mapping for clock pages
//
// For each clock date (format: YY-MM-DD), CHL shows a thumbnail image.
// Historically the app looked in `/src/assets/thumbnails/[date]-*.webp`.
//
// Your 2026/26-06 artwork lives in `/src/assets/images/26_images/26-06/[date]/*.webp|*.gif|*.jpg|*.png`.
// This loader maps date -> first matching file inside that folder.
//
// If a thumbnail can’t be found, Thumbnail will render its fallback UI.

// Build thumbnail mapping from the pre-generated thumbnails folder:
//   /src/assets/thumbnails/YY-MM-DD-thumb.webp
// (and possibly other extensions for the same naming convention)
type AnyModule = { default?: string };

const modules = import.meta.glob(
  '/src/assets/thumbnails/*-thumb.{webp,gif,jpg,jpeg,png}',
  { eager: true },
) as Record<string, AnyModule>;



const thumbnailMap: Record<string, string> = {};

for (const [filePath, mod] of Object.entries(modules)) {
  const imageUrl = (mod as AnyModule).default;
  if (!imageUrl) continue;

  // Example path:
  //   /src/assets/thumbnails/25-04-12-thumb.webp
  const fileName = filePath.split('/').pop() || '';
  const m = fileName.match(/^(\d{2}-\d{2}-\d{2})-thumb\./);
  const date = m?.[1];
  if (!date) continue;

  // Keep first discovered asset for the date.
  if (!thumbnailMap[date]) {
    thumbnailMap[date] = imageUrl;
  }
}


export const getThumbnailByDate = (date: string): string | null => {
  return thumbnailMap[date] || null;
};

export const getAvailableThumbnailDates = (): string[] => {
  return Object.keys(thumbnailMap);
};

