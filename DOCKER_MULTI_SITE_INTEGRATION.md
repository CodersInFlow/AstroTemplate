# Docker Multi-Site Integration

## How It Works with Your Current Docker System

### Routing Strategy: Domain-Based with Host Header

The system routes based on the **Host header** (domain name) in the HTTP request:

```
Request: codersinflow.com → Host: codersinflow.com → Serve codersinflow frontend
Request: darkflows.com → Host: darkflows.com → Serve darkflows frontend
```

## Architecture Overview

```
                    Internet
                        ↓
                  [Host Nginx]
                        ↓
            Reads Host header (domain)
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
   /api/* requests                 /* frontend requests
        ↓                               ↓
  [Shared Backend Container]     [Frontend Container]
     port 8000                    port 3000 (internal)
                                        ↓
                              Serves files from:
                           /sites/{domain}/dist/
```

## Docker Structure

### Option 1: Single Smart Frontend Container (RECOMMENDED)

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  # Shared backend - ONE for all sites
  backend:
    container_name: shared-backend
    image: ${DOCKER_USERNAME}/shared-backend:latest
    ports:
      - "127.0.0.1:8000:8000"
    environment:
      - MULTI_TENANT=true
      - MONGODB_URI=mongodb://mongodb:27017
    volumes:
      - uploads:/app/uploads
      - ./backend/site.config.json:/app/site.config.json
    networks:
      - internal

  # MongoDB - shared
  mongodb:
    container_name: shared-mongo
    image: mongo:7.0
    volumes:
      - mongo-data:/data/db
    networks:
      - internal

  # Single frontend container serving all sites
  frontend:
    container_name: multi-frontend
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - ./frontends:/sites:ro
      - ./sites-config.json:/app/sites-config.json:ro
    environment:
      - NODE_ENV=production
    networks:
      - internal

networks:
  internal:
    driver: bridge

volumes:
  mongo-data:
  uploads:
```

### Dockerfile for Multi-Site Frontend

```dockerfile
# Dockerfile.frontend
FROM node:20-alpine AS builder

WORKDIR /build

# Copy all frontend directories
COPY frontends/ /build/sites/
COPY shared/components /build/shared/components

# Build each site
RUN for dir in /build/sites/*/; do \
      echo "Building $(basename $dir)..."; \
      cd "$dir" && npm ci && npm run build; \
    done

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install production server
RUN npm install express compression

# Copy built sites
COPY --from=builder /build/sites/*/dist /app/sites/

# Copy server script
COPY docker/frontend-server.js /app/server.js
COPY sites-config.json /app/

EXPOSE 3000

CMD ["node", "server.js"]
```

### Frontend Server that Routes by Domain

```javascript
// docker/frontend-server.js
const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
app.use(compression());

// Load sites configuration
const sitesConfig = JSON.parse(
  fs.readFileSync('/app/sites-config.json', 'utf8')
);

