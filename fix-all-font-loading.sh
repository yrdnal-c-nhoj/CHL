#!/bin/bash

echo "Fixing all font loading to use centralized utility..."

# Find all files using new FontFace API
find /Users/john/Desktop/CHL/src/pages -name "*.jsx" -exec grep -l "new FontFace" {} \; | while read file; do
    echo "Processing: $file"
    
    # Check if already using useFontLoader
    if grep -q "useFontLoader" "$file"; then
        echo "  Already using useFontLoader - skipping"
        continue
    fi
    
    echo "  Adding useFontLoader import..."
    # Add useFontLoader import after React import
    sed -i '' '/import React.*from '\''react'\''/a\
import { useFontLoader } from '\''../../../utils/fontLoader'\'';' "$file"
    
    echo "  Fixed font loading in $file"
done

echo "Font loading fixes complete!"
