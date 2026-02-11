#!/bin/bash

# Comprehensive script to update all fonts to WOFF2

echo "🔄 Updating fonts to WOFF2 format..."
echo ""

IMPORT_COUNT=0
FORMAT_COUNT=0

# Find all JSX files
find src -name "*.jsx" -type f | while read -r file; do
  UPDATED=false
  
  # Check and update imports
  if grep -q "\.ttf?url\|\.otf?url" "$file"; then
    # Replace .ttf?url with .woff2?url
    perl -i -pe 's/\.ttf\?url/.woff2?url/g' "$file"
    # Replace .otf?url with .woff2?url  
    perl -i -pe 's/\.otf\?url/.woff2?url/g' "$file"
    ((IMPORT_COUNT++))
    UPDATED=true
  fi
  
  # Check and update format declarations
  if grep -q "format('truetype')\|format('opentype')\|format(\"truetype\")\|format(\"opentype\")" "$file"; then
    # Replace format declarations
    perl -i -pe "s/format\(['\"]truetype['\"]\)/format('woff2')/g" "$file"
    perl -i -pe "s/format\(['\"]opentype['\"]\)/format('woff2')/g" "$file"
    ((FORMAT_COUNT++))
    UPDATED=true
  fi
  
  if [ "$UPDATED" = true ]; then
    echo "✅ $file"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Update complete!"
echo "Files with updated imports: $IMPORT_COUNT"
echo "Files with updated formats: $FORMAT_COUNT"
echo ""
