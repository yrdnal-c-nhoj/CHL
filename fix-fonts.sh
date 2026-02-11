#!/bin/bash

# Fix all .woff2 imports to .ttf
find /Users/john/Desktop/CHL/src/pages -name "*.jsx" -exec sed -i '' 's/\.woff2?url/.ttf?url/g' {} \;

echo "Fixed all .woff2 imports to .ttf"
