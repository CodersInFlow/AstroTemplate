#!/bin/bash

# Hot sync - syncs project without restarting container
# The file watcher will detect changes and rebuild automatically

set -e

# Load environment variables
if [ -f ".env" ]; then
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        # Remove inline comments and trim whitespace
        value="${value%%#*}"
        value="${value%"${value##*[![:space:]]}"}"
        # Export the variable
        export "$key=$value"
    done < <(grep -v '^#' .env | grep -v '^$')
fi

# Configuration
SERVER="${DEPLOY_SERVER:-74.208.63.245}"
USER="${DEPLOY_USER:-root}"
SSH_PORT="${DEPLOY_PORT:-22}"
REMOTE_DIR="/var/www/astro"

echo "🔥 Hot Sync to Server (No Restart)"
echo "===================================="
echo "Server: $USER@$SERVER:$SSH_PORT"
echo "Target: $REMOTE_DIR"
echo ""

# Create directory structure on server if needed
echo "📁 Ensuring directory structure..."
ssh -p $SSH_PORT $USER@$SERVER "mkdir -p $REMOTE_DIR"

# Sync project files
echo "📤 Syncing project files..."
rsync -avz --delete \
    -e "ssh -p $SSH_PORT" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.docker-build-output' \
    --exclude '.docker-build-temp' \
    --exclude 'dist' \
    --exclude '.env' \
    --exclude 'mongodb-data' \
    --exclude 'uploads' \
    ./ \
    $USER@$SERVER:$REMOTE_DIR/

echo ""
echo "✅ Hot sync complete!"
echo "====================="
echo ""
echo "The file watcher in the container will detect changes and rebuild automatically."
echo "Monitor rebuild progress with:"
echo "  ssh $USER@$SERVER 'docker logs -f magic-video-container | grep \"🔄\\|✅\\|❌\"'"
echo ""
echo "Check watcher status:"
echo "  ssh $USER@$SERVER 'docker exec magic-video-container ps aux | grep watch'"