#!/bin/bash

# Deployment script
# Run after 'npm run build' to prepare files for deployment

echo "Preparing files for deployment..."

# Build the Astro site first (if not already built)
if [ ! -d "dist" ]; then
    echo "Building Astro site..."
    npm run build
fi

# Create directories if they don't exist
mkdir -p dist/api
mkdir -p dist/downloads

# Copy PHP files
echo "Copying PHP files..."
cp -r public/api/*.php dist/api/

# Copy downloads directory (including README)
echo "Copying downloads directory..."
cp -r public/downloads/* dist/downloads/ 2>/dev/null || true

echo ""
echo "Deployment preparation complete!"
echo ""
echo "To deploy to your server:"
echo "1. Upload all files from the 'dist' directory to /var/www/codersinflow.com/"
echo "2. Upload your .vsix files to /var/www/codersinflow.com/downloads/"
echo "3. Apply the nginx configuration from nginx.conf"
echo "4. Reload nginx: sudo nginx -s reload"