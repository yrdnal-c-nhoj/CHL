// Dynamic thumbnail mapping for clock pages
// This file imports all thumbnail images and provides a lookup function

// Import all thumbnail images
const thumbnailModules = import.meta.glob('/src/assets/thumbnails/*.webp', { eager: true });

// Create a mapping from date to image URL
const thumbnailMap: Record<string, string> = {};

// Build the mapping by extracting date from filename
Object.entries(thumbnailModules).forEach(([path, module]) => {
  // Extract filename from path
  const filename = path.split('/').pop();
  if (filename) {
    // Extract date from filename (format: YY-MM-DD-title.webp)
    const dateMatch = filename.match(/^(\d{2}-\d{2}-\d{2})/);
    if (dateMatch) {
      const date = dateMatch[1];
      // Get the URL from the module (default export)
      const imageUrl = (module as { default: string }).default;
      if (imageUrl) {
        thumbnailMap[date] = imageUrl;
      }
    }
  }
});

/**
 * Get thumbnail image URL by date
 * @param date - Date in YY-MM-DD format
 * @returns Image URL or null if not found
 */
export const getThumbnailByDate = (date: string): string | null => {
  return thumbnailMap[date] || null;
};

/**
 * Get all available thumbnail dates
 * @returns Array of available dates
 */
export const getAvailableThumbnailDates = (): string[] => {
  return Object.keys(thumbnailMap);
};
