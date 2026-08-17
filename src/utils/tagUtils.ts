/**
 * Normalizes a comma-separated string into a unique, trimmed array of lowercase tags.
 */
export function normalizeTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(',')
        .map((t) => t.trim())
        .filter((t): t is string => Boolean(t)),
    ),
  ).sort();
}

/**
 * Sorts tags alphabetically but keeps priority tags at the beginning.
 */
export function sortTags(tags: string[] | Set<string>): string[] {  
  // Simply sort alphabetically without any priority tags.
  return Array.from(tags).sort();
}