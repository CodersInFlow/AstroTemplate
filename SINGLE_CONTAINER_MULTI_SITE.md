# Single Container Multi-Site Architecture

## Everything in ONE Container!

```
     [Single Docker Container]
              |
    ┌─────────┴─────────┐
    │                   │
[Backend API]    [Frontend Server]
    │                   │
    └─────────┬─────────┘
              │
        [MongoDB]
              │
     Serves based on domain
```

## The Dockerfile - One Container to Rule Them All

```dockerfile
# Dockerfile.all-in-one
FROM node:20-alpine AS builder

WORKDIR /build

# Copy all frontends
COPY frontends/ /build/frontends/
COPY shared/ /build/shared/

# Build all frontend sites
RUN for dir in /build/frontends/*/; do \
      echo "Building $(basename $dir)..."; \
      cd "$dir" && npm ci && npm run build; \
    done

# Build backend
COPY backend/ /build/backend/
WORKDIR /build/backend
RUN go build -o server cmd/main.go

# Runtime stage
FROM ubuntu:22.04

# Install Node.js, MongoDB, Supervisor
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
       gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor \
    && echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
       tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && apt-get clean

WORKDIR /app

# Copy built frontends
COPY --from=builder /build/frontends/*/dist /app/sites/

# Copy backend
COPY --from=builder /build/backend/server /app/backend/server

# Copy configuration
COPY docker/supervisord-multi.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/server.js /app/server.js
COPY sites-config.json /app/sites-config.json

# Create directories
RUN mkdir -p /data/db /app/uploads /var/log/supervisor

EXPOSE 80 443

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

## Supervisor Configuration - Managing All Services

```ini
# docker/supervisord-multi.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log

[program:mongodb]
command=/usr/bin/mongod --dbpath /data/db --bind_ip 127.0.0.1
priority=1
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/mongodb.log
stderr_logfile=/var/log/supervisor/mongodb-error.log

[program:backend]
command=/app/backend/server
priority=2
autostart=true
autorestart=true
environment=
    MONGO_URI="mongodb://127.0.0.1:27017",
    PORT="8000",
    MULTI_TENANT="true"
stdout_logfile=/var/log/supervisor/backend.log
stderr_logfile=/var/log/supervisor/backend-error.log

[program:frontend]
command=node /app/server.js
priority=3
autostart=true
autorestart=true
environment=
    NODE_ENV="production",
    PORT="80",
    API_URL="http://127.0.0.1:8000"
stdout_logfile=/var/log/supervisor/frontend.log
stderr_logfile=/var/log/supervisor/frontend-error.log
```

## The Smart Server - Handles Everything

```javascript
// docker/server.js
const express = require('express');
const httpProxy = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();

// Load sites configuration
const sites = JSON.parse(fs.readFileSync('/app/sites-config.json'));

// API proxy to backend
app.use('/api', httpProxy.createProxyMiddleware({
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    // Add tenant information
    proxyReq.setHeader('X-Tenant-Domain', req.hostname);
    proxyReq.setHeader('X-Tenant-Id', sites[req.hostname]?.id || 'default');
  }
}));

// Uploads - shared across all sites
app.use('/uploads', express.static('/app/uploads'));

