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

# Step 1.5: Build backend for Linux
echo -e "${YELLOW}🔧 Building backend for Linux...${NC}"
cd backend
GOOS=linux GOARCH=amd64 go build -o server cmd/server/main.go || {
    echo -e "${RED}Backend build failed!${NC}"
    exit 1
}
cd ..
echo -e "${GREEN}✅ Backend build successful!${NC}"

# Step 2: Generate configuration files from templates
echo -e "${YELLOW}🔧 Processing configuration templates...${NC}"

# Check if MongoDB data already exists on server
EXISTING_ENV=$(ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "[ -f ${SERVER_PATH}/.env ] && [ -d ${SERVER_PATH}/runtime/mongodb ] && cat ${SERVER_PATH}/.env" 2>/dev/null || echo "")

if [ -n "${EXISTING_ENV}" ]; then
    echo -e "${GREEN}✅ Found existing MongoDB installation, preserving credentials${NC}"
    # Extract existing passwords from server
    export MONGO_PASSWORD=$(echo "${EXISTING_ENV}" | grep '^MONGO_PASSWORD=' | cut -d'=' -f2)
    export JWT_SECRET=$(echo "${EXISTING_ENV}" | grep '^JWT_SECRET=' | cut -d'=' -f2)
else
    echo -e "${YELLOW}🔧 Generating new secure passwords...${NC}"
    export MONGO_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    export JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
fi

# Process all templates
bash scripts/process-templates.sh

echo -e "${GREEN}✅ Configuration files generated from templates${NC}"

# Configuration files are already generated from templates
echo -e "${GREEN}✅ Using configuration files generated from templates${NC}"

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

# Create target directories first
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH} ${SERVER_PATH}/dist ${SERVER_PATH}/backend ${SERVER_PATH}/runtime"

# Sync main codebase (excluding large directories) - no delete, no preserve perms
rsync -rltz \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'runtime' \
    --exclude 'uploads' \
    --exclude '.DS_Store' \
    --exclude 'test-*' \
    --exclude 'playwright*' \
    --exclude '*.log' \
    --exclude 'generated-configs' \
    -e "ssh -p ${SERVER_PORT}" \
    . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/ 2>/dev/null || echo "Main sync completed with warnings"

# Explicitly copy .env and docker-compose files
scp -P ${SERVER_PORT} .env docker-compose.prod.yml ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# Sync the built dist directory
rsync -rltz -e "ssh -p ${SERVER_PORT}" dist/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/dist/ 2>/dev/null || echo "Dist sync completed with warnings"

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
scp -P ${SERVER_PORT} generated-configs/nginx-site.conf ${SERVER_USER}@${SERVER_HOST}:/tmp/${DOMAIN}.nginx

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
    docker compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Start Docker containers with the .env file
    echo '🚀 Starting Docker containers...'
    docker compose -f docker-compose.prod.yml up -d
    
    # Wait for containers to be ready
    echo '⏳ Waiting for containers to start...'
    for i in {1..30}; do
        if docker exec ${SITE_NAME}-blog-mongodb mongosh --eval 'db.version()' >/dev/null 2>&1; then
            echo '✅ MongoDB is ready!'
            break
        fi
        sleep 1
    done
    
    # Check if services are running
    docker compose -f docker-compose.prod.yml ps
"

# Step 9: Install Node dependencies and start Astro
echo -e "${YELLOW}📦 Installing Node dependencies...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    npm install --production --legacy-peer-deps --omit=dev
    
    # Install happy-dom explicitly (needed for server-side TipTap rendering)
    npm install happy-dom --save
    
    echo '✅ Node dependencies installed'
"

# Step 9.5: Deploy systemd services for backend and frontend
echo -e "${YELLOW}🔧 Deploying systemd services...${NC}"

