# Multi-Tenant SaaS Blog Platform

A production-ready multi-tenant architecture for hosting multiple websites/blogs from a single Docker container with domain-based routing, CORS support, and comprehensive site management.

## 🎯 Architecture Overview

This is the **multi-tenant branch** - a complete SaaS platform for hosting multiple websites with different domains from a single deployment.

> **Note**: For single-site deployment, use the `main` branch which has the traditional single-site setup.

```
Multi-Tenant Architecture:
Internet → Cloudflare → Nginx (80/443) → Docker Container (8000)
                              ↓
                    Reads Host header & routes to:
                    - codersinflow.com → codersinflow frontend
                    - darkflows.com → darkflows frontend  
                    - yourdomain.com → your frontend
```

## 🚀 Quick Start

### Interactive Site Management
```bash
# Launch interactive site manager
npm run site:manage
# OR
./scripts/manage-sites.sh
```

### Command Line Usage
```bash
# Add a new site
npm run site:add example.com mysite mysite_db

# List all sites
./scripts/manage-sites.sh list

# Remove a site (with backup)
npm run site:remove example.com

# Reset to clean state (removes ALL sites)
./scripts/manage-sites.sh reset
```

### Development
```bash
# Start multi-tenant dev environment
npm run multi-tenant:dev

# Generate nginx configs for all sites
./scripts/generate-nginx-configs.sh

# Deploy to production
./scripts/deploy-multi-tenant.sh production
```

## ✨ New Features (Latest Update)

### Production-Ready Multi-Tenant System
- **Dynamic CORS Support** - Automatically handles multiple domains
- **Nginx Template System** - Generate configs for all sites automatically
- **Custom Routes Per Domain** - Each site can have unique nginx routes
- **Site Management CLI** - Interactive tool to add/remove/list sites
- **Per-Tenant Isolation** - Separate databases, uploads, JWT secrets
- **SSL Automation** - Automatic certificate setup for new domains
- **Health Monitoring** - Per-tenant health checks and metrics
- **Zero-Downtime Deployment** - Automated deployment with rollback

### Site Management Features
- `manage-sites.sh` - Interactive site manager with menu
- Add/remove sites with single commands
- Reset to clean state (remove all sites)
- Automatic backups when removing sites
- List all sites with status checks
- View detailed information per site

### Security Enhancements
- Per-tenant database isolation
- File upload isolation (`/uploads/{tenant-id}/`)
- Per-tenant JWT secrets
- CORS protection with allowed domains list
- Cloudflare integration for DDoS protection

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

| Script | Description |
|--------|-------------|
| `./dev-multi-tenant.sh test` | Start test server with domain simulation |
| `./dev-multi-tenant.sh build [site]` | Build specific site or all sites |
| `./dev-multi-tenant.sh add-site <name>` | Create new site from template |
| `./dev-multi-tenant.sh list` | List all configured sites |
| `./dev-multi-tenant.sh docker-build` | Build Docker container |
| `./dev-multi-tenant.sh docker-up` | Run Docker container |
| `./build-docker-multi-tenant.sh` | Build multi-tenant Docker image |

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

```bash
# Build multi-tenant container
./build-docker-multi-tenant.sh

# Run with docker-compose
docker-compose -f docker-compose.multi-tenant.yml up -d

# Or run directly
docker run -p 80:80 -p 443:443 multi-site-app:latest
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

## 📊 Multi-Tenant Features

| Feature | Status |
|---------|--------|
| Blog System | ✅ |
| Rich Text Editor | ✅ |
| Image Uploads | ✅ |
| Authentication | ✅ |
| Multiple Themes | ✅ |
| Separate Databases | ✅ |
| Domain Routing | ✅ |
| Client Isolation | ✅ |
| Single Container | ✅ |

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

- `NODE_ENV` - production/development
- `JWT_SECRET` - Secret for JWT tokens
- `MONGODB_URI` - MongoDB connection (uses local by default)
- `SITES_CONFIG_PATH` - Path to sites-config.json

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