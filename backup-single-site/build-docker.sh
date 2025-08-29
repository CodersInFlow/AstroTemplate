#!/bin/bash

# Exit on any error
set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-proggod}"
IMAGE_NAME="${IMAGE_NAME:-codersinflow}"
DOCKER_REPO="${DOCKER_USERNAME}/${IMAGE_NAME}"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Building Docker image for codersinflow.com${NC}"

# Login to Docker Hub if credentials are provided
if [ ! -z "$DOCKER_USERNAME" ] && [ ! -z "$DOCKER_PASSWORD" ]; then
    echo -e "${YELLOW}🔑 Logging into Docker Hub...${NC}"
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
else
    echo -e "${YELLOW}⚠️  Using cached Docker Hub credentials...${NC}"
fi

# Setup buildx for multi-platform builds
echo -e "${YELLOW}🔧 Setting up Docker buildx...${NC}"
if ! docker buildx ls | grep -q codersinflow-builder; then
    docker buildx create --name codersinflow-builder --use
else
    docker buildx use codersinflow-builder
fi

docker buildx inspect --bootstrap

# Check for required environment file
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production not found!${NC}"
    echo "Please create .env.production with:"
    echo "  MONGO_PASSWORD=your_password"
    echo "  JWT_SECRET=your_secret"
    echo "  DOMAIN=codersinflow.com"
    exit 1
fi

# Load environment for build args
source .env.production

# Build and push multi-platform image
echo -e "${YELLOW}🏗️  Building multi-platform image...${NC}"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --build-arg PUBLIC_API_URL="https://${DOMAIN}/api" \
    --cache-from type=registry,ref=${DOCKER_REPO}:buildcache \
    --cache-to type=registry,ref=${DOCKER_REPO}:buildcache,mode=max \
    -t ${DOCKER_REPO}:latest \
    -t ${DOCKER_REPO}:$(date +%Y%m%d-%H%M%S) \
    --push \
    .

echo -e "${GREEN}✅ Build complete and pushed to Docker Hub!${NC}"
echo -e "${GREEN}📦 Image: ${DOCKER_REPO}:latest${NC}"

# Clean up builder (optional)
# docker buildx rm codersinflow-builder

echo ""
echo -e "${YELLOW}To deploy on server, run:${NC}"
echo "  ssh user@server 'cd /path/to/codersinflow && ./deploy-docker.sh'"