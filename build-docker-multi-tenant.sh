#!/bin/bash

# Build script for multi-tenant Docker deployment

set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-proggod}"
IMAGE_NAME="${IMAGE_NAME:-multi-site-app}"
DOCKER_REPO="${DOCKER_USERNAME}/${IMAGE_NAME}"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}   Building Multi-Tenant Docker Image${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to check if site is built
check_site_built() {
    local site=$1
    if [ ! -d "frontends/$site/dist" ]; then
        echo -e "${YELLOW}⚠️  $site not built, building now...${NC}"
        cd "frontends/$site"
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        npm run build
        cd ../..
        echo -e "${GREEN}✅ Built $site${NC}"
    else
        echo -e "${GREEN}✓ $site already built${NC}"
    fi
}

# Build all frontend sites first
echo -e "${YELLOW}📦 Checking frontend builds...${NC}"
for dir in frontends/*/; do
    if [ -f "$dir/package.json" ]; then
        site=$(basename "$dir")
        check_site_built "$site"
    fi
done

# Login to Docker Hub if credentials are provided
if [ ! -z "$DOCKER_USERNAME" ] && [ ! -z "$DOCKER_PASSWORD" ]; then
    echo -e "${YELLOW}🔑 Logging into Docker Hub...${NC}"
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
else
    echo -e "${YELLOW}⚠️  Using cached Docker Hub credentials...${NC}"
fi

# Check for environment file
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}Creating default .env.production...${NC}"
    cat > .env.production << 'EOF'
# Production Environment Variables
MONGO_PASSWORD=changeme123
JWT_SECRET=changeme456
NODE_ENV=production
EOF
    echo -e "${YELLOW}⚠️  Please update .env.production with secure values${NC}"
fi

# Load environment for build args
source .env.production

# Build based on argument
BUILD_TYPE=${1:-multi-tenant}

case "$BUILD_TYPE" in
    multi-tenant|multi)
        echo -e "${YELLOW}🐳 Building multi-tenant container...${NC}"
        
        # Build the multi-tenant image
        docker build \
            -f Dockerfile.multi-tenant \
            -t ${DOCKER_REPO}:latest \
            -t ${DOCKER_REPO}:multi-tenant \
            --build-arg MONGO_PASSWORD="${MONGO_PASSWORD}" \
            --build-arg JWT_SECRET="${JWT_SECRET}" \
            .
        
        echo -e "${GREEN}✅ Multi-tenant image built: ${DOCKER_REPO}:latest${NC}"
        ;;
    
    single|original)
        echo -e "${YELLOW}🐳 Building single-site container...${NC}"
        
        # Build the original single-site image
        if [ -f "Dockerfile" ]; then
            docker build \
                -f Dockerfile \
                -t ${DOCKER_USERNAME}/codersinflow:latest \
                --build-arg MONGO_PASSWORD="${MONGO_PASSWORD}" \
                --build-arg JWT_SECRET="${JWT_SECRET}" \
                .
            
            echo -e "${GREEN}✅ Single-site image built: ${DOCKER_USERNAME}/codersinflow:latest${NC}"
        else
            echo -e "${RED}❌ Dockerfile not found for single-site build${NC}"
            exit 1
        fi
        ;;
    
    push)
        echo -e "${YELLOW}📤 Pushing multi-tenant image to Docker Hub...${NC}"
        docker push ${DOCKER_REPO}:latest
        docker push ${DOCKER_REPO}:multi-tenant
        echo -e "${GREEN}✅ Pushed to Docker Hub${NC}"
        ;;
    
    all)
        # Build everything
        echo -e "${YELLOW}🏗️  Building all Docker images...${NC}"
        
        # Build multi-tenant
        $0 multi-tenant
        
        # Build single-site if available
        if [ -f "Dockerfile" ]; then
            $0 single
        fi
        
        echo -e "${GREEN}✅ All images built${NC}"
        ;;
    
    *)
        echo "Usage: ./build-docker-multi-tenant.sh [type]"
        echo ""
        echo "Types:"
        echo "  multi-tenant, multi  Build multi-tenant container (default)"
        echo "  single, original     Build original single-site container"
        echo "  push                 Push multi-tenant image to Docker Hub"
        echo "  all                  Build all container types"
        echo ""
        echo "Current configuration:"
        echo "  Docker repo: ${DOCKER_REPO}"
        echo "  Sites configured: $(ls -d frontends/*/ 2>/dev/null | wc -l)"
        ;;
esac

# Show next steps
if [ "$BUILD_TYPE" != "push" ] && [ "$1" != "" ]; then
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  Run locally:  docker-compose -f docker-compose.multi-tenant.yml up"
    echo "  Push to hub:  ./build-docker-multi-tenant.sh push"
    echo "  Deploy:       ./deploy-docker.sh"
fi