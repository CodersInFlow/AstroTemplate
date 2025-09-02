# Multi-Tenant SSR Platform

A single codebase that serves multiple websites with different domains, databases, themes, and content.

## 🚀 Quick Start

> **Note:** After cloning, just run `npm install` - it automatically handles all dependencies!

### Development

1. **Clone and setup:**
```bash
git clone git@github.com:CodersInFlow/AstroTemplate.git
cd AstroTemplate
npm install  # Automatically installs all dependencies in both directories
```

2. **Start development:**
```bash
./scripts/dev.sh
```

**Access sites:**
- Site Directory: http://localhost:4321 (shows all available sites)
- CodersInFlow: http://codersinflow.localhost:4321 (AI pair programming platform)
- DarkFlows: http://darkflows.localhost:4321 (Router OS & networking solutions)
- Preston Garrison: http://prestongarrison.localhost:4321 (Developer portfolio)

**Default Admin Credentials:**
The Go backend automatically creates a default admin user for each site:
- **Email:** `admin@codersinflow.com`
- **Password:** `c0dersinflow`

💡 **Note**: `.localhost` domains work automatically in modern browsers without any /etc/hosts changes!

The system automatically detects which site to serve based on the domain. The default site at `localhost:4321` shows a beautiful directory of all available sites with descriptions and links that open in new tabs.

### Production (Docker)

#### Local Testing
```bash
./scripts/build.sh      # Build Docker image
./scripts/run-docker.sh  # Run with docker-compose
```
Access at: http://localhost

#### Full Production Deployment

1. **Configure settings:**
```bash
# If not already done
cp .env.example .env
# Edit .env with your production settings (server, ports, etc.)
```

2. **Generate nginx configs for all sites:**
```bash
./scripts/generate-nginx-configs.sh
# This creates nginx configs and custom include files
```

3. **Deploy to server:**
```bash
# Uses settings from .env
./scripts/deploy-full.sh

# Or override specific variables
DEPLOY_SERVER=other-server.com ./scripts/deploy-full.sh
```

The deployment script will:
- Build and push Docker image
- Upload configs to `/var/www/docker/`
- Install nginx configurations
- Setup SSL certificates via Let's Encrypt
- Start Docker containers

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

**Quick Start (with nginx config):**
```bash
# Creates site structure AND nginx config
./scripts/add-site-with-nginx.sh yourdomain.com
```

**Site only (no nginx):**
```bash
./scripts/add-a-site.sh yourdomain.com
```

**Manual process:**
1. Create site directory: `astro-multi-tenant/src/sites/yourdomain.com/`
2. Add `tailwind.config.cjs` with semantic color mappings
3. Add `config.json` with site configuration
4. Add `layout.astro` with site theme/layout (must import CSS with `?raw`)
5. Create `pages/` directory with at least `index.astro`
6. Update `sites-config.json` with site entry
7. Run `npm run generate-css` to generate site CSS
8. Restart server

**Site Structure Example:**
```
astro-multi-tenant/src/sites/yourdomain.com/
├── config.json           # Site metadata
├── layout.astro          # Site layout/theme
├── tailwind.config.cjs   # Site-specific Tailwind config
├── styles/
│   └── main.css         # Generated CSS (do not edit)
├── pages/                # Site pages
│   ├── index.astro       # Homepage
│   └── about.astro       # Additional pages
└── components/           # Optional site-specific components
```

See [ADD_A_SITE.md](ADD_A_SITE.md) for detailed instructions.

## ⚠️ Important: TailwindCSS and Dynamic Classes

**When using Tailwind classes from JSON files or dynamic data:**

If you're loading Tailwind classes from JSON files (like `bg-blue-600`, `bg-red-500`, etc.), you MUST add them to the `safelist` in your site's `tailwind.config.cjs`. Otherwise, Tailwind will purge these classes during build and they won't work.

Example in `src/sites/yourdomain.com/tailwind.config.cjs`:
```javascript
module.exports = {
  // ... other config
  safelist: [
    // Add any dynamic classes loaded from JSON
    'bg-blue-600',
    'bg-purple-600',
    'bg-green-500',
    'bg-yellow-400',
    'bg-red-500',
    // Add any other classes that come from JSON data
  ],
}
```

This is especially important for:
- Component colors loaded from JSON
- Dynamic theme colors
- Conditional classes based on data
- Any class names not directly written in your components

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

### Development
- `./scripts/dev.sh` - Start development environment
- `./scripts/add-a-site.sh` - Add new site (structure only)
- `./scripts/add-site-with-nginx.sh` - Add site with nginx config

### Production
- `./scripts/build.sh` - Build Docker image
- `./scripts/run-docker.sh` - Run Docker locally
- `./scripts/generate-nginx-configs.sh` - Generate nginx configs for all sites
- `./scripts/deploy-full.sh` - Full deployment to production server
- `./scripts/setup-docker-dirs.sh` - Setup directories on server

## 🌐 How It Works

### Request Flow