// Frontend routing based on domain
app.use((req, res, next) => {
  const hostname = req.hostname || 'default';
  const siteConfig = sites[hostname] || sites['default'];
  
  if (!siteConfig) {
    return res.status(404).send('Site not found');
  }
  
  const sitePath = path.join('/app/sites', siteConfig.directory);
  
  // Serve site's static files
  express.static(sitePath, {
    fallthrough: false,
    index: 'index.html',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  })(req, res, (err) => {
    // For SPAs, serve index.html for any route
    if (err && err.statusCode === 404) {
      res.sendFile(path.join(sitePath, 'index.html'));
    } else {
      next(err);
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    services: {
      backend: 'running',
      mongodb: 'running',
      sites: Object.keys(sites).length
    }
  });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Multi-site server running on port ${PORT}`);
  console.log('Configured sites:', Object.keys(sites));
});
```

## Simple Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    container_name: multi-site-app
    build:
      context: .
      dockerfile: Dockerfile.all-in-one
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Persistent data
      - ./data/db:/data/db
      - ./uploads:/app/uploads
      - ./logs:/var/log/supervisor
      
      # Hot reload frontends in dev (optional)
      # - ./frontends:/app/sites-dev
      
      # SSL certificates
      - /etc/letsencrypt:/etc/letsencrypt:ro
      
    environment:
      - NODE_ENV=production
      - MONGO_PASSWORD=${MONGO_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    
    restart: unless-stopped
```

## Sites Configuration

```json
// sites-config.json
{
  "codersinflow.com": {
    "id": "codersinflow",
    "directory": "codersinflow.com",
    "database": "codersinflow_db",
    "theme": "dark-blue"
  },
  "www.codersinflow.com": {
    "id": "codersinflow",
    "directory": "codersinflow.com",
    "database": "codersinflow_db",
    "theme": "dark-blue"
  },
  "darkflows.com": {
    "id": "darkflows",
    "directory": "darkflows.com",
    "database": "darkflows_db",
    "theme": "dark-red"
  },
  "clientabc.com": {
    "id": "clientabc",
    "directory": "clientabc.com",
    "database": "clientabc_db",
    "theme": "light"
  },
  "default": {
    "id": "default",
    "directory": "default",
    "database": "default_db",
    "theme": "light"
  }
}
```

## Nginx on Host (Simple Proxy)

```nginx
# /etc/nginx/sites-available/multi-site
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name _;
    
    # SNI-based SSL
    ssl_certificate /etc/letsencrypt/live/$ssl_server_name/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$ssl_server_name/privkey.pem;
    
    # Everything goes to the container
    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 100M;
}
```

## Backend Multi-Tenant Support

```go
// backend/middleware/tenant.go
func TenantMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        domain := c.GetHeader("X-Tenant-Domain")
        tenantID := c.GetHeader("X-Tenant-Id")
        
        // Use tenant-specific database
        dbName := fmt.Sprintf("%s_db", tenantID)
        c.Set("database", dbName)
        c.Set("tenant_id", tenantID)
        c.Set("domain", domain)
        
        c.Next()
    }
}

// Use in queries
func GetPosts(c *gin.Context) {
    dbName := c.GetString("database")
    db := mongoClient.Database(dbName)
    
    collection := db.Collection("posts")
    // ... query posts for this tenant only
}
```

## Development Mode with Hot Reload

```javascript
// docker/server-dev.js
// In development, proxy to local dev servers
if (process.env.NODE_ENV === 'development') {
  const { spawn } = require('child_process');
  
  // Start dev server for requested site
  app.use((req, res, next) => {
    const site = req.hostname;
    
    if (!devServers[site]) {
      // Start dev server for this site
      devServers[site] = spawn('npm', ['run', 'dev'], {
        cwd: `/app/sites-dev/${site}`,
        env: { ...process.env, PORT: getPort() }
      });
    }
    
    // Proxy to dev server
    proxy(devServers[site].port)(req, res, next);
  });
}
```

## Deployment - Super Simple!

```bash
#!/bin/bash
# deploy.sh

# Build and push single image
docker build -f Dockerfile.all-in-one -t multi-site-app .
docker tag multi-site-app:latest $DOCKER_USERNAME/multi-site-app:latest
docker push $DOCKER_USERNAME/multi-site-app:latest

# On server
ssh $SERVER << 'EOF'
  cd /var/www/multi-site
  docker-compose pull
  docker-compose up -d
EOF
```

## Adding New Sites

1. **Add frontend directory**:
```bash
cp -r templates/default frontends/newsite.com
cd frontends/newsite.com
npm install
```

2. **Update sites-config.json**:
```json
{
  "newsite.com": {
    "id": "newsite",
    "directory": "newsite.com",
    "database": "newsite_db"
  }
}
```

3. **Rebuild container**:
```bash
docker-compose build
docker-compose up -d
```

## Advantages of Single Container

1. **Ultra Simple** - One container, one process manager
2. **Resource Efficient** - Shared Node.js runtime, shared MongoDB
3. **Easy Deployment** - One image to manage
4. **Fast Communication** - Backend/Frontend on localhost
5. **Simple Monitoring** - One container to watch
6. **Cost Effective** - Minimal resource usage

## Resource Usage

- **RAM**: ~500MB total (vs 500MB per site with separate containers)
- **CPU**: Shared efficiently
- **Storage**: One MongoDB instance, shared binaries

## File Structure

```
/app/
├── sites/                    # Built frontends
│   ├── codersinflow.com/
│   ├── darkflows.com/
│   └── clientabc.com/
├── backend/
│   └── server               # Go binary
├── uploads/                 # Shared uploads
├── server.js               # Node.js router
└── sites-config.json       # Configuration
```

## Scaling Considerations

When you outgrow single container (>50 sites):
1. Move MongoDB to separate container first
2. Then separate backend if needed
3. Finally split frontends if required

But for most use cases, this single container can handle dozens of sites efficiently!

## The Beauty of This Approach

- **No orchestration complexity**
- **No inter-container networking**
- **No port management**
- **Just one container that does everything!**

This is how many shared hosting providers work - one Apache/PHP installation serving thousands of sites. We're doing the same with modern tech!