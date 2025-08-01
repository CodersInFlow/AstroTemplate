#!/bin/bash

# Production build script for Coders in Flow blog

set -e

echo "Building production site..."

# Build the Astro site with production environment
npm run build

# The built files will be in the 'dist' directory
echo "Build complete! Files are in the 'dist' directory"
echo ""
echo "To deploy:"
echo "1. Copy dist/* to /var/www/codersinflow.com/"
echo "2. Start the backend with: docker-compose -f docker-compose.prod.yml up -d"
echo "3. Add this line to your main nginx config:"
echo "   include /etc/nginx/includes/blog-locations.conf;"
echo ""
echo "Make sure to set these environment variables:"
echo "- JWT_SECRET (strong secret for production)"
echo "- MONGO_PASSWORD (strong password for MongoDB)"