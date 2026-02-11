#!/bin/bash

echo "Fixing all font imports..."

# Find all files with .woff2 imports and fix them
find /Users/john/Desktop/CHL/src/pages -name "*.jsx" -exec grep -l "\.woff2" {} \; | while read file; do
    echo "Processing: $file"
    
    # Get the base font name without extension
    font_names=$(grep -o '\.\./fonts/[^"]*' "$file" | sed 's/\.\/fonts\///g' | sed 's/"//g')
    
    for font_name in $font_names; do
        base_name=$(echo "$font_name" | sed 's/\.woff2//g')
        
        # Check if .otf exists
        if [ -f "/Users/john/Desktop/CHL/src/assets/fonts/${base_name}.otf" ]; then
            sed -i '' "s|${font_name}.woff2|${base_name}.otf|g" "$file"
        # Check if .ttf exists  
        elif [ -f "/Users/john/Desktop/CHL/src/assets/fonts/${base_name}.ttf" ]; then
            sed -i '' "s|${font_name}.woff2|${base_name}.ttf|g" "$file"
        else
            echo "  No matching font found for ${base_name}"
        fi
    done
done

echo "Font import fixes complete!"
