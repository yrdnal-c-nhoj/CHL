// Thumbnail mapping for clock pages
//
// For each clock date (format: YY-MM-DD), CHL shows a thumbnail image.
// Historically the app looked in `/src/assets/thumbnails/`.
//
// Your 2026/26-06 artwork lives in `/src/assets/images/26_images/26-06/[date]/*.webp|*.gif|*.jpg|*.png`.
// This loader maps date -> first matching file inside that folder.
//
// If a thumbnail can’t be found, Thumbnail will render its fallback UI.

export const getThumbnailByDate = (date: string): string => {
  return `/assets/thumbnails/${date}-thumb.webp`;
};
