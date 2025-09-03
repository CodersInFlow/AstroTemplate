#!/bin/bash

# Docker entrypoint that syncs internal data to external mounts if they're empty
set -e

echo "🔄 Checking external mounts and syncing if needed..."

# Check and sync dist folder
if [ -z "$(ls -A /app/dist 2>/dev/null)" ]; then
    echo "  📦 External dist mount is empty, copying from image..."
    if [ -d /app/dist-internal ]; then
        cp -r /app/dist-internal/* /app/dist/
        echo "  ✅ Dist files copied to external mount"
    fi
else
    echo "  ✓ External dist mount has content, using existing files"
fi

# Check and sync sites folder
if [ -z "$(ls -A /app/src/sites 2>/dev/null)" ]; then
    echo "  📦 External sites mount is empty, copying from image..."
    if [ -d /app/src/sites-internal ]; then
        cp -r /app/src/sites-internal/* /app/src/sites/
        echo "  ✅ Sites copied to external mount"
    fi
else
    echo "  ✓ External sites mount has content, using existing files"
fi

# Check and sync server binary
if [ ! -f /app/server ]; then
    echo "  📦 External server binary missing, copying from image..."
    if [ -f /app/server-internal ]; then
        cp /app/server-internal /app/server
        chmod +x /app/server
        echo "  ✅ Server binary copied to external mount"
    fi
else
    echo "  ✓ External server binary exists, using existing file"
    chmod +x /app/server
fi

# Check and sync sites-config.json
if [ ! -f /app/sites-config.json ]; then
    echo "  📦 Sites config missing, copying from image..."
    if [ -f /app/sites-config-internal.json ]; then
        cp /app/sites-config-internal.json /app/sites-config.json
        echo "  ✅ Sites config copied to external mount"
    fi
else
    echo "  ✓ Sites config exists, using existing file"
fi

# Ensure node_modules are available (they're not mounted externally)
if [ ! -d /app/node_modules ] && [ -d /app/node_modules-internal ]; then
    echo "  📦 Copying node_modules from internal..."
    cp -r /app/node_modules-internal /app/node_modules
fi

echo "✅ Mount sync complete, starting services..."

# Start supervisor
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf