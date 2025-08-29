# Multi-Tenant Blog Platform

A powerful multi-tenant blog and documentation system that can host multiple sites from a single codebase. Each site has its own frontend, theme, and database while sharing the same backend infrastructure.

## 🎯 Architecture Overview

This platform supports two deployment modes:

1. **Single-Site Mode** (Original) - Traditional deployment for one website
2. **Multi-Tenant Mode** (New) - Host multiple websites with different domains

```
Multi-Tenant Architecture:
├── Single Docker Container
│   ├── MongoDB (all tenant databases)
│   ├── Go Backend API (serves all sites)
│   ├── Node.js Frontend Server (routes by domain)
│   └── Supervisor (manages all processes)
```

## 🚀 Quick Start

### For Multi-Tenant Development

```bash
# 1. Clone and switch to multi-tenant branch
git checkout multi-tenant

# 2. Start development server with test interface
./dev-multi-tenant.sh test

# 3. Visit test URLs:
# http://localhost:3000/?site=codersinflow
# http://localhost:3000/?site=darkflows
```

### For Single-Site Development (Original)

```bash
# Start development environment
./dev.sh up

# Visit: http://localhost:3000
```

## 📁 Project Structure

```
.
├── frontends/                    # Multi-tenant frontend directories
│   ├── codersinflow.com/        # Each site is self-contained
│   │   ├── src/                 # Site-specific components
│   │   ├── tailwind.config.js   # Site-specific theme
│   │   └── package.json         # Site dependencies
│   ├── darkflows.com/           # Another site with different theme
│   └── default/                 # Default landing page
│
├── backend/                      # Shared Go backend
│   ├── cmd/server/              # Server entry point
│   └── internal/
│       ├── middleware/tenant.go # Multi-tenant routing
│       └── database/tenant.go   # Per-tenant databases
│
├── docker/                       # Docker configurations
│   ├── server.js                # Smart routing server
│   └── supervisord-multi.conf   # Process management
│
├── sites-config.json            # Multi-tenant configuration
└── site.config.json             # Single-site configuration
```

## 🛠️ Development Scripts

### Multi-Tenant Scripts

| Script | Description |
|--------|-------------|
| `./dev-multi-tenant.sh test` | Start test server with domain simulation |
| `./dev-multi-tenant.sh build [site]` | Build specific site or all sites |
| `./dev-multi-tenant.sh add-site <name>` | Create new site from template |
| `./dev-multi-tenant.sh list` | List all configured sites |
| `./dev-multi-tenant.sh docker-build` | Build Docker container |
| `./dev-multi-tenant.sh docker-up` | Run Docker container |

### Original Scripts (Still Work!)

| Script | Description |
|--------|-------------|
| `./dev.sh up` | Start single-site dev environment |
| `./build-docker.sh` | Build single-site Docker image |
| `./deploy.sh` | Deploy single site to server |

## 🎨 Adding a New Site

### 1. Create Site Directory

```bash
./dev-multi-tenant.sh add-site clientabc.com
```

### 2. Configure Site in `sites-config.json`

```json
{
  "clientabc.com": {
    "id": "clientabc",
    "directory": "clientabc.com",
    "database": "clientabc_db",
    "theme": "custom"
  }
}
```

### 3. Customize Theme

Edit `frontends/clientabc.com/tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color',
  // ... custom theme colors
}
```

Edit `frontends/clientabc.com/src/styles/global.css`:
```css
:root {
  --primary: 123 45 67; /* RGB values */
  --background: 0 0 0;
  /* ... custom CSS variables */
}
```

### 4. Build and Test

```bash
# Build the site
./dev-multi-tenant.sh build clientabc.com

# Test locally
./dev-multi-tenant.sh test
# Visit: http://localhost:3000/?site=clientabc
```

## 🐳 Docker Deployment

### Multi-Tenant Deployment

```bash
# Build multi-tenant container
./build-docker-multi-tenant.sh

# Run with docker-compose
docker-compose -f docker-compose.multi-tenant.yml up -d

# Or run directly
docker run -p 80:80 -p 443:443 multi-site-app:latest
```

