#!/bin/bash

# Script to convert all TTF and OTF fonts to WOFF2 format
# This will reduce font file sizes by 70-80%

set -e

FONT_DIR="src/assets/fonts"
CONVERTED_COUNT=0
SKIPPED_COUNT=0

echo "🔤 Converting fonts to WOFF2 format..."
echo "This will take a few minutes for 260 fonts..."
echo ""

# Find all TTF and OTF files
find "$FONT_DIR" -type f \( -name "*.ttf" -o -name "*.otf" \) | while read -r font_file; do
  # Get directory and filename without extension
  font_dir=$(dirname "$font_file")
  font_name=$(basename "$font_file" | sed 's/\.[^.]*$//')
  font_ext="${font_file##*.}"
  
  woff2_file="$font_dir/$font_name.woff2"
  
  # Skip if WOFF2 already exists
  if [ -f "$woff2_file" ]; then
    echo "⏭️  Skipping (already exists): $font_name.woff2"
    ((SKIPPED_COUNT++))
    continue
  fi
  
  # Convert to WOFF2
  echo "🔄 Converting: $font_name.$font_ext → $font_name.woff2"
  
  if pyftsubset "$font_file" \
    --output-file="$woff2_file" \
    --flavor=woff2 \
    --layout-features='*' \
    --no-hinting \
    --desubroutinize \
    2>/dev/null; then
    
    # Show size reduction
    old_size=$(du -h "$font_file" | cut -f1)
    new_size=$(du -h "$woff2_file" | cut -f1)
    echo "✅ $font_name: $old_size → $new_size"
    ((CONVERTED_COUNT++))
  else
    echo "❌ Failed to convert: $font_name.$font_ext"
  fi
  
  echo ""
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Conversion complete!"
echo "Converted: $CONVERTED_COUNT fonts"
echo "Skipped: $SKIPPED_COUNT fonts"
echo ""
echo "Next steps:"
echo "1. Update font imports to use .woff2 files"
echo "2. Optionally delete old .ttf/.otf files"
echo "3. Rebuild the project"
