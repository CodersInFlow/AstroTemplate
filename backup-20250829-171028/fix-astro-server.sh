#!/bin/bash
# Script to fix Astro server lockup issues

echo "Fixing Astro server configuration..."

# 1. Ensure happy-dom is installed (required for SSR)
echo "Installing happy-dom..."
npm install happy-dom --save

# 2. Build with the new configuration
echo "Rebuilding with optimized configuration..."
npm run build

echo "Configuration updated. Key changes:"
echo "✅ Installed happy-dom for SSR support"
echo "✅ Added memory limits and timeouts to prevent lockups"
echo "✅ Configured proper SSR optimization"
echo ""
echo "To deploy these changes, run: ./deploy.sh update"