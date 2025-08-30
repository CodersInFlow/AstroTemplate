#!/bin/bash

# Deploy to production server
set -e

REGISTRY="${1:-docker.io/yourusername}"
TAG="${2:-latest}"
SERVER="${3:-your-server.com}"

echo "🚀 Deploying to Production"
echo "========================="
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo "Server: $SERVER"
echo ""

# Build image
echo "📦 Building Docker image..."
docker build -f Dockerfile.unified-ssr -t multi-tenant-app:$TAG .

# Tag for registry
echo "🏷️  Tagging image..."
docker tag multi-tenant-app:$TAG $REGISTRY/multi-tenant-app:$TAG

# Push to registry
echo "⬆️  Pushing to registry..."
docker push $REGISTRY/multi-tenant-app:$TAG

# Deploy to server
echo "🌐 Deploying to $SERVER..."
ssh $SERVER << EOF
  docker pull $REGISTRY/multi-tenant-app:$TAG
  docker-compose -f docker-compose.unified.yml down
  docker-compose -f docker-compose.unified.yml up -d
EOF

echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo "Your app is live at: http://$SERVER"