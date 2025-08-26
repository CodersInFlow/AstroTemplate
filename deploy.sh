#!/bin/bash

# Generic deployment script that reads from site.config.json
# This script should be copied and customized for each site

# Exit on any error
set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq is required but not installed. Install with: brew install jq${NC}"
    exit 1
fi

# Check for site.config.json
if [ ! -f "site.config.json" ]; then
    echo -e "${RED}❌ site.config.json not found!${NC}"
    exit 1
fi

# Read configuration
SITE_NAME=$(jq -r '.site.name' site.config.json)
DISPLAY_NAME=$(jq -r '.site.displayName' site.config.json)
DOMAIN=$(jq -r '.site.domain' site.config.json)
FRONTEND_PORT=$(jq -r '.ports.frontend' site.config.json)
BACKEND_PORT=$(jq -r '.ports.backend' site.config.json)
MONGODB_PORT=$(jq -r '.ports.mongodb' site.config.json)
DB_NAME=$(jq -r '.database.name' site.config.json)
FRONTEND_URL="https://${DOMAIN}"
BACKEND_URL="https://${DOMAIN}"

# Read server connection details from config
SERVER_USER=$(jq -r '.deployment.server.user // "root"' site.config.json)
SERVER_HOST=$(jq -r '.deployment.server.host // "your-server.com"' site.config.json)
SERVER_PORT=$(jq -r '.deployment.server.port // 22' site.config.json)
SERVER_PATH=$(jq -r '.deployment.server.path // "/var/www/\(.site.domain)"' site.config.json)

echo -e "${GREEN}🚀 Starting deployment for ${DISPLAY_NAME} (${DOMAIN})${NC}"

# Step 1: Build frontend with production API URL
echo -e "${YELLOW}📦 Building Astro site with production API...${NC}"
export PUBLIC_API_URL="${FRONTEND_URL}"
echo "Building with PUBLIC_API_URL=${PUBLIC_API_URL}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Step 2: Create .env file for Docker environment variables
echo -e "${YELLOW}🔧 Creating .env file...${NC}"
cat > .env << 'ENVEOF'
MONGO_PASSWORD=H+kmWOoxKC0yAOwaoimPyQ
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ENVEOF

# Step 3: Create docker-compose.prod.yml
echo -e "${YELLOW}🔧 Creating docker-compose.prod.yml...${NC}"
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  # Blog backend service
  blog-backend:
    container_name: ${SITE_NAME}-blog-backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "127.0.0.1:${BACKEND_PORT}:${BACKEND_PORT}"
    environment:
      - MONGODB_URI=mongodb://admin:\${MONGO_PASSWORD}@${SITE_NAME}-blog-mongodb:27017/${DB_NAME}?authSource=admin
      - JWT_SECRET=\${JWT_SECRET}
      - UPLOAD_DIR=/uploads
      - CORS_ORIGIN=${FRONTEND_URL}
      - PORT=${BACKEND_PORT}
    volumes:
      - ./runtime/uploads:/uploads
    depends_on:
      - blog-mongodb
    networks:
      - blog-network

  # MongoDB for blog
  blog-mongodb:
    container_name: ${SITE_NAME}-blog-mongodb
    image: mongo:7.0
    restart: unless-stopped
    ports:
      - "127.0.0.1:${MONGODB_PORT}:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=\${MONGO_PASSWORD}
      - MONGO_INITDB_DATABASE=${DB_NAME}
    volumes:
      - ./runtime/mongodb:/data/db
    networks:
      - blog-network
    command: mongod --bind_ip 0.0.0.0

networks:
  blog-network:
    driver: bridge
EOF