### Single-Site Deployment (Original)

```bash
# Build and deploy
./build-docker.sh
./deploy-docker.sh
```

## 🔧 Configuration Files

### Multi-Tenant: `sites-config.json`

Defines all sites and their routing:
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

### Single-Site: `site.config.json`

Traditional configuration for single deployment:
```json
{
  "site": {
    "name": "codersinflow",
    "domain": "codersinflow.com"
  },
  "ports": {
    "frontend": 4916,
    "backend": 8752
  }
}
```

## 🌐 Production Setup

### Domain Configuration

1. **Add to Nginx (Host Level)**:
```nginx
server {
    listen 443 ssl http2;
    server_name codersinflow.com darkflows.com;
    
    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
    }
}
```

2. **SSL Certificates**:
```bash
certbot certonly --webroot -w /var/www/certbot \
  -d codersinflow.com -d www.codersinflow.com \
  -d darkflows.com -d www.darkflows.com
```

## 📊 Features by Mode

| Feature | Single-Site | Multi-Tenant |
|---------|------------|--------------|
| Blog System | ✅ | ✅ |
| Rich Text Editor | ✅ | ✅ |
| Image Uploads | ✅ | ✅ |
| Authentication | ✅ | ✅ |
| Multiple Themes | ❌ | ✅ |
| Separate Databases | ❌ | ✅ |
| Domain Routing | ❌ | ✅ |
| Client Isolation | ❌ | ✅ |
| Single Container | ✅ | ✅ |

## 🔒 Site Isolation

Each site in multi-tenant mode is completely isolated:
- ✅ Own Tailwind configuration
- ✅ Own CSS variables and styles
- ✅ Own React/Astro components
- ✅ Own MongoDB database
- ✅ Own build process
- ✅ Can be given to clients without exposing other sites

## 🧪 Testing Multi-Tenant Locally

### Option 1: Query Parameters (Easiest)
```bash
./dev-multi-tenant.sh test
# Visit: http://localhost:3000/?site=codersinflow
```

### Option 2: Edit /etc/hosts
```bash
# Add to /etc/hosts:
127.0.0.1  codersinflow.local darkflows.local

# Visit:
http://codersinflow.local:3000
http://darkflows.local:3000
```

## 📝 Environment Variables

### Multi-Tenant Mode
- `NODE_ENV` - production/development
- `JWT_SECRET` - Secret for JWT tokens
- `MONGODB_URI` - MongoDB connection (uses local by default)
- `SITES_CONFIG_PATH` - Path to sites-config.json

### Single-Site Mode
- `MONGO_PASSWORD` - MongoDB password
- `JWT_SECRET` - JWT secret
- `DOMAIN` - Your domain name
- `PUBLIC_API_URL` - API URL for frontend

## 🚧 Troubleshooting

### Site Not Loading?
```bash
# Check if site is configured
cat sites-config.json | grep "yoursite"

# Check if site is built
ls frontends/yoursite.com/dist/

# Check Docker logs
docker-compose -f docker-compose.multi-tenant.yml logs
```

### MongoDB Connection Issues?
```bash
# Check MongoDB status in container
docker exec -it multi-site-app supervisorctl status mongodb

# View MongoDB logs
docker exec -it multi-site-app tail -f /var/log/supervisor/mongodb.log
```

### Build Errors?
```bash
# Clean and rebuild
./dev-multi-tenant.sh clean
./dev-multi-tenant.sh build
```

## 📚 Documentation

- [Multi-Tenant Setup Guide](MULTI_TENANT_README.md)
- [Docker Integration](DOCKER_MULTI_SITE_INTEGRATION.md)
- [Component System](MODULAR_COMPONENT_SYSTEM.md)
- [Site Access Control](SITE_ACCESS_CONTROL.md)
- [Architecture Overview](MODULAR_MULTI_TENANT_ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues or questions:
- Check the [troubleshooting section](#-troubleshooting)
- Review the [documentation](#-documentation)
- Open an issue on GitHub

---

Built with ❤️ using Astro, Go, MongoDB, and Docker