/**
 * Normalizes a comma-separated string into a unique, trimmed array of lowercase tags.
 */
export function normalizeTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).sort();
}

/**
 * Sorts tags alphabetically but keeps priority tags at the beginning.
 */
export function sortTags(tags: string[] | Set<string>): string[] {
  const tagArray = Array.from(tags).sort();
  const priority = ['analog', 'digital'];
  const head = priority.filter((p) => tagArray.includes(p));
  const tail = tagArray.filter((s) => !priority.includes(s));
  return [...head, ...tail];
}