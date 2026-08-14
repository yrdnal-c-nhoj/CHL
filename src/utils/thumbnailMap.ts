// Thumbnail mapping for clock pages
//
// This loader dynamically finds all clock images and maps them by date.
// It looks for images in `/src/assets/images/YY_images/YY-MM/YY-MM-DD/`
// and also checks the legacy `/src/assets/thumbnails/` directory.

const allImages = import.meta.glob(
  '/src/assets/{images,thumbnails}/**/*.{webp,gif,jpg,jpeg,png}',
  {
    eager: true,
    import: 'default',
  },
);

const thumbnailCache = new Map<string, string>();

for (const path in allImages) {
  const match = path.match(/(\d{2}-\d{2}-\d{2})/);
  if (match) {
    const date = match[1];
    if (!thumbnailCache.has(date)) {
      thumbnailCache.set(date, allImages[path] as string);
    }
  }
}

export const getThumbnailByDate = (date: string): string => {
  return thumbnailCache.get(date) || '';
};
