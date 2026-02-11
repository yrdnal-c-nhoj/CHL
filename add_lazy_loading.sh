#!/bin/bash

# Script to add loading="lazy" and decoding="async" to all img tags
# that don't already have these attributes

echo "Adding lazy loading to images..."

# Find all .jsx files with <img tags
find src -name "*.jsx" -type f | while read -r file; do
  # Skip if file already has loading="lazy" in all img tags
  if grep -q '<img' "$file"; then
    # Use perl to add attributes only to img tags that don't have them
    perl -i -pe '
      # Add loading="lazy" if not present
      s/<img(?![^>]*loading=)/<img loading="lazy"/g;
      # Add decoding="async" if not present  
      s/<img(?![^>]*decoding=)/<img decoding="async"/g;
    ' "$file"
    echo "✓ $file"
  fi
done

echo ""
echo "Done! Added lazy loading to all images."
echo ""
echo "Files updated:"
find src -name "*.jsx" -type f -exec grep -l 'loading="lazy"' {} \; | wc -l
