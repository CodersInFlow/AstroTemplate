#!/bin/bash

# Exit on any error
set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to codersinflow.com${NC}"

# Step 1: Build frontend with production API URL
echo -e "${YELLOW}📦 Building Astro site with production API...${NC}"
export PUBLIC_API_URL=https://codersinflow.com
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Step 2: Update docker-compose.prod.yml for runtime paths
echo -e "${YELLOW}🔧 Updating docker-compose.prod.yml...${NC}"
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # Blog backend service
  blog-backend:
    container_name: codersinflow-blog-backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "127.0.0.1:8749:8749"  # Only expose to localhost
    environment:
      - MONGODB_URI=mongodb://admin:${MONGO_PASSWORD}@blog-mongodb:27017/codersblog?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - UPLOAD_DIR=/uploads
      - CORS_ORIGIN=https://codersinflow.com
      - PORT=8749
    volumes:
      - ./runtime/uploads:/uploads
    depends_on:
      - blog-mongodb
    networks:
      - blog-network

  # MongoDB for blog
  blog-mongodb:
    container_name: codersinflow-blog-mongodb
    image: mongo:7.0
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_DATABASE=codersblog
    volumes:
      - ./runtime/mongodb:/data/db
      - ./backend/scripts/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js
    networks:
      - blog-network
    command: mongod --bind_ip 0.0.0.0

networks:
  blog-network:
    driver: bridge
EOF

# Step 3: Create merged nginx configuration
echo -e "${YELLOW}📝 Creating merged nginx configuration...${NC}"
cat > nginx-merged.conf << 'EOF'
server {
    # Redirect HTTP to HTTPS
    listen 80;
    listen [::]:80;
    server_name codersinflow.com www.codersinflow.com;
    return 301 https://$host$request_uri;
}

server {
    # HTTPS configuration
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    include snippets/block-middleware-subrequest.conf;

    # Define the server names
    server_name codersinflow.com www.codersinflow.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/codersinflow.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codersinflow.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/codersinflow.com/chain.pem;

    # Recommended SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Set the root directory for the website
    root /var/www/codersinflow.com/dist;

    # Define the index files
    index index.html index.htm;

    # Add logs for debugging and access tracking
    access_log /var/log/nginx/codersinflow.com.access.log;
    error_log /var/log/nginx/codersinflow.com.error.log;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Proxy API requests to the Go backend
    location /api/ {
        proxy_pass http://localhost:8749;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Important for cookies/auth
        proxy_set_header Cookie $http_cookie;
        proxy_pass_request_headers on;
    }

    # Serve uploaded images
    location /uploads/ {
        proxy_pass http://localhost:8749;
        proxy_cache_valid 200 1d;
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }

    # Downloads directory - ensure it's accessible
    location /downloads/ {
        autoindex off;
        try_files $uri $uri/ =404;
        
        # Add headers for download files
        add_header Content-Disposition "attachment";
    }

    # Main location block for Astro/static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|vsix)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Special handling for .vsix files
        location ~* \.vsix$ {
            add_header Content-Type "application/vsix";
            add_header Content-Disposition "attachment";
        }
    }

    # Redirect www to non-www
    if ($host = www.codersinflow.com) {
        return 301 https://codersinflow.com$request_uri;
    }
}
EOF

# Step 4: Add runtime to .gitignore
echo -e "${YELLOW}📄 Updating .gitignore...${NC}"
if ! grep -q "runtime/" .gitignore 2>/dev/null; then
    echo -e "\n# Runtime data\nruntime/\n" >> .gitignore
fi

# Step 5: Backup current site
echo -e "${YELLOW}💾 Backing up current site...${NC}"
ssh -p 12222 root@ny "
    if [ -d /var/www/codersinflow.com ]; then
        cp -r /var/www/codersinflow.com /var/www/codersinflow.com.backup.\$(date +%Y%m%d_%H%M%S)
        echo '✅ Backup created'
    fi
"

# Step 6: Sync files to server
echo -e "${YELLOW}📤 Syncing files to server...${NC}"
# First sync the main codebase (excluding large directories)
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'runtime' \
    --exclude 'uploads' \
    --exclude '.env' \
    -e "ssh -p 12222" \
    . root@ny:/var/www/codersinflow.com/

# Then sync the built dist directory
rsync -avz --delete -e "ssh -p 12222" dist/ root@ny:/var/www/codersinflow.com/dist/

# Step 7: Set up server environment
echo -e "${YELLOW}🔧 Setting up server environment...${NC}"
ssh -p 12222 root@ny "
    cd /var/www/codersinflow.com
    
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
MONGODB_URI=mongodb://admin:\${MONGO_PASSWORD}@blog-mongodb:27017/codersblog?authSource=admin
EOL
        echo '✅ Environment file created'
    else
        echo '✅ Using existing environment file'
    fi
    
    # Set permissions
    chmod 600 runtime/.env
    chmod -R 755 runtime/uploads