# Copy service files
scp -P ${SERVER_PORT} generated-configs/${SITE_NAME}-backend.service ${SERVER_USER}@${SERVER_HOST}:/etc/systemd/system/${SITE_NAME}-backend.service
scp -P ${SERVER_PORT} generated-configs/${SITE_NAME}-frontend.service ${SERVER_USER}@${SERVER_HOST}:/etc/systemd/system/${SITE_NAME}-frontend.service

ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    # Kill any existing processes that might be running directly
    pkill -f 'server.*${BACKEND_PORT}' 2>/dev/null || true
    pkill -f 'node.*entry.mjs' 2>/dev/null || true
    
    # Clean up old services if they exist
    systemctl stop ${SITE_NAME}-astro 2>/dev/null || true
    systemctl disable ${SITE_NAME}-astro 2>/dev/null || true
    systemctl stop ${SITE_NAME}-app 2>/dev/null || true
    systemctl disable ${SITE_NAME}-app 2>/dev/null || true
    rm -f /etc/systemd/system/${SITE_NAME}-astro.service /etc/systemd/system/${SITE_NAME}-app.service
    
    # Reload systemd and start services
    systemctl daemon-reload
    
    # Enable and start backend service
    systemctl enable ${SITE_NAME}-backend.service
    systemctl restart ${SITE_NAME}-backend.service
    echo '✅ Backend service started'
    
    # Enable and start frontend service
    systemctl enable ${SITE_NAME}-frontend.service
    systemctl restart ${SITE_NAME}-frontend.service
    echo '✅ Frontend service started'
"

# Step 10: Set up admin user directly in MongoDB
echo -e "${YELLOW}👤 Setting up admin user...${NC}"

# Read admin config
ADMIN_EMAIL=$(jq -r '.admin.email // "admin@example.com"' site.config.json)
ADMIN_PASSWORD=$(jq -r '.admin.password // "admin123"' site.config.json)
ADMIN_NAME=$(jq -r '.admin.name // "Admin"' site.config.json)

# Create admin user directly in MongoDB on server
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    
    # Install bcryptjs if needed (for password hashing)
    npm list bcryptjs >/dev/null 2>&1 || npm install bcryptjs
    
    # Generate password hash
    ADMIN_HASH=\$(node -e \"const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('${ADMIN_PASSWORD}', 10));\")
    
    # Wait for MongoDB to be ready
    echo '⏳ Waiting for MongoDB to be ready...'
    for i in {1..30}; do
        if docker exec ${SITE_NAME}-blog-mongodb mongosh --eval 'db.version()' >/dev/null 2>&1; then
            break
        fi
        sleep 1
    done
    
    # Create admin user directly in MongoDB
    echo '🔧 Creating admin user in MongoDB...'
    docker exec ${SITE_NAME}-blog-mongodb mongosh -u admin -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin ${DB_NAME} --eval \"
        // Remove any existing admin user
        db.users.deleteMany({ email: '${ADMIN_EMAIL}' });
        
        // Insert new admin user with approved=true
        db.users.insertOne({
            email: '${ADMIN_EMAIL}',
            password: '\${ADMIN_HASH}',
            name: '${ADMIN_NAME}',
            isAdmin: true,
            approved: true,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Verify user was created
        const user = db.users.findOne({ email: '${ADMIN_EMAIL}' });
        if (user) {
            print('✅ Admin user created successfully:');
            print('  Email: ' + user.email);
            print('  Name: ' + user.name);
            print('  Admin: ' + user.isAdmin);
            print('  Approved: ' + user.approved);
        } else {
            print('❌ Failed to create admin user');
        }
        
        // Create default category if none exists
        if (db.categories.countDocuments() === 0) {
            db.categories.insertOne({
                name: 'General',
                slug: 'general',
                description: 'General blog posts',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            print('✅ Created default General category');
        }
    \" || echo 'Admin user creation will complete on first connection'
    
    echo '✅ Admin user setup completed'
"

# Step 11: Verify deployment
echo -e "${YELLOW}🧪 Verifying deployment...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
    cd ${SERVER_PATH}
    
    # Check Docker containers
    echo '🐳 Docker container status:'
    docker compose -f docker-compose.prod.yml ps
    
    # Check if backend is responding
    echo -e '\n🔍 Testing backend API...'
    if curl -s http://127.0.0.1:${BACKEND_PORT}/api/posts | grep -q 'posts\\|\\[\\]'; then
        echo '✅ Backend API is responding'
    else
        echo '⚠️ Backend API check failed'
    fi
    
    # Check Astro frontend
    echo -e '\n🚀 Service status:'
    echo '📡 Backend:'
    systemctl status ${SITE_NAME}-backend --no-pager | head -5
    echo -e '\n🌐 Frontend:'
    systemctl status ${SITE_NAME}-frontend --no-pager | head -5
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