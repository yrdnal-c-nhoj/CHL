// Thumbnail mapping for clock pages
//
// For each clock date (format: YY-MM-DD), CHL shows a thumbnail image.
// Historically the app looked in `/src/assets/thumbnails/[date]-*.webp`.
//
// Your 2026/26-06 artwork lives in `/src/assets/images/26_images/26-06/[date]/*.webp|*.gif|*.jpg|*.png`.
// This loader maps date -> first matching file inside that folder.
//
// If a thumbnail can’t be found, Thumbnail will render its fallback UI.

// Import all image assets for thumbnails from the per-date folders.
// We keep it broad to support mixed extensions (.webp, .gif, .jpg, .png).
const modules = import.meta.glob(
  '/src/assets/images/26_images/26-*/**/*.{webp,gif,jpg,jpeg,png}',
  { eager: true },
);

type AnyModule = { default?: string };

const thumbnailMap: Record<string, string> = {};

for (const [filePath, mod] of Object.entries(modules)) {
  const fileName = filePath.split('/').pop() || '';

  // Extract the date prefix from filenames, e.g. `26-06-02/1.webp` doesn’t contain the date.
  // Instead, extract the folder name that matches `26-06-02`.
  // We expect .../26-06/26-06-02/<file>
  // Extract the date prefix from paths; we expect .../26-06/26-06-02/<file>
  const parts = filePath.split('/');
  let date: string | null = null;
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const p = parts[i];
    if (/^\d{2}-\d{2}-\d{2}$/.test(p)) {
      date = p;
      break;
    }
  }


  if (!date) continue;

  const imageUrl = (mod as AnyModule).default;
  if (!imageUrl) continue;

  // Keep the first discovered image for the date.
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