// Middleware to serve correct site based on domain
app.use((req, res, next) => {
  const hostname = req.hostname || req.headers.host?.split(':')[0];
  console.log(`Request for domain: ${hostname}`);
  
  // Find site configuration
  const siteConfig = sitesConfig[hostname] || sitesConfig['default'];
  
  if (!siteConfig) {
    return res.status(404).send('Site not found');
  }
  
  // Path to this site's built files
  const sitePath = path.join('/app/sites', siteConfig.directory, 'dist');
  
  // Check if site exists
  if (!fs.existsSync(sitePath)) {
    console.error(`Site path not found: ${sitePath}`);
    return res.status(404).send('Site not configured');
  }
  
  // Serve static files for this domain
  express.static(sitePath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      // Set cache headers based on file type
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (filePath.match(/\.(js|css)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  })(req, res, () => {
    // For SPAs, serve index.html for client-side routing
    res.sendFile(path.join(sitePath, 'index.html'));
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', sites: Object.keys(sitesConfig) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Multi-site server running on port ${PORT}`);
  console.log('Configured sites:', Object.keys(sitesConfig));
});
```

### Sites Configuration

```json
// sites-config.json
{
  "codersinflow.com": {
    "directory": "codersinflow.com",
    "api": "http://backend:8000",
    "features": ["blog", "auth", "payments"]
  },
  "www.codersinflow.com": {
    "directory": "codersinflow.com",
    "api": "http://backend:8000",
    "features": ["blog", "auth", "payments"]
  },
  "darkflows.com": {
    "directory": "darkflows.com",
    "api": "http://backend:8000",
    "features": ["blog", "docs"]
  },
  "clientabc.com": {
    "directory": "clientabc.com",
    "api": "http://backend:8000",
    "features": ["blog"]
  },
  "default": {
    "directory": "default",
    "api": "http://backend:8000",
    "features": []
  }
}
```

## Nginx Configuration (Host Level)

```nginx
# /etc/nginx/sites-available/multi-site.conf

# Backend API upstream
upstream shared_backend {
    server 127.0.0.1:8000;
}

# Frontend upstream
upstream frontend_server {
    server 127.0.0.1:3000;
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

# HTTPS server block - handles ALL domains
server {
    listen 443 ssl http2;
    server_name _; # Accepts any domain
    
    # Use SNI for SSL certificates
    ssl_certificate /etc/letsencrypt/live/$ssl_server_name/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$ssl_server_name/privkey.pem;
    
    # API routes - same for all sites
    location /api {
        proxy_pass http://shared_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Tenant-Domain $host;
        
        # Add tenant identification
        proxy_set_header X-Tenant-Id $host;
    }
    
    # Uploads - shared across all sites
    location /uploads {
        alias /var/www/shared/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Frontend - the frontend server handles routing internally
    location / {
        proxy_pass http://frontend_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
    
    client_max_body_size 100M;
}
```

## Build and Deploy Scripts

### Build All Sites

```bash
#!/bin/bash
# build-all-sites.sh

echo "Building all frontend sites..."

for dir in frontends/*/; do
    site=$(basename "$dir")
    echo "Building $site..."
    
    cd "$dir"
    npm ci
    npm run build
    cd ../..
    
    echo "✓ $site built successfully"
done

echo "All sites built!"
```

### Deploy Script

```bash
#!/bin/bash
# deploy-multi-site.sh

# Build Docker images
echo "Building Docker images..."
docker build -t shared-backend:latest ./shared/backend
docker build -f Dockerfile.frontend -t multi-frontend:latest .

# Tag and push to Docker Hub
docker tag shared-backend:latest $DOCKER_USERNAME/shared-backend:latest
docker tag multi-frontend:latest $DOCKER_USERNAME/multi-frontend:latest

docker push $DOCKER_USERNAME/shared-backend:latest
docker push $DOCKER_USERNAME/multi-frontend:latest

# On production server
ssh $PRODUCTION_SERVER << 'EOF'
    cd /var/www/multi-site
    docker-compose pull
    docker-compose up -d
EOF

echo "Deployment complete!"
```

## Option 2: Separate Frontend Containers Per Site

If you prefer complete isolation:

```yaml
# docker-compose.multi.yml
version: '3.8'

services:
  # Shared backend
  backend:
    image: ${DOCKER_USERNAME}/shared-backend:latest
    ports:
      - "127.0.0.1:8000:8000"
    networks:
      - backend

  # Individual frontend containers
  frontend-codersinflow:
    image: ${DOCKER_USERNAME}/codersinflow-frontend:latest
    ports:
      - "127.0.0.1:3001:3000"
    networks:
      - backend

  frontend-darkflows:
    image: ${DOCKER_USERNAME}/darkflows-frontend:latest
    ports:
      - "127.0.0.1:3002:3000"
    networks:
      - backend

  frontend-clientabc:
    image: ${DOCKER_USERNAME}/clientabc-frontend:latest
    ports:
      - "127.0.0.1:3003:3000"
    networks:
      - backend

networks:
  backend:
    driver: bridge
```

Then nginx routes to different ports based on domain:

```nginx
# Map domains to backend ports
map $host $frontend_port {
    codersinflow.com 3001;
    www.codersinflow.com 3001;
    darkflows.com 3002;
    www.darkflows.com 3002;
    clientabc.com 3003;
    default 3001;
}

server {
    listen 443 ssl http2;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:$frontend_port;
        proxy_set_header Host $host;
    }
}
```

## Development Workflow

```bash
# Local development for specific site
cd frontends/codersinflow.com
npm run dev

# Test with custom host header
curl -H "Host: darkflows.com" http://localhost:3000

# Add new site
./scripts/create-site.sh newclient.com

# Build and test locally
docker-compose -f docker-compose.dev.yml up

# Deploy to production
./deploy-multi-site.sh
```

## Adding a New Site

1. **Create frontend directory**:
```bash
cp -r templates/default frontends/newsite.com
cd frontends/newsite.com
npm install
```

2. **Add to sites-config.json**:
```json
{
  "newsite.com": {
    "directory": "newsite.com",
    "api": "http://backend:8000"
  }
}
```

3. **Add SSL certificate**:
```bash
certbot certonly --webroot -w /var/www/certbot \
  -d newsite.com -d www.newsite.com
```

4. **Rebuild and deploy**:
```bash
./build-all-sites.sh
./deploy-multi-site.sh
```

## Advantages of This Setup

1. **Single Backend Container** - Saves resources
2. **Domain-Based Routing** - Clean and simple
3. **Hot-Swappable Sites** - Add/remove without affecting others
4. **Shared Resources** - MongoDB, uploads, API
5. **Independent Frontends** - Each site fully customizable
6. **Easy SSL Management** - Nginx handles all certificates
7. **Cost Effective** - One server can handle many sites

## Resource Usage Comparison

| Setup | Containers | RAM Usage | Complexity |
|-------|------------|-----------|------------|
| Current (separate) | 2 per site | ~500MB per site | Low |
| Modular (shared backend) | 1 + frontends | ~200MB + 100MB per site | Medium |
| Single smart container | 2 total | ~300MB total | Low |

The routing is based on the **HTTP Host header** which nginx and the frontend server read to determine which site to serve. This is how virtual hosting has worked for decades and is very reliable!