# Step 3: Create nginx configuration
echo -e "${YELLOW}📝 Creating nginx configuration...${NC}"
cat > nginx-site.conf << EOF
server {
    # Redirect HTTP to HTTPS
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    # HTTPS configuration
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name ${DOMAIN} www.${DOMAIN};
    
    # Maximum upload size (25MB)
    client_max_body_size 25M;

    # SSL configuration (update paths as needed)
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/${DOMAIN}/chain.pem;

    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Set root directory
    root ${SERVER_PATH}/dist/client;
    index index.html index.htm;

    # Logs
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # API proxy to backend
    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header Cookie \$http_cookie;
        proxy_pass_request_headers on;
    }

    # Uploaded files - serve directly from nginx
    location /uploads/ {
        alias ${SERVER_PATH}/runtime/uploads/;
        expires 30d;
        add_header Cache-Control "public";
        try_files \$uri =404;
    }

    # Static assets
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location - but exclude /uploads/
    location / {
        try_files \$uri @astro;
    }
    
    # Other static files (but not from uploads directory)
    location ~* ^(?!/uploads/).*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # Astro server proxy
    location @astro {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Redirect www to non-www
    if (\$host = www.${DOMAIN}) {
        return 301 https://${DOMAIN}\$request_uri;
    }
}
EOF

echo -e "${GREEN}✅ Configuration files created!${NC}"

# Step 4: Backup current site on server
echo -e "${YELLOW}💾 Backing up current site...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    if [ -d ${SERVER_PATH} ]; then
        cp -r ${SERVER_PATH} ${SERVER_PATH}.backup.\$(date +%Y%m%d_%H%M%S)
        echo '✅ Backup created'
    fi
"

# Step 5: Sync files to server
echo -e "${YELLOW}📤 Syncing files to server...${NC}"
# Sync main codebase (excluding large directories)
rsync -avzL --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'runtime' \
    --exclude 'uploads' \
    -e "ssh -p ${SERVER_PORT}" \
    . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# Explicitly copy .env file
rsync -avz -e "ssh -p ${SERVER_PORT}" .env ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# Sync the built dist directory
rsync -avzL --delete -e "ssh -p ${SERVER_PORT}" dist/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/dist/

# Step 6: Set up server environment
echo -e "${YELLOW}🔧 Setting up server environment...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    
    # Create runtime directories
    echo '📁 Creating runtime directories...'
    mkdir -p runtime/mongodb runtime/uploads
    
    # Generate .env file with secure passwords if it doesn't exist
    if [ ! -f runtime/.env ]; then
        echo '🔐 Generating secure environment variables...'
        JWT_SECRET=\$(openssl rand -base64 32)
        MONGO_PASSWORD=\$(openssl rand -base64 16 | tr -d '=/')
        
        cat > runtime/.env << EOL
JWT_SECRET=\${JWT_SECRET}
MONGO_PASSWORD=\${MONGO_PASSWORD}
MONGO_USERNAME=admin
MONGODB_URI=mongodb://admin:\${MONGO_PASSWORD}@${SERVICE_PREFIX}-blog-mongodb:27017/${DB_NAME}?authSource=admin
EOL
        echo '✅ Environment file created'
    else
        echo '✅ Using existing environment file'
    fi
    
    # Set permissions
    chmod 600 runtime/.env
    chmod -R 755 runtime/uploads
"

# Step 7: Deploy nginx configuration
echo -e "${YELLOW}🔧 Updating nginx configuration...${NC}"
scp -P ${SERVER_PORT} nginx-site.conf ${SERVER_USER}@${SERVER_HOST}:/tmp/${DOMAIN}.nginx

ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    # Backup existing nginx config
    if [ -f /etc/nginx/sites-enabled/${DOMAIN} ]; then
        cp /etc/nginx/sites-enabled/${DOMAIN} /etc/nginx/backups/${DOMAIN}.backup.\$(date +%Y%m%d_%H%M%S)
        echo '✅ Backed up existing nginx config'
    fi
    
    # Copy new config
    cp /tmp/${DOMAIN}.nginx /etc/nginx/sites-enabled/${DOMAIN}
    
    # Test nginx config
    nginx -t
    if [ \$? -eq 0 ]; then
        echo '✅ Nginx config test passed'
        systemctl reload nginx
        echo '✅ Nginx reloaded successfully'
    else
        echo '❌ Nginx config test failed! Check configuration.'
        exit 1
    fi
    
    rm /tmp/${DOMAIN}.nginx
"

