#!/bin/bash

# Generate CSS for all sites before starting dev server
echo "🎨 Generating CSS for all sites..."

# Dynamically find all sites by looking for directories with tailwind.config.cjs
SITES_DIR="src/sites"
INPUT_CSS="@tailwind base; @tailwind components; @tailwind utilities;"

# Create temp input file
echo "$INPUT_CSS" > /tmp/tailwind-input.css

# Create styles directory if it doesn't exist
mkdir -p src/styles/sites

# Find all sites that have a tailwind.config.cjs file
SITE_COUNT=0
for SITE_PATH in "$SITES_DIR"/*; do
  if [ -d "$SITE_PATH" ] && [ -f "$SITE_PATH/tailwind.config.cjs" ]; then
    SITE=$(basename "$SITE_PATH")
    SITE_NAME="${SITE%%.*}"
    
    # Skip the 'default' site if it exists
    if [ "$SITE_NAME" = "default" ]; then
      continue
    fi
    
    echo "  → Generating CSS for $SITE_NAME..."
    
    # Generate CSS using site's Tailwind config
    npx tailwindcss \
      -c "$SITE_PATH/tailwind.config.cjs" \
      -i /tmp/tailwind-input.css \
      -o "src/styles/sites/$SITE_NAME.css" \
      --minify
      
    echo "  ✓ Generated src/styles/sites/$SITE_NAME.css"
    ((SITE_COUNT++))
  fi
done

# Clean up
rm /tmp/tailwind-input.css

if [ $SITE_COUNT -eq 0 ]; then
  echo "⚠️  No sites with tailwind.config.cjs found!"
  exit 1
else
  echo "✅ Generated CSS for $SITE_COUNT site(s) successfully!"
fi