1. Request arrives with Host header (e.g., `codersinflow.com`)
2. Router (`[...slug].astro`) detects tenant from hostname
3. Router checks module routes first (e.g., `/blog`, `/docs`)
4. If no module match, checks site-specific pages
5. Wraps content in site's layout with proper theming

### ⚠️ Important: Astro Redirect and Layout Considerations

#### The Response Already Sent Error
When using Astro, you **cannot** use `Astro.redirect()` inside components that are wrapped by a Layout. Once a Layout component starts rendering, the response headers are sent to the browser, and any subsequent redirect attempts will fail with:

```
ResponseSentError: Unable to set response. 
The response has already been sent to the browser and cannot be altered.
```

#### Why This Happens
1. **Page renders Layout** → Response headers start sending
2. **Layout renders child component** → Response is already in progress
3. **Child component tries to redirect** → ❌ Too late! Error occurs

#### Solutions Implemented

**For Blog Post Creation:**
Instead of redirecting after form submission, we show a success page on the same URL:
- Form submits to itself (POST to same page)
- Server processes the submission
- On success: Shows beautiful success page with post URL and actions
- On error: Shows form with validation errors and preserved values

**Benefits:**
- No redirect timing issues
- Better UX with immediate feedback
- Form values preserved on error
- Multiple actions available after success

#### Best Practices

✅ **DO:**
- Handle redirects at the page level (before Layout renders)
- Use middleware for authentication redirects
- Show success/error states on the same page
- Use client-side navigation for post-action navigation

❌ **DON'T:**
- Use `Astro.redirect()` inside components wrapped by Layout
- Try to modify response headers after rendering starts
- Mix redirect logic between pages and components

#### Example Pattern
```astro
---
// ✅ Good: Check and redirect BEFORE Layout
const needsAuth = checkAuth();
if (needsAuth) {
  return Astro.redirect('/login');
}

const Layout = await import('./layout.astro');
---

<Layout>
  <!-- Component content here -->
</Layout>
```

## 📝 Blog Module Architecture

### IMPORTANT: How the Blog System Works

The blog module is a **shared component** that gets wrapped by each site's layout. Understanding this architecture is critical:

#### 1. **Entry Point**: Site's Blog Wrapper
Each site has a `pages/blog/[...slug].astro` file that:
```astro
---
import Layout from '../../layout.astro';
import BlogApp from '../../../../modules/blog/BlogApp.astro';
---

<Layout title="Blog">
  <BlogApp config={config} />
</Layout>
```

This is the **ONLY** place where Layout should be used for blog pages.

#### 2. **BlogApp Router**: `src/modules/blog/BlogApp.astro`
- Receives database and tenant info from the site wrapper
- Parses the URL to determine which blog component to render
- Passes `database` and `tenant` props to all child components
- **NEVER** uses its own Layout - it's already wrapped!

#### 3. **Blog Components**: `src/modules/blog/editor/*.astro`
- **MUST NOT** import or use Layout components
- **MUST** receive `database` and `tenant` from props:
  ```astro
  const { database, tenant } = Astro.props;
  ```
- **MUST** include database header in all API calls:
  ```javascript
  headers: {
    'X-Site-Database': database
  }
  ```

#### Blog URL Routing
- `/blog` → Blog listing
- `/blog/editor` → Editor dashboard (requires auth)
- `/blog/editor/login` → Login page
- `/blog/editor/posts` → Posts management
- `/blog/editor/posts/new` → Create new post
- `/blog/editor/posts/edit/[id]` → Edit post
- `/blog/[slug]` → View blog post

#### Blog Authentication
- The blog editor requires authentication to access
- Default admin credentials are created automatically by the Go backend
- Authentication uses httpOnly cookies for security
- Each site has its own isolated user database

#### Common Mistakes to Avoid
❌ **NEVER** import Layout in blog module components
❌ **NEVER** wrap blog components in `<Layout>` tags
❌ **NEVER** hardcode API URLs or ports
❌ **NEVER** forget the `X-Site-Database` header
✅ **ALWAYS** use `API_URL` from the centralized config
✅ **ALWAYS** pass database through props
✅ **ALWAYS** let the site's wrapper handle the layout
6. Returns SSR response

### API Configuration

The system uses a **dynamic API configuration** at `src/shared/lib/api-config.ts` that automatically handles dev/production differences:

#### How It Works:
- **Development** (port 4321): Uses same hostname with API port (e.g., `codersinflow.localhost:3001`)
- **Production** (no port/80/443): Uses same origin without port (e.g., `codersinflow.com`)

#### Configuration Variables:
```javascript
// Can be set via environment variables:
PUBLIC_DEV_FRONTEND_PORT // Default: 4321
PUBLIC_DEV_API_PORT      // Default: 3001
PUBLIC_API_URL           // Override entire URL if needed
```

#### Why This Approach:
- **Same-origin requests**: Cookies work with `SameSite=Lax` (no CORS issues)
- **No hardcoded URLs**: Works identically across all domains
- **Consistent dev/prod**: Same code path, different port handling