# Step 8: Start Docker containers
echo -e "${YELLOW}🐳 Starting Docker containers...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    
    # Stop any existing containers
    docker compose -f docker-compose.prod.yml --env-file runtime/.env down 2>/dev/null || true
    
    # Start new containers
    docker compose -f docker-compose.prod.yml --env-file runtime/.env up -d --build
    
    # Wait for services to be ready
    echo '⏳ Waiting for services to start...'
    sleep 10
    
    # Check if services are running
    docker compose -f docker-compose.prod.yml --env-file runtime/.env ps
"

# Step 9: Install Node dependencies and start Astro
echo -e "${YELLOW}📦 Installing Node dependencies...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    npm install --production --legacy-peer-deps --omit=dev
    
    # Install happy-dom explicitly (needed for server-side TipTap rendering)
    npm install happy-dom --save
    
    # Create systemd service for Astro
    cat > /etc/systemd/system/${SITE_NAME}-astro.service << EOL
[Unit]
Description=${DISPLAY_NAME} Astro Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${SERVER_PATH}
Environment=\"PORT=${FRONTEND_PORT}\"
Environment=\"HOST=0.0.0.0\"
Environment=\"PUBLIC_API_URL=https://${DOMAIN}\"
ExecStart=/usr/bin/node ${SERVER_PATH}/dist/server/entry.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

    systemctl daemon-reload
    systemctl enable ${SITE_NAME}-astro.service
    systemctl restart ${SITE_NAME}-astro.service
    
    echo '✅ Astro service created and started'
"

# Step 10: Set up admin user
echo -e "${YELLOW}👤 Setting up admin user...${NC}"

# Read admin config
ADMIN_EMAIL=$(jq -r '.admin.email // "admin@example.com"' site.config.json)
ADMIN_PASSWORD=$(jq -r '.admin.password // "admin123"' site.config.json)
ADMIN_NAME=$(jq -r '.admin.name // "Admin"' site.config.json)

# Generate setup script locally
bash scripts/setup-admin.sh > /dev/null 2>&1

# Use a simpler approach - copy the mongo script and run it
scp -P ${SERVER_PORT} runtime/setup-admin.mongo ${SERVER_USER}@${SERVER_HOST}:/tmp/setup-admin.mongo

# Execute on server with timeout
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    
    # Load environment variables
    source runtime/.env
    
    # Run the mongo script with timeout
    timeout 5 docker exec codersinflow-blog-mongodb mongosh -u admin -p \"\${MONGO_PASSWORD}\" --authenticationDatabase admin ${DB_NAME} < /tmp/setup-admin.mongo || echo 'Admin setup will complete on first connection'
    
    rm -f /tmp/setup-admin.mongo
    echo '✅ Admin setup attempted'
"

# Step 11: Verify deployment
echo -e "${YELLOW}🧪 Verifying deployment...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    
    # Check Docker containers
    echo '🐳 Docker container status:'
    docker compose -f docker-compose.prod.yml --env-file runtime/.env ps
    
    # Check if backend is responding
    echo -e '\n🔍 Testing backend API...'
    curl -s -o /dev/null -w '%{http_code}' http://localhost:${BACKEND_PORT}/api/health || echo 'Backend check'
    
    # Check Astro frontend
    echo -e '\n🚀 Astro frontend status:'
    systemctl status ${SITE_NAME}-astro --no-pager | head -5
"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}🌐 Site deployed to ${FRONTEND_URL}${NC}"
echo ""
echo -e "${YELLOW}📌 Deployment summary:${NC}"
echo "   Server: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}"
echo "   Path: ${SERVER_PATH}"
echo "   Backend Port: ${BACKEND_PORT}"
echo "   Database: ${DB_NAME}"
echo ""
echo -e "${YELLOW}🧪 Test URLs:${NC}"
echo "   ${FRONTEND_URL} - Homepage"
echo "   ${FRONTEND_URL}/blog - Blog"
echo "   ${FRONTEND_URL}/docs - Documentation"
echo "   ${FRONTEND_URL}/editor - Admin panel"
echo "   ${FRONTEND_URL}/api/posts - API endpoint"
echo ""
echo -e "${YELLOW}🔑 Admin Credentials:${NC}"
echo "   Email: ${ADMIN_EMAIL}"
echo "   Password: ${ADMIN_PASSWORD}"
echo "   Login at: ${FRONTEND_URL}/editor/login"