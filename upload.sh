#!/bin/bash

# Quick upload script - syncs changes without full rebuild
# Use this for quick updates when you've only changed source files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Quick Upload - Syncing changes to production${NC}"

# Load configuration from site.config.json
CONFIG_FILE="site.config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Error: $CONFIG_FILE not found${NC}"
    exit 1
fi

# Parse JSON config using node
SITE_NAME=$(node -p "require('./$CONFIG_FILE').site.name")
DOMAIN=$(node -p "require('./$CONFIG_FILE').site.domain")
SERVER_HOST=$(node -p "require('./$CONFIG_FILE').deployment.server.host")
SERVER_USER=$(node -p "require('./$CONFIG_FILE').deployment.server.user")
SERVER_PORT=$(node -p "require('./$CONFIG_FILE').deployment.server.port")
SERVER_PATH=$(node -p "require('./$CONFIG_FILE').deployment.server.path")
FRONTEND_PORT=$(node -p "require('./$CONFIG_FILE').ports.frontend")
BACKEND_PORT=$(node -p "require('./$CONFIG_FILE').ports.backend")

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Domain: $DOMAIN"
echo "   Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo "   Path: $SERVER_PATH"

# Ask what to sync
echo -e "${YELLOW}What would you like to sync?${NC}"
echo "1) Frontend only (Astro/React changes)"
echo "2) Backend only (Go API changes)"
echo "3) Both frontend and backend"
echo "4) Everything except node_modules and build files"
read -p "Select option (1-4): " SYNC_OPTION

# Track what needs restarting
RESTART_FRONTEND=false
RESTART_BACKEND=false

case $SYNC_OPTION in
    1)
        echo -e "${YELLOW}📤 Syncing frontend files...${NC}"
        
        # Check if we need to rebuild locally first
        read -p "Do you need to rebuild the frontend first? (y/n): " REBUILD
        if [ "$REBUILD" = "y" ]; then
            echo -e "${YELLOW}📦 Building frontend...${NC}"
            export PUBLIC_API_URL="https://$DOMAIN"
            npm run build
        fi
        
        # Sync frontend files
        rsync -avz --delete \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.git' \
            --exclude 'backend' \
            --exclude 'runtime' \
            --exclude '.env' \
            --exclude '*.log' \
            dist/ src/ public/ package*.json \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
        
        RESTART_FRONTEND=true
        ;;
        
    2)
        echo -e "${YELLOW}📤 Syncing backend files...${NC}"
        
        # Sync backend source files
        rsync -avz --delete \
            -e "ssh -p $SERVER_PORT" \
            --exclude '.git' \
            --exclude 'tmp' \
            backend/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/backend/
        
        RESTART_BACKEND=true
        ;;
        
    3)
        echo -e "${YELLOW}📤 Syncing both frontend and backend...${NC}"
        
        # Check if we need to rebuild frontend
        read -p "Do you need to rebuild the frontend first? (y/n): " REBUILD
        if [ "$REBUILD" = "y" ]; then
            echo -e "${YELLOW}📦 Building frontend...${NC}"
            export PUBLIC_API_URL="https://$DOMAIN"
            npm run build
        fi
        
        # Sync everything except large directories
        rsync -avz --delete \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.git' \
            --exclude 'runtime' \
            --exclude '.env' \
            --exclude '*.log' \
            --exclude '.DS_Store' \
            . \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
        
        RESTART_FRONTEND=true
        RESTART_BACKEND=true
        ;;
        
    4)
        echo -e "${YELLOW}📤 Syncing all source files...${NC}"
        
        # Sync everything except node_modules and runtime
        rsync -avz \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.git' \
            --exclude 'runtime' \
            --exclude 'dist' \
            --exclude '.env' \
            --exclude '*.log' \
            --exclude '.DS_Store' \
            --exclude 'docker-compose.prod.yml' \
            --exclude 'nginx-site.conf' \
            . \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
        
        echo -e "${YELLOW}🔧 This option requires manual rebuild on server${NC}"
        echo "SSH to server and run:"
        echo "  cd $SERVER_PATH"
        echo "  npm run build"
        echo "  docker-compose -f docker-compose.prod.yml up --build -d"
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

# Handle service restarts if needed
if [ "$RESTART_FRONTEND" = true ] || [ "$RESTART_BACKEND" = true ]; then
    echo -e "${YELLOW}🔄 Restarting services...${NC}"
    
    if [ "$RESTART_BACKEND" = true ]; then
        echo "  - Restarting backend (Docker)..."
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
            cd $SERVER_PATH
            docker-compose -f docker-compose.prod.yml up --build -d blog-backend
        "
    fi
    
    if [ "$RESTART_FRONTEND" = true ]; then
        # For frontend, we may need to reinstall dependencies if package.json changed
        PACKAGE_CHANGED=$(rsync -avz --dry-run -e "ssh -p $SERVER_PORT" package.json $SERVER_USER@$SERVER_HOST:$SERVER_PATH/ | grep -c "package.json" || true)
        
        if [ "$PACKAGE_CHANGED" -gt 0 ]; then
            echo "  - Installing npm dependencies..."
            ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
                cd $SERVER_PATH
                npm install --production
            "
        fi
        
        echo "  - Restarting Astro service..."
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
            systemctl restart ${SITE_NAME}-astro
        "
    fi
fi

# Verify services are running
echo -e "${YELLOW}🧪 Verifying services...${NC}"

if [ "$RESTART_FRONTEND" = true ]; then
    sleep 3
    STATUS=$(ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "systemctl is-active ${SITE_NAME}-astro" || echo "failed")
    if [ "$STATUS" = "active" ]; then
        echo -e "${GREEN}✅ Astro service is running${NC}"
    else
        echo -e "${RED}❌ Astro service failed to start${NC}"
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "journalctl -u ${SITE_NAME}-astro -n 20"
    fi
fi

if [ "$RESTART_BACKEND" = true ]; then
    STATUS=$(ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "docker ps --filter name=${SITE_NAME}-blog-backend --format '{{.Status}}'" || echo "")
    if [[ $STATUS == *"Up"* ]]; then
        echo -e "${GREEN}✅ Backend container is running${NC}"
    else
        echo -e "${RED}❌ Backend container failed to start${NC}"
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "docker-compose -f $SERVER_PATH/docker-compose.prod.yml logs --tail=20 blog-backend"
    fi
fi

echo -e "${GREEN}✅ Upload complete!${NC}"
echo -e "${YELLOW}🌐 Site: https://$DOMAIN${NC}"

# Show what was synced
echo -e "${YELLOW}📊 Summary:${NC}"
echo "   - Files synced to $SERVER_PATH"
if [ "$RESTART_FRONTEND" = true ]; then
    echo "   - Frontend service restarted"
fi
if [ "$RESTART_BACKEND" = true ]; then
    echo "   - Backend container restarted"
fi

# Optional: Test the site
read -p "Would you like to test the site? (y/n): " TEST_SITE
if [ "$TEST_SITE" = "y" ]; then
    echo -e "${YELLOW}🧪 Testing site...${NC}"
    
    # Test homepage
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Homepage is accessible (HTTP $HTTP_STATUS)${NC}"
    else
        echo -e "${RED}❌ Homepage returned HTTP $HTTP_STATUS${NC}"
    fi
    
    # Test API
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/posts)
    if [ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "401" ]; then
        echo -e "${GREEN}✅ API is responding (HTTP $API_STATUS)${NC}"
    else
        echo -e "${RED}❌ API returned HTTP $API_STATUS${NC}"
    fi
fi