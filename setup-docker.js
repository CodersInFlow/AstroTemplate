#!/usr/bin/env node

/**
 * Docker Setup Script
 * Reads site.config.json and generates all Docker configurations dynamically
 * Nothing is hardcoded - everything comes from the config
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read site.config.json
const configPath = path.join(__dirname, 'site.config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ site.config.json not found! This file is required.');
  console.error('Please create site.config.json with your configuration.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('🚀 Setting up Docker configuration from site.config.json...');
console.log(`📦 Site: ${config.site.displayName} (${config.site.domain})`);

// Generate docker-compose.dev.yml
const dockerComposeDev = `# AUTO-GENERATED FROM site.config.json - DO NOT EDIT DIRECTLY
# Run setup-docker.js to regenerate this file
version: '3.8'

services:
  # Frontend and Backend development container
  ${config.site.name}-dev:
    container_name: ${config.site.name}-dev
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "${config.development.frontend.port}:${config.development.frontend.port}"  # Frontend dev server
      - "${config.development.backend.port}:${config.development.backend.port}"  # Backend API
    env_file:
      - .env.development
    volumes:
      # Mount source code for hot reloading
      - .:/app
      - node_modules:/app/node_modules
      - go_modules:/root/go
      - ./uploads:/app/uploads
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://admin:devpassword@mongodb:27017/${config.database.name}?authSource=admin
      - JWT_SECRET=\${JWT_SECRET:-devsecret123}
      - PUBLIC_API_URL=http://127.0.0.1:${config.development.backend.port}
      - VITE_API_URL=http://127.0.0.1:${config.development.backend.port}
      - CORS_ORIGIN=http://127.0.0.1:${config.development.frontend.port}
      - PORT=${config.development.backend.port}
      - FRONTEND_PORT=${config.development.frontend.port}
    depends_on:
      mongodb:
        condition: service_healthy
    stdin_open: true
    tty: true

  # MongoDB for development
  mongodb:
    image: mongo:7.0
    container_name: ${config.site.name}-mongodb-dev
    ports:
      - "${config.development.mongodb.port}:27017"  # Expose MongoDB
    volumes:
      - mongodb_data_dev:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=devpassword
      - MONGO_INITDB_DATABASE=${config.database.name}
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  mongodb_data_dev:
  node_modules:
  go_modules:
`;

fs.writeFileSync('docker-compose.dev.yml', dockerComposeDev);
console.log('✅ Generated docker-compose.dev.yml');

// Generate docker-compose.production.yml
const dockerComposeProd = `# AUTO-GENERATED FROM site.config.json - DO NOT EDIT DIRECTLY
# Run setup-docker.js to regenerate this file
version: '3.8'

services:
  ${config.site.name}:
    container_name: ${config.site.name}
    image: \${DOCKER_USERNAME}/${config.site.name}:latest
    ports:
      - "127.0.0.1:${config.ports.backend}:${config.ports.backend}"  # Backend API port
      - "127.0.0.1:${config.ports.frontend}:${config.ports.frontend}"  # Frontend port
    env_file:
      - .env.production
    restart: unless-stopped
    volumes:
      # Persistent data
      - ${config.deployment.server.path}/data/db:/data/db
      - ${config.deployment.server.path}/uploads:/app/uploads
      - ${config.deployment.server.path}/logs:/var/log/supervisor
      
      # SSL certificates
      - /etc/letsencrypt:/etc/letsencrypt:ro
      
    environment:
      - NODE_ENV=production
      - MONGO_PASSWORD=\${MONGO_PASSWORD}
      - MONGODB_URI=mongodb://admin:\${MONGO_PASSWORD}@127.0.0.1:27017/${config.database.name}?authSource=admin
      - JWT_SECRET=\${JWT_SECRET}
      - DOMAIN=\${DOMAIN}
      - PUBLIC_API_URL=https://\${DOMAIN}
      - PORT=${config.ports.backend}
      - FRONTEND_PORT=${config.ports.frontend}
      
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${config.ports.backend}/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 120s
      
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        
    networks:
      - web

networks:
  web:
    driver: bridge
`;

fs.writeFileSync('docker-compose.production.yml', dockerComposeProd);
console.log('✅ Generated docker-compose.production.yml');

// Generate .env.development
const envDevelopment = `# AUTO-GENERATED FROM site.config.json - DO NOT EDIT DIRECTLY
# Run setup-docker.js to regenerate this file

# Development environment variables
# IMPORTANT: Always use 127.0.0.1 instead of localhost to avoid IPv6 conflicts
PUBLIC_API_URL=http://127.0.0.1:${config.development.backend.port}
`;

fs.writeFileSync('.env.development', envDevelopment);
console.log('✅ Generated .env.development');

// Generate dev-startup.sh with correct ports
const devStartup = `#!/bin/sh
# AUTO-GENERATED FROM site.config.json - DO NOT EDIT DIRECTLY
set -e

echo "Starting development environment initialization..."

# Build and run init-admin to create admin user from site.config.json
echo "Checking for admin user setup..."
cd /app/backend

# Always rebuild init-admin to ensure correct architecture
echo "Building init-admin..."
go build -o init-admin cmd/init-admin/main.go

# Run init-admin to create/update admin user
echo "Initializing admin user from site.config.json..."
./init-admin || echo "Admin initialization completed or skipped"

# Return to app root
cd /app

# Start both frontend and backend in parallel (using ports from site.config.json)
echo "Starting frontend and backend development servers..."
echo "Frontend on port ${config.development.frontend.port}, Backend on port ${config.development.backend.port} (from site.config.json)"
npm run dev -- --host 0.0.0.0 --port ${config.development.frontend.port} &
cd backend && air
`;

fs.writeFileSync('docker/dev-startup.sh', devStartup);
console.log('✅ Generated docker/dev-startup.sh');

// Update backend .air.toml with correct port
const airToml = `# AUTO-GENERATED FROM site.config.json - DO NOT EDIT DIRECTLY
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ./cmd/server"
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata", "uploads"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  post_cmd = []
  pre_cmd = []
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true

[env]
  PORT = "${config.development.backend.port}"
`;

fs.writeFileSync('backend/.air.toml', airToml);
console.log('✅ Generated backend/.air.toml');

// Generate nginx config for production
const nginxConfig = `# AUTO-GENERATED FROM site.config.json - DO NOT EDIT DIRECTLY
# Nginx configuration for ${config.site.domain}

upstream ${config.site.name}_backend {
    server 127.0.0.1:${config.ports.backend};
}

upstream ${config.site.name}_frontend {
    server 127.0.0.1:${config.ports.frontend};
}

server {
    listen 80;
    listen [::]:80;
    server_name ${config.site.domain} www.${config.site.domain};

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${config.site.domain} www.${config.site.domain};

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/${config.site.domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${config.site.domain}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API routes - proxy to backend
    location /api {
        proxy_pass http://${config.site.name}_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for long-running requests
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # Uploads directory
    location /uploads {
        alias ${config.deployment.server.path}/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend - proxy to Astro
    location / {
        proxy_pass http://${config.site.name}_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype;

    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|otf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logging
    access_log /var/log/nginx/${config.site.name}_access.log;
    error_log /var/log/nginx/${config.site.name}_error.log;

    client_max_body_size 100M;
}
`;

fs.writeFileSync(`nginx/${config.site.domain}.conf`, nginxConfig);
console.log(`✅ Generated nginx/${config.site.domain}.conf`);

console.log('\n✨ Docker setup complete!');
console.log('\n📋 Configuration Summary:');
console.log(`  Site Name: ${config.site.displayName}`);
console.log(`  Domain: ${config.site.domain}`);
console.log(`  Admin Email: ${config.admin.email}`);
console.log('\n🔌 Development Ports:');
console.log(`  Frontend: ${config.development.frontend.port}`);
console.log(`  Backend: ${config.development.backend.port}`);
console.log(`  MongoDB: ${config.development.mongodb.port}`);
console.log('\n🔌 Production Ports:');
console.log(`  Frontend: ${config.ports.frontend}`);
console.log(`  Backend: ${config.ports.backend}`);
console.log(`  MongoDB: ${config.ports.mongodb}`);
console.log('\n🚀 Next Steps:');
console.log('  Development: docker-compose -f docker-compose.dev.yml up');
console.log('  Production: ./deploy-docker.sh');