# Multi-Tenant Setup Guide

This branch implements a multi-tenant architecture where multiple sites share the same backend but have completely different frontends and databases.

## Architecture Overview

```
Single Docker Container
├── MongoDB (all tenant databases)
├── Backend API (Go - handles all sites)
├── Frontend Server (Node.js - routes by domain)
└── Supervisor (manages all processes)
```

## Features

✅ **Single Container** - Everything runs in one Docker container
✅ **Domain-Based Routing** - Sites are served based on the Host header
✅ **Separate Databases** - Each site has its own MongoDB database
✅ **Independent Themes** - Each site has its own Tailwind config and styles
✅ **Shared Backend** - One backend API serves all sites
✅ **Site-Aware Components** - Components adapt to the current site

## Quick Start

### 1. Build Frontend Sites

```bash
# Build codersinflow.com
cd frontends/codersinflow.com
npm install
npm run build
cd ../..

# Build darkflows.com
cd frontends/darkflows.com
npm install
npm run build
cd ../..
```

### 2. Run Development Server

```bash
# Install dependencies
npm install express

# Run multi-tenant dev server
node scripts/dev-multi-tenant.js
```

Visit:
- http://localhost:3000/?site=codersinflow
- http://localhost:3000/?site=darkflows

### 3. Build Docker Container

```bash
# Run the build script
./scripts/build-multi-tenant.sh

# Or manually:
docker build -f Dockerfile.multi-tenant -t multi-site-app:latest .
```

### 4. Run with Docker Compose

```bash
docker-compose -f docker-compose.multi-tenant.yml up
```

## Directory Structure

```
frontends/
├── codersinflow.com/     # Coders in Flow site
│   ├── src/
│   ├── tailwind.config.js  # Blue theme
│   └── package.json
├── darkflows.com/        # Dark Flows site
│   ├── src/
│   ├── tailwind.config.js  # Red theme
│   └── package.json
└── default/              # Default landing page
    └── index.html

backend/
├── internal/
│   ├── middleware/
│   │   └── tenant.go    # Multi-tenant middleware
│   └── database/
│       └── tenant.go    # Tenant DB management
└── cmd/server/main.go

docker/
├── server.js            # Frontend routing server
└── supervisord-multi.conf  # Process manager config
```

## Configuration

### sites-config.json

Defines all sites and their configurations:

```json
{
  "codersinflow.com": {
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
  }
}
```

## Adding a New Site

1. **Create site directory**:
```bash
cp -r frontends/codersinflow.com frontends/newsite.com
```

2. **Customize theme** in `tailwind.config.js` and `global.css`

3. **Add to sites-config.json**:
```json
"newsite.com": {
  "id": "newsite",
  "directory": "newsite.com",
  "database": "newsite_db",
  "theme": "custom"
}
```

4. **Build and deploy**:
```bash
cd frontends/newsite.com
npm install
npm run build
cd ../..
./scripts/build-multi-tenant.sh
```

## Testing Locally

### Option 1: Query Parameters
```
http://localhost:3000/?site=codersinflow
http://localhost:3000/?site=darkflows
```

### Option 2: Edit /etc/hosts
Add to `/etc/hosts`:
```
127.0.0.1  codersinflow.local
127.0.0.1  darkflows.local
```

Then visit:
- http://codersinflow.local:3000
- http://darkflows.local:3000

## Production Deployment

1. **Build the container**:
```bash
docker build -f Dockerfile.multi-tenant -t multi-site-app:latest .
```

2. **Push to registry**:
```bash
docker tag multi-site-app:latest your-registry/multi-site-app:latest
docker push your-registry/multi-site-app:latest
```

3. **Deploy with docker-compose**:
```bash
docker-compose -f docker-compose.multi-tenant.yml up -d
```

4. **Configure nginx** on host to proxy to container port 80

## Site Isolation

Each site directory is completely self-contained:
- ✅ Own Tailwind configuration
- ✅ Own CSS variables
- ✅ Own React components
- ✅ Own build process
- ✅ Own package.json

Clients can be given access to ONLY their site directory and can modify everything about their site's appearance without affecting other sites or the backend.

## Environment Variables

- `NODE_ENV` - Set to "production" for production builds
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGODB_URI` - MongoDB connection string (uses local by default)
- `CORS_ORIGIN` - Allowed CORS origins (set to * for multi-tenant)

## Monitoring

Check health:
```bash
curl http://localhost/health
```

View logs:
```bash
docker-compose -f docker-compose.multi-tenant.yml logs -f
```

Access supervisor:
```bash
docker exec -it multi-site-app supervisorctl status
```

## Troubleshooting

**Site not loading?**
- Check sites-config.json has your domain
- Ensure site is built (check frontends/*/dist)
- Check docker logs for errors

**MongoDB connection issues?**
- Ensure MongoDB is running in container
- Check supervisor logs: `/var/log/supervisor/mongodb.log`

**Backend API errors?**
- Check backend logs: `/var/log/supervisor/backend.log`
- Verify tenant middleware is working

## Next Steps

- [ ] Add SSL/HTTPS support
- [ ] Implement caching layer
- [ ] Add CDN integration
- [ ] Create admin panel for site management
- [ ] Add automated backups
- [ ] Implement rate limiting per tenant