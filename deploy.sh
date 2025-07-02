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

echo "📦 Preparing PHP files and directories..."
# Create necessary directories in dist
mkdir -p dist/api
mkdir -p dist/downloads

# Copy PHP files to dist
echo "  - Copying PHP API files..."
cp -r public/api/*.php dist/api/

# Copy downloads directory structure (but not the vsix files)
echo "  - Copying downloads directory structure..."
cp public/downloads/README.md dist/downloads/ 2>/dev/null || true

echo "📁 Deploying to codersinflow.com..."
# Use rsync for better handling of directories and deletions
# The trailing slash on dist/ is important - it copies contents, not the directory itself
rsync -avz --delete -e "ssh -p 12222" dist/ root@ny:/var/www/codersinflow.com/

echo "📂 Creating downloads directory on server if it doesn't exist..."
ssh -p 12222 root@ny "mkdir -p /var/www/codersinflow.com/downloads"

echo "🔧 Updating nginx configuration..."
# Copy nginx config to server
scp -P 12222 nginx.conf root@ny:/tmp/codersinflow.com.nginx

# Backup existing config, copy new one, and reload nginx
ssh -p 12222 root@ny "
    # Create backup directory if it doesn't exist
    mkdir -p /etc/nginx/backups
    
    # Backup existing config
    if [ -f /etc/nginx/sites-enabled/codersinflow.com ]; then
        cp /etc/nginx/sites-enabled/codersinflow.com /etc/nginx/backups/codersinflow.com.backup.\$(date +%Y%m%d_%H%M%S)
        echo '  - Backed up existing nginx config to /etc/nginx/backups/'
    fi
    
    # Copy new config
    cp /tmp/codersinflow.com.nginx /etc/nginx/sites-enabled/codersinflow.com
    echo '  - Updated nginx config'
    
    # Test nginx config
    nginx -t
    if [ \$? -eq 0 ]; then
        echo '  - Nginx config test passed'
        # Reload nginx
        systemctl reload nginx
        echo '  - Nginx reloaded successfully'
    else
        echo '❌ Nginx config test failed! Rolling back...'
        # Find the most recent backup and restore it
        LATEST_BACKUP=\$(ls -t /etc/nginx/backups/codersinflow.com.backup.* 2>/dev/null | head -n1)
        if [ -f "\$LATEST_BACKUP" ]; then
            cp "\$LATEST_BACKUP" /etc/nginx/sites-enabled/codersinflow.com
            echo '  - Restored from backup: '\$LATEST_BACKUP
        fi
        exit 1
    fi
    
    # Clean up temp file
    rm /tmp/codersinflow.com.nginx
"

# echo "📦 Uploading VSIX files..."
# # First, delete all existing VSIX files on the server
# echo "  - Cleaning existing VSIX files on server..."
# ssh -p 12222 root@ny "rm -f /var/www/codersinflow.com/downloads/*.vsix"
# 
# # Check if there are any VSIX files in ~/Source/codersinflow/
# if ls ~/Source/codersinflow/*.vsix 1> /dev/null 2>&1; then
#     echo "  - Found VSIX files in ~/Source/codersinflow/"
#     scp -P 12222 ~/Source/codersinflow/*.vsix root@ny:/var/www/codersinflow.com/downloads/
#     echo "  - VSIX files uploaded successfully"
#     
#     # List uploaded files
#     echo "  - Uploaded files:"
#     for file in ~/Source/codersinflow/*.vsix; do
#         if [ -f "$file" ]; then
#             echo "    • $(basename "$file")"
#         fi
#     done
# else
#     echo "  - No VSIX files found in ~/Source/codersinflow/"
#     echo "  - To upload manually: scp -P 12222 ~/Source/codersinflow/*.vsix root@ny:/var/www/codersinflow.com/downloads/"
# fi

echo "✅ Deployment complete!"
echo "🌐 Site deployed to codersinflow.com"
echo ""
echo "📌 The download page now directs users to the VS Code Marketplace"
echo ""
echo "🧪 Test URLs:"
echo "   https://codersinflow.com/api/test.php - Check PHP is working"
echo "   https://codersinflow.com/download - The download page"