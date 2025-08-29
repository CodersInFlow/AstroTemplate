#!/bin/bash

# Quick upload script - syncs changes without full rebuild
# Usage: ./quick-upload.sh [frontend|backend|both|all]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to all if no argument
SYNC_MODE=${1:-all}

echo -e "${GREEN}🚀 Quick Upload - Syncing $SYNC_MODE changes to production${NC}"

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

echo "   Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo "   Path: $SERVER_PATH"

# Track what needs restarting
RESTART_FRONTEND=false
RESTART_BACKEND=false

case $SYNC_MODE in
    frontend)
        echo -e "${YELLOW}🏗️ Building frontend with production API...${NC}"
        PUBLIC_API_URL="https://${DOMAIN}" npm run build || {
            echo -e "${RED}Frontend build failed!${NC}"
            exit 1
        }
        
        echo -e "${YELLOW}📤 Syncing frontend files (dist/, src/, public/)...${NC}"
        
        # Sync frontend files only
        rsync -avzL \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.git' \
            --exclude '.DS_Store' \
            dist/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/dist/
            
        rsync -avzL \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.DS_Store' \
            src/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/src/
            
        rsync -avz \
            -e "ssh -p $SERVER_PORT" \
            --exclude '.DS_Store' \
            public/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/public/
        
        RESTART_FRONTEND=true
        ;;
        
    backend)
        echo -e "${YELLOW}🔧 Building backend for Linux...${NC}"
        cd backend
        GOOS=linux GOARCH=amd64 go build -o server cmd/server/main.go || {
            echo -e "${RED}Backend build failed!${NC}"
            exit 1
        }
        cd ..
        
        echo -e "${YELLOW}📤 Syncing backend files...${NC}"
        
        # Sync backend source files
        rsync -avz \
            -e "ssh -p $SERVER_PORT" \
            --exclude '.git' \
            --exclude 'tmp' \
            backend/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/backend/
        
        RESTART_BACKEND=true
        ;;
        
    both)
        echo -e "${YELLOW}🏗️ Building both frontend and backend...${NC}"
        
        # Build frontend for production
        echo -e "${YELLOW}🏗️ Building frontend with production API...${NC}"
        PUBLIC_API_URL="https://${DOMAIN}" npm run build || {
            echo -e "${RED}Frontend build failed!${NC}"
            exit 1
        }
        
        # Build backend for Linux
        echo -e "${YELLOW}🔧 Building backend for Linux...${NC}"
        cd backend
        GOOS=linux GOARCH=amd64 go build -o server cmd/server/main.go || {
            echo -e "${RED}Backend build failed!${NC}"
            exit 1
        }
        cd ..
        
        echo -e "${YELLOW}📤 Syncing both frontend and backend...${NC}"
        
        # Sync frontend (follow symlinks)
        rsync -avzL \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.DS_Store' \
            dist/ src/ public/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
            
        # Sync backend
        rsync -avz \
            -e "ssh -p $SERVER_PORT" \
            --exclude '.git' \
            backend/ \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/backend/
        
        RESTART_FRONTEND=true
        RESTART_BACKEND=true
        ;;
        
    all)
        echo -e "${YELLOW}🏗️ Building everything...${NC}"
        
        # Build frontend for production
        echo -e "${YELLOW}🏗️ Building frontend with production API...${NC}"
        PUBLIC_API_URL="https://${DOMAIN}" npm run build || {
            echo -e "${RED}Frontend build failed!${NC}"
            exit 1
        }
        
        # Build backend for Linux
        echo -e "${YELLOW}🔧 Building backend for Linux...${NC}"
        cd backend
        GOOS=linux GOARCH=amd64 go build -o server cmd/server/main.go || {
            echo -e "${RED}Backend build failed!${NC}"
            exit 1
        }
        cd ..
        
        echo -e "${YELLOW}📤 Syncing all files except node_modules...${NC}"
        
        # Sync everything except large directories (follow symlinks)
        rsync -avzL \
            -e "ssh -p $SERVER_PORT" \
            --exclude 'node_modules' \
            --exclude '.git' \
            --exclude 'runtime/' \
            --exclude '.env' \
            --exclude '*.log' \
            --exclude '.DS_Store' \
            . \
            $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
        
        RESTART_FRONTEND=true
        RESTART_BACKEND=true
        ;;
        
    *)
        echo -e "${RED}Invalid option. Use: frontend, backend, both, or all${NC}"
        exit 1
        ;;
esac

# Handle service restarts if needed
if [ "$RESTART_BACKEND" = true ]; then
    echo -e "${YELLOW}🔄 Restarting backend service...${NC}"
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
        systemctl restart ${SITE_NAME}-backend
        echo 'Backend service restarted'
    " &
    BACKEND_PID=$!
fi

if [ "$RESTART_FRONTEND" = true ]; then
    echo -e "${YELLOW}🔄 Restarting Astro service...${NC}"
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
        systemctl restart ${SITE_NAME}-astro
    "
    
    # Wait a moment for service to start
    sleep 2
    
    # Check status
    STATUS=$(ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "systemctl is-active ${SITE_NAME}-astro" || echo "failed")
    if [ "$STATUS" = "active" ]; then
        echo -e "${GREEN}✅ Astro service restarted successfully${NC}"
    else
        echo -e "${RED}❌ Astro service failed to start${NC}"
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "journalctl -u ${SITE_NAME}-astro -n 10"
    fi
fi

# Wait for backend if it was restarted
if [ "$RESTART_BACKEND" = true ]; then
    wait $BACKEND_PID
    echo -e "${GREEN}✅ Backend container rebuilt and restarted${NC}"
fi

echo -e "${GREEN}✅ Upload complete!${NC}"
echo -e "${YELLOW}🌐 Site: https://$DOMAIN${NC}"

# Quick test
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Site is responding (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  Site returned HTTP $HTTP_STATUS${NC}"
fi