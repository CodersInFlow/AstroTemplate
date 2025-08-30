# Multi-Tenant SSR Blog Platform

A single codebase that serves multiple websites with different domains, databases, and themes.

## 🚀 Quick Start

### Development
```bash
./scripts/dev.sh
```

**Access sites:**
- Default (CodersInFlow): http://127.0.0.1:4321
- Blog: http://127.0.0.1:4321/blog

**To test different sites (multi-tenancy):**

Just use `.localhost` domains (no setup needed!):
- CodersInFlow: http://codersinflow.localhost:4321 (blue theme)
- DarkFlows: http://darkflows.localhost:4321 (red/dark theme)

💡 **Note**: `.localhost` domains work automatically in modern browsers without any /etc/hosts changes!

The system automatically detects which site to serve based on the domain.

### Production (Docker)
```bash
./scripts/build.sh      # Build Docker image
./scripts/run-docker.sh  # Run with docker-compose
```
Access at: http://localhost

## 📁 Structure

```
├── astro-multi-tenant/       # Frontend SSR app
│   └── src/
│       ├── shared/           # Shared components & utilities
│       │   ├── components/   # BlogList, BlogPost, etc.
│       │   └── lib/          # tenant.ts, tiptap.ts, etc.
│       ├── sites/            # Site-specific configurations
│       │   ├── codersinflow.com/
│       │   │   ├── config.json
│       │   │   └── layout.astro
│       │   └── darkflows.com/
│       │       ├── config.json
│       │       └── layout.astro
│       └── pages/
│           └── [...slug].astro  # Main router
├── backend/                  # Go API server  
├── sites-config.json         # Site configurations
├── docker-compose.yml        # Production setup
└── scripts/                  # Helper scripts
```

## ➕ Add New Site

1. Create site directory: `astro-multi-tenant/src/sites/yourdomain.com/`
2. Add `config.json` with site configuration
3. Add `layout.astro` with site theme/layout
4. Update `sites-config.json` with site entry
5. Restart server

## 🔧 Configuration

Edit `sites-config.json`:

```json
{
  "yourdomain.com": {
    "id": "yoursite",
    "directory": "yourdomain.com",
    "database": "yoursite_db",
    "theme": "default",
    "features": ["blog"],
    "adminUser": {
      "email": "admin@yourdomain.com",
      "password": "secure_password",
      "name": "Admin"
    }
  }
}
```

## 📜 Scripts

- `./scripts/dev.sh` - Start development environment
- `./scripts/build.sh` - Build Docker image
- `./scripts/run-docker.sh` - Run production Docker
- `./scripts/deploy.sh` - Deploy to server
- `./scripts/add-site.sh` - Add new site

## 🌐 How It Works

1. Request comes in with Host header (e.g., `codersinflow.com`)
2. System detects tenant from `sites-config.json`
3. Loads tenant-specific layout and database
4. Renders SSR response with tenant's theme

### Multi-Tenant Detection

The system uses the domain name to determine which site to serve:

- `http://127.0.0.1:4321` → Serves default site (codersinflow)
- `http://codersinflow.localhost:4321` → Serves CodersInFlow site
- `http://darkflows.localhost:4321` → Serves DarkFlows site
- `http://yourdomain.localhost:4321` → Serves your custom site

Each site gets:
- Its own database (isolated data)
- Custom layout/theme (from `/astro-multi-tenant/src/sites/[domain]/`)
- Separate admin accounts
- Individual configuration
- Shared components from `/astro-multi-tenant/src/shared/`

## 📝 Environment Variables

- `PORT` - Frontend port (default: 4321)
- `API_PORT` - Backend port (default: 3001)  
- `MONGODB_URI` - MongoDB connection
- `PUBLIC_API_URL` - Backend URL for frontend

## 🐳 Docker

Everything runs in containers:
- MongoDB for data
- Single app container with both frontend SSR and backend API

## 📚 Full Documentation

See [README-UNIFIED-SSR.md](README-UNIFIED-SSR.md) for detailed documentation.