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
│       ├── pages/
│       │   └── [...slug].astro  # Main router with module support
│       ├── modules/          # Self-contained feature modules
│       │   └── blog/         # Blog module (works on ALL sites)
│       │       ├── routes.ts     # Route definitions
│       │       ├── components/   # BlogList, BlogPost
│       │       └── pages/        # Blog pages, editor, etc.
│       ├── shared/           # Shared utilities
│       │   ├── components/   # Site-specific components
│       │   ├── data/         # Shared JSON data files
│       │   └── lib/          # tenant.ts, module-loader.ts, tiptap.ts
│       ├── sites/            # Site-specific configurations
│       │   ├── default/      # Site directory (blue gradient)
│       │   │   ├── config.json
│       │   │   ├── layout.astro
│       │   │   └── pages/
│       │   │       └── index.astro
│       │   ├── codersinflow.com/
│       │   │   ├── config.json
│       │   │   ├── layout.astro  # Dark theme with gradients
│       │   │   └── pages/       # ONLY site-specific pages
│       │   │       ├── index.astro
│       │   │       ├── features.astro
│       │   │       └── enterprise.astro
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

### Request Flow

1. Request arrives with Host header (e.g., `codersinflow.com`)
2. Router (`[...slug].astro`) detects tenant from hostname
3. Router checks module routes first (e.g., `/blog`, `/docs`)
4. If no module match, checks site-specific pages
5. Wraps content in site's layout with proper theming
6. Returns SSR response

### Module System

**Modules are self-contained features that work on ALL sites automatically!**

The blog module provides these routes to every site:
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog posts  
- `/blog/editor` - Blog editor interface
- `/docs` - Documentation listing
- `/docs/[slug]` - Individual documentation pages

Each site gets these features with their own styling - no duplication!

### Multi-Tenant Detection

The system uses the domain name to determine which site to serve:

- `http://localhost:4321` → Shows site directory (list of all sites)
- `http://codersinflow.localhost:4321` → Serves CodersInFlow site
- `http://darkflows.localhost:4321` → Serves DarkFlows site
- `http://prestongarrison.localhost:4321` → Serves Preston Garrison site
- `http://yourdomain.localhost:4321` → Serves your custom site

Each site gets:
- Its own database (isolated data)
- Custom layout/theme (from `/sites/[domain]/layout.astro`)
- Site-specific pages (from `/sites/[domain]/pages/`) - ONLY unique pages!
- Automatic access to ALL module features (blog, docs, editor, etc.)
- Separate admin accounts
- Individual configuration
- Theming via CSS classes in layout

### Site Directory

The default site at `localhost:4321` provides:
- Beautiful grid layout of all available sites
- Site descriptions and features
- Links that open in new tabs
- Blue gradient background
- Responsive design

## ➕ Adding New Modules

1. Create module directory: `/src/modules/your-module/`
2. Add `routes.ts` with route definitions:
```typescript
export default {
  name: 'your-module',
  routes: [
    { pattern: 'your-path', component: './pages/index.astro' },
    { pattern: 'your-path/:id', component: './pages/[id].astro' }
  ]
};
```
3. Create your components and pages
4. Register in `/src/shared/lib/module-loader.ts`
5. Module automatically works on ALL sites!

## 🎨 Theming Modules

Modules use CSS classes that sites define:
```astro
<!-- In module -->
<h1 class="page-heading">Title</h1>
<div class="blog-card">Content</div>

<!-- In site layout.astro -->
<style>
  .page-heading { color: #yourcolor; }
  .blog-card { background: #yourcolor; }
</style>
```

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