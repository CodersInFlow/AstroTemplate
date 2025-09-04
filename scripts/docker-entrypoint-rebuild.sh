#!/bin/bash
# Docker entrypoint that rebuilds everything when container starts
set -e

echo "🔄 Container starting with full rebuild capability"
echo "=================================================="

# Check if we have the full project mounted
if [ -f "/app/package.json" ] && [ -d "/app/astro-multi-tenant" ] && [ -d "/app/backend" ]; then
    echo "✅ Full project detected at /app"
    
    # Build frontend
    echo ""
    echo "📦 Building frontend..."
    cd /app/astro-multi-tenant
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "  📦 Installing frontend dependencies..."
        npm ci
    fi
    
    # Build Astro (CSS should already be generated and synced)
    echo "  🏗️  Building Astro..."
    npm run build || npx astro build
    
    # Build backend
    echo ""
    echo "📦 Building backend..."
    cd /app/backend
    
    # Download dependencies if needed
    if [ ! -d "vendor" ]; then
        echo "  📦 Downloading Go dependencies..."
        go mod download
    fi
    
    echo "  🏗️  Building Go server..."
    go build -o server cmd/server/main.go
    chmod +x server
    
    echo ""
    echo "✅ Rebuild complete!"
    
    # Update working directory for supervisor
    cd /app
    
    # Copy files to expected locations for supervisor
    cp /app/backend/server /app/server 2>/dev/null || true
    ln -sf /app/astro-multi-tenant/dist /app/dist 2>/dev/null || true
    
else
    echo "⚠️  Full project not mounted, using pre-built files"
    cd /app
fi

echo ""
echo "🚀 Starting services..."

# Start supervisor
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf