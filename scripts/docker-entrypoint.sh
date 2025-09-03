#!/bin/bash

# Simple Docker entrypoint - everything is in the image
set -e

echo "✅ Starting services..."

# Start supervisor
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf