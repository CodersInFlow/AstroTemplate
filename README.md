# Multi-Tenant Astro SSR Platform

A production-ready multi-tenant web platform built with Astro SSR, supporting unlimited sites with dynamic SSL, unified backend, and Docker deployment.

## 🚀 Features

- **Multi-tenant Architecture**: Support unlimited sites from a single codebase
- **Dynamic SSL Certificates**: Automatic SSL certificate selection based on domain
- **Unified Backend**: Shared Go backend with MongoDB for all sites
- **Docker Deployment**: Production-ready Docker setup with supervisor
- **Blacklist Support**: Exclude specific sites from deployment  
- **Quick Sync**: Update code without rebuilding Docker images
- **Site Isolation**: Each site has its own components, styles, and data

## 📁 Project Structure

```
/
├── astro-multi-tenant/      # Frontend Astro SSR application
│   ├── src/
│   │   ├── sites/          # Individual site configurations
│   │   │   ├── default/
│   │   │   ├── magicvideodownloader.com/
│   │   │   └── .template/  # Template for new sites
│   │   ├── shared/         # Shared components across sites
│   │   └── layouts/        # Shared layouts
│   └── dist/               # Built frontend files
│
├── backend/                # Go backend server
│   ├── cmd/server/         # Server entry point
│   ├── handlers/           # API handlers
│   └── models/             # Database models
│
├── nginx/                  # Nginx configurations
│   ├── sites-enabled/      # Site-specific configs
│   └── includes/           # Shared includes
│
├── scripts/                # Deployment and utility scripts
│   ├── deploy.sh           # Main deployment script
│   ├── sync-code.sh        # Quick code sync without Docker rebuild
│   ├── add-site.sh         # Add new site
│   └── build-with-blacklist.sh  # Build with site exclusions
│
├── sites-config.json       # Site configuration manifest
├── blacklist.txt           # Sites to exclude from deployment
├── Dockerfile              # Production Docker configuration
└── docker-compose.yml      # Docker compose setup
```

## 🛠️ Setup

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Go 1.21+
- MongoDB (included in Docker)

### Environment Configuration

Create a `.env` file:

```bash
# Deployment
DEPLOY_SERVER=your-server.com
DEPLOY_USER=root
DEPLOY_PORT=22
REMOTE_BASE_DIR=/var/www/docker

# Docker
DOCKER_REGISTRY=docker.io
DOCKER_USERNAME=your-username
DOCKER_IMAGE_NAME=your-username/app-name
DOCKER_CONTAINER_NAME=multi-tenant-container

# Application
PORT=4321
API_PORT=3001
MONGODB_URI=mongodb://localhost:27017/codersblog
JWT_SECRET=your-secret-key
PUBLIC_API_URL=https://your-domain.com
```

### Local Development

```bash
# Install dependencies
cd astro-multi-tenant && npm install
cd ../backend && go mod download

# Run development server
./scripts/dev.sh
```

Access sites locally:
- Site Directory: http://localhost:4321
- Magic Video: http://magicvideodownloader.localhost:4321
- Any site: http://[site-id].localhost:4321

## 🚀 Deployment

### Initial Deployment

```bash
# Deploy everything (builds Docker image, pushes, deploys)
./scripts/deploy.sh
```

This will:
1. Build Docker image with blacklist filtering
2. Push to Docker registry
3. Deploy to server
4. Setup nginx configurations
5. Start container with supervisor

### Quick Code Updates

After initial deployment, use the sync script for fast updates:

```bash
# Build in Docker locally and sync (no image push needed)
./scripts/sync-code.sh

# Skip rebuild if no code changes
./scripts/sync-code.sh --no-rebuild
```

How sync works:
1. Builds production Docker locally (linux/amd64)
2. Extracts built files to `.docker-build-output/`
3. Rsyncs those files to server at `/var/www/docker/`
4. Restarts container

## 🏗️ Adding New Sites

### Method 1: Using Script (Recommended)

```bash
./scripts/add-site.sh newsite.com
```

This will:
1. Copy template to new site directory
2. Configure site settings
3. Update sites-config.json
4. Set up both www and non-www versions

### Method 2: Manual

1. Copy the template:
```bash
cp -r astro-multi-tenant/src/sites/.template astro-multi-tenant/src/sites/newsite.com
```

2. Update `sites-config.json`:
```json
{
  "sites": [
    {
      "id": "newsite",
      "domain": "newsite.com",
      "name": "New Site",
      "api": "https://newsite.com"
    }
  ]
}
```

3. Deploy:
```bash
./scripts/deploy.sh
```

## 🔒 SSL Configuration

The system uses dynamic SSL with nginx's `$ssl_server_name` variable:

```nginx
# Automatic certificate selection based on domain
ssl_certificate /etc/letsencrypt/live/$cert_domain/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/$cert_domain/privkey.pem;
```

