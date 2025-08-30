# Multi-Tenant SSR Refactor Plan

## Current Problem
- We have separate Astro apps for each site (codersinflow.com, darkflows.com)
- Docker setup was trying to serve them as static files but they're configured for SSR
- I mistakenly tried to hardcode separate Node processes for each site
- This breaks the dynamic nature of the multi-tenant system

## Goal
Create a TRUE multi-tenant SSR system where:
- ONE Astro app serves ALL domains
- Dynamically loads layouts/styles based on Host header
- Works with existing backend multi-tenant API
- All scripts (dev, production, site management) continue to work

## Solution Architecture

### 1. Unified Astro App Structure
```
/app/astro-multi-tenant/
├── src/
│   ├── pages/
│   │   ├── [...slug].astro         # Catches all routes
│   │   └── api/                    # API routes if needed
│   ├── layouts/
│   │   ├── codersinflow/
│   │   │   ├── Layout.astro
│   │   │   └── BlogLayout.astro
│   │   ├── darkflows/
│   │   │   ├── Layout.astro
│   │   │   └── BlogLayout.astro
│   │   └── default/
│   │       └── Layout.astro
│   ├── components/
│   │   ├── shared/                 # Shared components (blog editor, etc)
│   │   ├── codersinflow/           # Site-specific components
│   │   └── darkflows/
│   ├── styles/
│   │   ├── codersinflow/
│   │   │   └── tailwind.css
│   │   ├── darkflows/
│   │   │   └── tailwind.css
│   │   └── default/
│   │       └── tailwind.css
│   └── lib/
│       ├── tenant.ts               # Tenant detection/config
│       └── api.ts                  # API helpers with tenant headers
├── public/
│   ├── codersinflow/              # Static assets per site
│   ├── darkflows/
│   └── default/
├── astro.config.mjs               # Single config for all
└── package.json
```

### 2. Key Implementation Details

#### Tenant Detection (`src/lib/tenant.ts`)
```typescript
export function getTenantFromHost(hostname: string) {
  // Load sites-config.json
  const sites = getSitesConfig();
  
  // Strip port and www
  const domain = hostname.replace(/:\d+$/, '').replace(/^www\./, '');
  
  return sites[domain] || sites['default'];
}

export function getTenantPaths(tenant: string) {
  return {
    layout: `../layouts/${tenant}/Layout.astro`,
    styles: `/styles/${tenant}/tailwind.css`,
    assets: `/public/${tenant}/`
  };
}
```

#### Main Route Handler (`src/pages/[...slug].astro`)
```javascript
---
const hostname = Astro.request.headers.get('host') || 'localhost';
const tenant = getTenantFromHost(hostname);
const paths = getTenantPaths(tenant.directory);

// Dynamic imports based on tenant
const { default: Layout } = await import(paths.layout);

// Handle routing
const slug = Astro.params.slug || 'index';
const page = await loadPageForTenant(tenant, slug);
---

<Layout title={page.title} tenant={tenant}>
  <!-- Page content -->
</Layout>
```

### 3. Docker Configuration Updates

#### `Dockerfile.multi-tenant`
```dockerfile
# Build stage - build the unified Astro app
FROM node:20-alpine AS builder
WORKDIR /build
COPY app/astro-multi-tenant/package*.json ./
RUN npm ci
COPY app/astro-multi-tenant/ ./
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Copy built Astro app
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

# Copy sites config
COPY sites-config.json ./

# Run the SSR server
CMD ["node", "./dist/server/entry.mjs"]
```

#### `docker/supervisord-multi.conf`
```ini
[program:astro-ssr]
command=node /app/dist/server/entry.mjs
environment=
    HOST=0.0.0.0,
    PORT=4321,
    PUBLIC_API_URL=http://127.0.0.1:3001
priority=3
autostart=true
autorestart=true

[program:proxy]
command=node /app/proxy.js
environment=
    PORT=8000,
    SSR_URL=http://127.0.0.1:4321,
    API_URL=http://127.0.0.1:3001
priority=4
```

### 4. Migration Steps

1. **Create unified Astro app structure**
   - Merge existing sites into one app
   - Organize by tenant directories
   - Keep shared components separate

2. **Update routing logic**
   - Create [...slug].astro catch-all
   - Implement tenant detection
   - Dynamic layout/style loading

3. **Update build process**
   - Single npm build command
   - Copies all tenant assets
   - Produces one SSR server

4. **Update Docker configs**
   - Simplify to one Astro process
   - Update proxy to route to SSR server
   - Maintain API routing with headers

5. **Update scripts**
   - `npm run dev` - starts unified app locally
   - `npm run site:add` - adds new tenant directory
   - `npm run docker:dev` - runs in Docker
   - `npm run docker:prod` - production build

### 5. Benefits
- **True multi-tenancy**: One process, multiple sites
- **Dynamic**: Add sites without rebuilding Docker
- **Efficient**: Shared code, separate data
- **Maintainable**: Single codebase to update

### 6. Testing Plan
1. Test local development with multiple hosts
2. Test Docker development environment
3. Test production Docker build
4. Test adding new site dynamically
5. Test blog functionality per tenant
6. Test asset isolation per tenant

### 7. Rollback Plan
If issues arise:
1. Git has all original code in history
2. Can revert to separate apps temporarily
3. Keep backup of working docker configs

## Questions to Answer Before Starting
1. Should we keep existing frontend directories as reference?
2. Any specific features that need special handling?
3. Preferred directory structure for the unified app?
4. Should we version the migration (v2 branch)?

## Next Steps
1. Review this plan
2. Get approval
3. Create unified Astro app structure
4. Migrate existing code
5. Test thoroughly
6. Deploy