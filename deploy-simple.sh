#!/bin/bash

# Simple deploy script using rsync
# Exit on any error
set -e

echo "🏗️ Building Astro site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📁 Deploying to codersinflow.com using rsync..."
# Use rsync for efficient transfer
# --delete removes files on server that don't exist locally
# -avz: archive mode, verbose, compress
rsync -avz --delete -e "ssh -p 12222" dist/ root@ny:/var/www/codersinflow.com/

echo "🔄 Reloading nginx to ensure fresh cache..."
ssh -p 12222 root@ny "systemctl reload nginx"

echo "✅ Deployment complete!"
echo "🌐 Site deployed to codersinflow.com"