#!/bin/bash

# Alternative deploy script using scp if you prefer over rsync
# Exit on any error
set -e

echo "🏗️ Building Astro site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📁 Deploying to codersinflow.com using scp..."
# First, clear the remote directory
ssh -p 12222 root@ny "rm -rf /var/www/codersinflow.com/*"

# Then copy all files
scp -P 12222 -r dist/* root@ny:/var/www/codersinflow.com/

echo "✅ Deployment complete!"
echo "🌐 Site deployed to codersinflow.com"