"

# Step 8: Deploy nginx configuration
echo -e "${YELLOW}🔧 Updating nginx configuration...${NC}"
scp -P 12222 nginx-merged.conf root@ny:/tmp/codersinflow.com.nginx

ssh -p 12222 root@ny "
    # Backup existing config
    mkdir -p /etc/nginx/backups
    if [ -f /etc/nginx/sites-enabled/codersinflow.com ]; then
        cp /etc/nginx/sites-enabled/codersinflow.com /etc/nginx/backups/codersinflow.com.backup.\$(date +%Y%m%d_%H%M%S)
        echo '✅ Backed up existing nginx config'
    fi
    
    # Copy new config
    cp /tmp/codersinflow.com.nginx /etc/nginx/sites-enabled/codersinflow.com
    
    # Test nginx config
    nginx -t
    if [ \$? -eq 0 ]; then
        echo '✅ Nginx config test passed'
        systemctl reload nginx
        echo '✅ Nginx reloaded successfully'
    else
        echo '❌ Nginx config test failed! Rolling back...'
        LATEST_BACKUP=\$(ls -t /etc/nginx/backups/codersinflow.com.backup.* 2>/dev/null | head -n1)
        if [ -f \"\$LATEST_BACKUP\" ]; then
            cp \"\$LATEST_BACKUP\" /etc/nginx/sites-enabled/codersinflow.com
            systemctl reload nginx
            echo '✅ Restored from backup'
        fi
        exit 1
    fi
    
    rm /tmp/codersinflow.com.nginx
"

# Step 9: Start Docker containers
echo -e "${YELLOW}🐳 Starting Docker containers...${NC}"
ssh -p 12222 root@ny "
    cd /var/www/codersinflow.com
    
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

# Step 10: Install Node dependencies
echo -e "${YELLOW}📦 Installing Node dependencies...${NC}"
ssh -p 12222 root@ny "
    cd /var/www/codersinflow.com
    npm install --production --omit=dev
    echo '✅ Dependencies installed'
"

# Step 11: Create systemd services for auto-start
echo -e "${YELLOW}🔧 Setting up systemd services...${NC}"
ssh -p 12222 root@ny "
    cat > /etc/systemd/system/codersinflow-blog.service << 'EOL'
[Unit]
Description=Codersinflow Blog Backend
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/codersinflow.com
EnvironmentFile=/var/www/codersinflow.com/runtime/.env
ExecStart=/usr/bin/docker compose -f /var/www/codersinflow.com/docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f /var/www/codersinflow.com/docker-compose.prod.yml down
StandardOutput=journal

[Install]
WantedBy=multi-user.target
EOL

    # Create Astro frontend service
    cat > /etc/systemd/system/codersinflow-astro.service << 'EOL'
[Unit]
Description=Codersinflow Astro Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/codersinflow.com
Environment="PORT=4321"
Environment="HOST=0.0.0.0"
Environment="PUBLIC_API_URL=https://codersinflow.com"
ExecStart=/usr/bin/node /var/www/codersinflow.com/dist/server/entry.mjs
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOL

    systemctl daemon-reload
    systemctl enable codersinflow-blog.service
    systemctl enable codersinflow-astro.service
    
    # Start/restart services
    systemctl restart codersinflow-astro.service
    
    echo '✅ Systemd services created and enabled'
"

# Step 12: Verify deployment
echo -e "${YELLOW}🧪 Verifying deployment...${NC}"
ssh -p 12222 root@ny "
    cd /var/www/codersinflow.com
    
    # Check Docker containers
    echo '🐳 Docker container status:'
    docker compose -f docker-compose.prod.yml --env-file runtime/.env ps
    
    # Check if backend is responding
    echo -e '\n🔍 Testing backend API...'
    curl -s -o /dev/null -w '%{http_code}' http://localhost:8749/api/health || echo 'Backend not responding yet'
    
    # Check nginx
    echo -e '\n🌐 Nginx status:'
    systemctl status nginx --no-pager | head -5
    
    # Check Astro frontend
    echo -e '\n🚀 Astro frontend status:'
    systemctl status codersinflow-astro --no-pager | head -5
"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}🌐 Site deployed to https://codersinflow.com${NC}"
echo ""
echo -e "${YELLOW}📌 Important notes:${NC}"
echo "   - Backend API: https://codersinflow.com/api/"
echo "   - Admin panel: https://codersinflow.com/editor"
echo "   - MongoDB data: /var/www/codersinflow.com/runtime/mongodb/"
echo "   - Uploads: /var/www/codersinflow.com/runtime/uploads/"
echo ""
echo -e "${YELLOW}🧪 Test URLs:${NC}"
echo "   https://codersinflow.com - Homepage"
echo "   https://codersinflow.com/blog - Blog"
echo "   https://codersinflow.com/docs - Documentation"
echo "   https://codersinflow.com/api/posts - API endpoint"