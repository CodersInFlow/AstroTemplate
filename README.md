# Multi-Tenant SSR Platform

A single codebase that serves multiple websites with different domains, databases, themes, and content.

## 🚀 Quick Start

### Development
```bash
./scripts/dev.sh
```

**Access sites:**
- Site Directory: http://localhost:4321 (shows all available sites)
- CodersInFlow: http://codersinflow.localhost:4321 (AI pair programming platform)
- DarkFlows: http://darkflows.localhost:4321 (Router OS & networking solutions)
- Preston Garrison: http://prestongarrison.localhost:4321 (Developer portfolio)

💡 **Note**: `.localhost` domains work automatically in modern browsers without any /etc/hosts changes!

The system automatically detects which site to serve based on the domain. The default site at `localhost:4321` shows a beautiful directory of all available sites with descriptions and links that open in new tabs.

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
│       │   ├── components/   # BlogList, BlogPost, preston/, coders/, sections/
│       │   ├── data/         # Shared JSON data files
│       │   └── lib/          # tenant.ts, tiptap.ts, etc.
│       ├── sites/            # Site-specific configurations
│       │   ├── default/      # Site directory (blue gradient)
│       │   │   ├── config.json
│       │   │   ├── layout.astro
│       │   │   └── pages/
│       │   │       └── index.astro
│       │   ├── codersinflow.com/
│       │   │   ├── config.json
│       │   │   ├── layout.astro
│       │   │   └── pages/       # Site-specific pages
│       │   │       ├── index.astro
│       │   │       ├── features.astro
│       │   │       ├── enterprise.astro
│       │   │       └── download.astro
│       │   ├── darkflows.com/
│       │   │   ├── config.json
│       │   │   ├── layout.astro
│       │   │   ├── components/  # Site-specific components
│       │   │   └── pages/
│       │   │       ├── index.astro
│       │   │       └── blog.astro
│       │   └── prestongarrison.com/
│       │       ├── config.json
│       │       ├── layout.astro
│       │       └── pages/
│       │           └── index.astro
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
4. Create `pages/` directory with at least `index.astro`
5. Update `sites-config.json` with site entry
6. (Optional) Run `./scripts/add-site.sh` to add local domain
7. Restart server

**Site Structure Example:**
```
astro-multi-tenant/src/sites/yourdomain.com/
├── config.json           # Site metadata
├── layout.astro          # Site layout/theme
├── pages/                # Site pages
│   ├── index.astro       # Homepage
│   └── about.astro       # Additional pages
└── components/           # Optional site-specific components
```

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
3. Loads tenant-specific layout, pages, and database
4. Renders SSR response with tenant's theme and content

### Multi-Tenant Detection

The system uses the domain name to determine which site to serve:

- `http://localhost:4321` → Shows site directory (list of all sites)
- `http://codersinflow.localhost:4321` → Serves CodersInFlow site
- `http://darkflows.localhost:4321` → Serves DarkFlows site
- `http://prestongarrison.localhost:4321` → Serves Preston Garrison site
- `http://yourdomain.localhost:4321` → Serves your custom site

Each site gets:
- Its own database (isolated data)
- Custom layout/theme (from `/astro-multi-tenant/src/sites/[domain]/layout.astro`)
- Site-specific pages (from `/astro-multi-tenant/src/sites/[domain]/pages/`)
- Optional site-specific components
- Separate admin accounts
- Individual configuration
- Access to shared components from `/astro-multi-tenant/src/shared/`

### Site Directory

The default site at `localhost:4321` provides:
- Beautiful grid layout of all available sites
- Site descriptions and features
- Links that open in new tabs
- Blue gradient background
- Responsive design

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