#!/bin/bash

# Build Tailwind CSS for each site separately
set -e

echo "🎨 Building Site-Specific Styles"
echo "================================"

# Build styles for each site
for site_dir in astro-multi-tenant/src/sites/*/; do
  if [ -d "$site_dir" ]; then
    site=$(basename "$site_dir")
    echo "Building styles for $site..."
    
    if [ -f "$site_dir/tailwind.config.js" ] && [ -f "$site_dir/styles/global.css" ]; then
      # Build Tailwind CSS for this site
      npx tailwindcss -c "$site_dir/tailwind.config.js" \
        -i "$site_dir/styles/global.css" \
        -o "public/styles/$site.css" \
        --minify
      echo "✅ Built styles for $site"
    fi
  fi
done

echo ""
echo "✅ All site styles built!"