#### IMPORTANT Rules:
- **NEVER hardcode** `127.0.0.1` or `localhost` - use current domain
- **NEVER hardcode** ports - use configuration variables
- **ALWAYS import** `API_URL` from `src/shared/lib/api-config.ts`
- **ALWAYS use** same domain for frontend and API (just different ports in dev)

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

## 🎨 Theming System

### Semantic Color System
Each site uses semantic Tailwind classes that map to different colors:

**Semantic Classes Available:**
- `bg-background`, `bg-surface`, `bg-surface-hover` - Background colors
- `bg-primary`, `bg-secondary`, `bg-accent` - Brand colors  
- `text-text-primary`, `text-text-secondary`, `text-text-muted` - Text colors
- `text-link`, `text-link-hover` - Link colors
- `border-border` - Border colors

**Example Usage:**
```astro
<!-- Same code, different colors per site! -->
<div class="bg-background text-text-primary">
  <h1 class="text-3xl">Welcome</h1>
  <button class="bg-primary text-text-inverse">
    Click Me
  </button>
</div>
```

### CSS Generation
1. Each site has its own `tailwind.config.cjs` with color mappings
2. Running `npm run dev` or `npm run generate-css` creates site-specific CSS
3. CSS is loaded in isolation - no cross-contamination between sites

### Important CSS Rules
- **Never** import CSS files directly
- **Always** use `import styles from './styles/main.css?raw'` in layouts
- **Always** inject with `<style set:html={styles}></style>`
- **Always** use semantic class names, not color-specific ones

## 📝 Environment Variables

All configuration is centralized in a single `.env` file in the root directory. 

**IMPORTANT:** Create this file before running the application:
```bash
cp .env.example .env
# Edit .env with your specific settings
```

The `.env` file controls EVERYTHING - frontend, backend, deployment, and features:

### Core Settings
- `PORT` - Frontend SSR port (default: 4321)
- `API_PORT` - Backend API port (default: 3001)  
- `MONGODB_URI` - MongoDB connection string
- `PUBLIC_API_URL` - Backend URL for frontend
- `JWT_SECRET` - Secret key for authentication (CHANGE THIS!)
- `CORS_ORIGIN` - CORS settings for API
- `ALLOWED_DOMAINS` - Comma-separated list of allowed domains
- `SITES_CONFIG_PATH` - Path to sites configuration file

### Multi-tenant Settings
- `SITES_CONFIG_PATH` - Path to sites-config.json (default: ./sites-config.json)
- `UPLOAD_DIR` - Directory for file uploads
- `MAX_UPLOAD_SIZE` - Maximum upload size in bytes

### Deployment Settings
- `DEPLOY_SERVER` - Target server hostname/IP
- `DEPLOY_USER` - SSH user
- `DEPLOY_PORT` - SSH port (default: 22)
- `DOCKER_REGISTRY` - Docker registry or "local"
- `FRONTEND_PORT` - External nginx port for frontend
- `BACKEND_PORT` - External nginx port for API

See `.env.example` for all available options.

**Note:** The backend automatically loads the `.env` file from the root directory. No separate backend/.env file is needed.

## 🐳 Docker & Deployment

### Architecture
- **MongoDB**: Data persistence in `/var/www/docker/mongodb-data`
- **App Container**: Astro SSR (port 4321) + Go API (port 3001)
- **Nginx**: Reverse proxy on host, handles SSL and routing
- **Uploads**: Stored in `/var/www/docker/uploads`

### Volume Mappings
All Docker volumes are mapped to `/var/www/docker/`:
- `mongodb-data/` - MongoDB database files
- `uploads/` - User uploaded files (tenant-isolated)
- `logs/` - Application logs
- `sites-config.json` - Site configuration

### Deployment Configuration

All deployment settings are in the main `.env` file (no separate deployment config needed).

The deployment script reads from `.env` for:
- Server connection (`DEPLOY_SERVER`, `DEPLOY_USER`, `DEPLOY_PORT`)
- Docker settings (`DOCKER_REGISTRY`, `DOCKER_TAG`)
- Port mappings (`FRONTEND_PORT`, `BACKEND_PORT`)
- Remote paths (`REMOTE_BASE_DIR`, `NGINX_CONFIG_DIR`)

You can override any setting with environment variables:
```bash
DEPLOY_SERVER=staging.server.com ./scripts/deploy-full.sh
```

### Adding a New Site Workflow
1. Add site locally: `./scripts/add-site-with-nginx.sh example.com`
2. Update `sites-config.json` with the generated config
3. Regenerate all nginx configs: `./scripts/generate-nginx-configs.sh`
4. Build Docker image: `./scripts/build.sh`
5. Deploy to server: `./scripts/deploy-full.sh`

## 📚 Full Documentation

See [README-UNIFIED-SSR.md](README-UNIFIED-SSR.md) for detailed documentation.