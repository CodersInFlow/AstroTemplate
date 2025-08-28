#!/bin/bash
# Server-side rebuild script - rebuilds and restarts services WITHOUT git operations
# This script should be run from the deployment directory on the server
# Used when files are synced via rsync instead of git

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting server rebuild...${NC}"

# Check if we're in the right directory
if [ ! -f "site.config.json" ]; then
    echo -e "${RED}❌ site.config.json not found! Are you in the deployment directory?${NC}"
    exit 1
fi

# Read configuration
SITE_NAME=$(node -p "require('./site.config.json').site.name" 2>/dev/null || jq -r '.site.name' site.config.json)
DOMAIN=$(node -p "require('./site.config.json').site.domain" 2>/dev/null || jq -r '.site.domain' site.config.json)
BACKEND_PORT=$(node -p "require('./site.config.json').ports.backend" 2>/dev/null || jq -r '.ports.backend' site.config.json)
FRONTEND_PORT=$(node -p "require('./site.config.json').ports.frontend" 2>/dev/null || jq -r '.ports.frontend' site.config.json)

echo -e "${YELLOW}📦 Site: ${DOMAIN}${NC}"

# Step 1: Install/update dependencies
echo -e "${YELLOW}📦 Installing/updating Node dependencies...${NC}"
npm install --production --legacy-peer-deps --omit=dev
npm install happy-dom --save  # Ensure happy-dom is installed for SSR

echo -e "${GREEN}✅ Dependencies updated${NC}"

# Step 2: Build frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
export PUBLIC_API_URL="https://${DOMAIN}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Step 3: Build backend
echo -e "${YELLOW}🔧 Building backend...${NC}"
cd backend
# Use full path to go binary if not in PATH
if command -v go &> /dev/null; then
    go build -o server cmd/server/main.go
elif [ -x "/usr/local/go/bin/go" ]; then
    /usr/local/go/bin/go build -o server cmd/server/main.go
else
    echo -e "${RED}❌ Go not found! Please install Go or update the path.${NC}"
    exit 1
fi
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Backend built successfully${NC}"

# Step 4: Process any template updates
if [ -d "templates" ] && [ -f "scripts/process-templates.sh" ]; then
    echo -e "${YELLOW}🔧 Processing configuration templates...${NC}"
    
    # Preserve existing passwords from .env
    if [ -f ".env" ]; then
        export MONGO_PASSWORD=$(grep '^MONGO_PASSWORD=' .env | cut -d'=' -f2)
        export JWT_SECRET=$(grep '^JWT_SECRET=' .env | cut -d'=' -f2)
    fi
    
    # Process templates
    bash scripts/process-templates.sh
    echo -e "${GREEN}✅ Templates processed${NC}"
fi

# Step 5: Update nginx config if changed
if [ -f "generated-configs/nginx-site.conf" ]; then
    echo -e "${YELLOW}🔧 Checking nginx configuration...${NC}"
    
    # Check if nginx config has changed
    if ! diff -q generated-configs/nginx-site.conf /etc/nginx/sites-enabled/${DOMAIN} >/dev/null 2>&1; then
        echo "Nginx config has changed, updating..."
        
        # Backup current config
        cp /etc/nginx/sites-enabled/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}.backup.$(date +%Y%m%d_%H%M%S)
        
        # Copy new config
        cp generated-configs/nginx-site.conf /etc/nginx/sites-enabled/${DOMAIN}
        
        # Test nginx config
        nginx -t
        if [ $? -eq 0 ]; then
            systemctl reload nginx
            echo -e "${GREEN}✅ Nginx reloaded with new config${NC}"
        else
            echo -e "${RED}❌ Nginx config test failed! Rolling back...${NC}"
            cp /etc/nginx/sites-enabled/${DOMAIN}.backup.$(date +%Y%m%d_%H%M%S) /etc/nginx/sites-enabled/${DOMAIN}
            exit 1
        fi
    else
        echo -e "${GREEN}✅ Nginx config unchanged${NC}"
    fi
fi

# Step 6: Restart services
echo -e "${YELLOW}🔄 Restarting services...${NC}"

# Restart backend service
systemctl restart ${SITE_NAME}-backend
echo -e "${GREEN}✅ Backend service restarted${NC}"

# Restart frontend service
systemctl restart ${SITE_NAME}-frontend
echo -e "${GREEN}✅ Frontend service restarted${NC}"

# Step 7: Docker containers (if using docker-compose)
if [ -f "docker-compose.prod.yml" ]; then
    echo -e "${YELLOW}🐳 Updating Docker containers...${NC}"
    docker compose -f docker-compose.prod.yml up -d
    echo -e "${GREEN}✅ Docker containers updated${NC}"
fi

# Step 8: Health check
echo -e "${YELLOW}🏥 Running health checks...${NC}"
sleep 3

# Check frontend
if curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${FRONTEND_PORT} | grep -q '200'; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}⚠️  Frontend may not be responding correctly${NC}"
fi

# Check backend API
if curl -s http://127.0.0.1:${BACKEND_PORT}/api/posts >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}⚠️  Backend API may not be responding correctly${NC}"
fi

# Check MongoDB
if docker exec ${SITE_NAME}-blog-mongodb mongosh --eval 'db.version()' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB check failed (may be using different setup)${NC}"
fi

echo -e "${GREEN}✨ Rebuild complete!${NC}"
echo -e "${YELLOW}🌐 Site: https://${DOMAIN}${NC}"
echo ""
echo -e "${YELLOW}📝 Rebuild summary:${NC}"
echo "  - Frontend: Rebuilt with latest changes"
echo "  - Backend: Rebuilt with latest changes"
echo "  - Services: Restarted successfully"