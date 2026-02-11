#!/bin/bash

# Script to update all font imports from .ttf/.otf to .woff2

echo "🔄 Updating font imports to use WOFF2..."
echo ""

UPDATED_COUNT=0

# Find all JSX files that import fonts
find src -name "*.jsx" -type f | while read -r file; do
  # Check if file has font imports
  if grep -q "from.*\.\(ttf\|otf\)" "$file"; then
    echo "📝 Updating: $file"
    
    # Replace .ttf with .woff2 in import statements
    perl -i -pe 's/from\s+(["\x27])(.+?)\.ttf(["\x27])/from $1$2.woff2$3/g' "$file"
    
    # Replace .otf with .woff2 in import statements
    perl -i -pe 's/from\s+(["\x27])(.+?)\.otf(["\x27])/from $1$2.woff2$3/g' "$file"
    
    ((UPDATED_COUNT++))
  fi
done

echo ""
echo "✅ Updated $UPDATED_COUNT files"
echo ""
echo "Next: Update @font-face declarations in CSS/style tags"