Features:
- Supports unlimited domains without nginx config changes
- Automatic www to non-www redirects
- HTTP to HTTPS redirects
- Fallback to default certificate if domain cert missing

Setup SSL for new domain:
```bash
certbot certonly --nginx -d newsite.com -d www.newsite.com
```

## 🚫 Blacklisting Sites

To exclude sites from deployment, add to `blacklist.txt`:

```
codersinflow
darkflows
prestongarrison
```

Then deploy normally - blacklisted sites will be excluded from the Docker image.

## 📊 Architecture

### Frontend (Astro SSR)
- Server-side rendering for SEO
- Dynamic component loading per site
- Shared components library
- Tailwind CSS with site-specific configs
- SmartLayout for automatic header detection

### Backend (Go + MongoDB)
- RESTful API with tenant isolation
- JWT authentication
- MongoDB for data persistence
- File upload handling
- Blog/content management

### Infrastructure
- Docker containerization with supervisor
- Nginx reverse proxy with dynamic SSL
- External volume mounts for data persistence
- Hybrid deployment (code in Docker, data in volumes)

## 🔄 Deployment Flow

### Production Architecture
```
Internet
   ↓
Nginx (Host)
   ├── SSL Termination (dynamic cert selection)
   ├── /api/* → localhost:3001 (Go backend)
   └── /* → localhost:4321 (Astro frontend)
        ↓
Docker Container
   ├── Supervisor (process manager)
   ├── MongoDB (localhost:27017)
   ├── Go Backend (:3001)
   └── Astro Frontend (:4321)
```

### Volume Mounts
Docker mounts these directories from `/var/www/docker/`:
- `uploads/` - User uploaded files
- `public/` - Static assets  
- `mongodb-data/` - Database files

On first run, Docker copies internal files to empty mounts.

## 📝 Scripts Reference

| Script | Purpose |
|--------|---------|
| `deploy.sh` | Full deployment with Docker build and push |
| `sync-code.sh` | Quick sync without Docker push |
| `add-site.sh` | Add new site to platform |
| `remove-site.sh` | Remove site from platform |
| `build-with-blacklist.sh` | Build Docker with site exclusions |
| `dev.sh` | Run local development environment |
| `generate-nginx-configs.sh` | Generate nginx configurations |

## 🐳 Docker Commands

```bash
# View logs
ssh user@server "docker logs magic-video-container"

# Restart container
ssh user@server "docker restart magic-video-container"

# Enter container
ssh user@server "docker exec -it magic-video-container /bin/bash"

# Check running processes
ssh user@server "docker exec magic-video-container ps aux"
```

## 🔧 Troubleshooting

### Container not starting
```bash
docker logs magic-video-container
```

### SSL certificate issues
```bash
ls /etc/letsencrypt/live/
nginx -t
```

### MongoDB connection issues
```bash
docker exec magic-video-container ps aux | grep mongo
```

### Sync not working
1. Check Docker builds locally: `docker images | grep local-build`
2. Verify extraction: `ls -la .docker-build-output/`
3. Test SSH: `ssh user@server "ls /var/www/docker"`

### Cloudflare "Too Many Redirects" Error
This happens when Cloudflare SSL mode is set incorrectly:
1. Go to Cloudflare dashboard → SSL/TLS → Overview
2. Set encryption mode to **Full (strict)** (NOT Flexible)
3. Go to SSL/TLS → Edge Certificates
4. Enable **Always Use HTTPS**

**Important**: Using "Flexible" SSL mode causes redirect loops because:
- Cloudflare connects to origin via HTTP
- Nginx redirects HTTP to HTTPS
- Creates infinite redirect loop

## 🎨 Theming System

### Semantic Color Classes

Sites use semantic Tailwind classes that map to different colors:

```css
/* Each site defines these in tailwind.config.cjs */
bg-background    /* Main background */
bg-surface       /* Card/panel background */
bg-primary       /* Primary brand color */
text-primary     /* Primary text */
text-secondary   /* Secondary text */
border-default   /* Border colors */
```

### Site Configuration

Each site has:
- `config.json` - Site metadata
- `layout.astro` - Site layout/theme
- `tailwind.config.cjs` - Color mappings
- `pages/` - Site-specific pages
- `components/` - Optional custom components

## 📦 Production Optimizations

- **Image optimization**: Compressed and resized (max 800x800)
- **Blacklist filtering**: Reduces Docker image size
- **External mounts**: Data persists across deployments
- **Supervisor**: Ensures service reliability
- **Dynamic SSL**: Supports unlimited domains
- **Build caching**: Docker layer optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Create Pull Request

## 🔐 Security

- JWT tokens for authentication
- HTTP-only cookies for sessions
- Database isolation per tenant
- Input validation and sanitization
- CORS configuration per environment
- SSL/TLS encryption in production

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Check deployment logs
- Review this documentation

---

Built with ❤️ using Astro, Go, Docker, and Nginx