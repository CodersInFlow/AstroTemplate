#!/bin/bash

# Exit on any error
set -e

echo "🏗️ Building Astro site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📁 Deploying to codersinflow.com..."
# Use rsync for better handling of directories and deletions
# The trailing slash on dist/ is important - it copies contents, not the directory itself
rsync -avz --delete -e "ssh -p 12222" dist/ root@ny:/var/www/codersinflow.com/

echo "✅ Deployment complete!"
echo "🌐 Site deployed to codersinflow.com"