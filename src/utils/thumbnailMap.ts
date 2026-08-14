// Thumbnail mapping for clock pages
//
// This loader dynamically finds all clock images and maps them by date.
// It prioritizes images from the `/src/assets/thumbnails/` directory
// and falls back to the main `/src/assets/images/` directory.

// 1. Prioritize dedicated thumbnails
const dedicatedThumbnails = import.meta.glob('/src/assets/thumbnails/**/*.{webp,gif,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

const thumbnailCache = new Map<string, string>();

for (const path in dedicatedThumbnails) {
  const match = path.match(/(\d{2}-\d{2}-\d{2})/);
  if (match) {
    const date = match[1];
    if (!thumbnailCache.has(date)) {
      thumbnailCache.set(date, dedicatedThumbnails[path] as string);
    }
  }
}

// 2. Fill in missing thumbnails with fallback images
const fallbackImages = import.meta.glob('/src/assets/images/**/*.{webp,gif,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

for (const path in fallbackImages) {
  const match = path.match(/(\d{2}-\d{2}-\d{2})/);
  if (match) {
    const date = match[1];
    // Only add if a dedicated thumbnail wasn't already found
    if (!thumbnailCache.has(date)) {
      thumbnailCache.set(date, fallbackImages[path] as string);
    }
  }
}

export const getThumbnailByDate = (date: string): string => {
  return thumbnailCache.get(date) || '';
};
