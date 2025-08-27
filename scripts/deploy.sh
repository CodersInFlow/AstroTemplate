#!/bin/bash

# Deployment script - reads from site.config.json

set -e

# Parse config using Node.js
SITE_NAME=$(node -p "require('./site.config.json').site.name")
DOMAIN=$(node -p "require('./site.config.json').site.domain")
SERVER_HOST=$(node -p "require('./site.config.json').deployment.server.host")
SERVER_USER=$(node -p "require('./site.config.json').deployment.server.user")
SERVER_PORT=$(node -p "require('./site.config.json').deployment.server.port")
SERVER_PATH=$(node -p "require('./site.config.json').deployment.server.path")
BACKEND_PORT=$(node -p "require('./site.config.json').ports.backend")
FRONTEND_PORT=$(node -p "require('./site.config.json').ports.frontend")

echo "🚀 Deploying to $DOMAIN..."

# Sync files to server (excluding node_modules and local-only files)
echo "📤 Syncing files to server..."
rsync -avzL --delete \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude 'runtime' \
  --exclude '.env.local' \
  --exclude 'backend/backend' \
  --exclude 'backend/server' \
  --exclude 'backend/uploads' \
  --exclude 'generated-configs' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'reference' \
  --exclude 'test-dist' \
  --exclude '.codersinflow' \
  --exclude 'src/components.bak' \
  -e "ssh -p $SERVER_PORT" \
  ./ \
  $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# Install Go if not installed
echo "🔧 Checking Go installation..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "if ! command -v go &> /dev/null; then
  echo 'Installing Go...'
  curl -L https://go.dev/dl/go1.21.5.linux-amd64.tar.gz | tar -C /usr/local -xz
  echo 'export PATH=\$PATH:/usr/local/go/bin' >> /etc/profile
  export PATH=\$PATH:/usr/local/go/bin
fi"

# Build everything on server
echo "🔨 Building on server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && \
  export PATH=\$PATH:/usr/local/go/bin && \
  npm install && \
  npm run build && \
  cd backend && \
  go build -o backend cmd/server/main.go"

# Create runtime directory if it doesn't exist
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH/runtime"

# Generate systemd service files
echo "📝 Generating systemd service files..."
node scripts/generate-configs.js

# Deploy systemd services
echo "📤 Deploying systemd services..."
scp -P $SERVER_PORT generated-configs/$SITE_NAME-backend.service $SERVER_USER@$SERVER_HOST:/etc/systemd/system/
scp -P $SERVER_PORT generated-configs/$SITE_NAME-frontend.service $SERVER_USER@$SERVER_HOST:/etc/systemd/system/

# Reload systemd and enable services
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "systemctl daemon-reload && \
  systemctl enable $SITE_NAME-backend && \
  systemctl enable $SITE_NAME-frontend"

# Restart services using systemd
echo "♻️  Restarting services..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
  systemctl stop $SITE_NAME-frontend
  sleep 1
  systemctl start $SITE_NAME-frontend
  systemctl restart $SITE_NAME-backend
  echo 'All services restarted'
"

# Wait for services to start
sleep 3

# Verify nginx config
echo "🔍 Checking nginx configuration..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "nginx -t && systemctl reload nginx"

# Health check
echo "🏥 Running health checks..."
sleep 3
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "curl -s -o /dev/null -w '%{http_code}' http://localhost:$FRONTEND_PORT | grep -q '200' && echo '  ✓ Frontend server responding' || echo '  ✗ Frontend server not responding'"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "curl -s -o /dev/null -w '%{http_code}' http://localhost:$BACKEND_PORT/api/health | grep -q '200' && echo '  ✓ Backend API responding' || echo '  ✗ Backend API not responding'"

echo "✅ Deployment complete!"
echo "🌐 Visit https://$DOMAIN to see changes"