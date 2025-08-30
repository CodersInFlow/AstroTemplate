# Multi-Tenant Restructuring Plan

## Goal
Clean up the current mess and create a properly structured multi-tenant Astro app with:
- Shared core components (blog, auth, etc.)
- Isolated site-specific customization
- Normal Astro development experience
- No symlinks or weird hacks

## Current Problems
1. Mixed old and new structures
2. Duplicate layouts in multiple places
3. Confusing routing logic
4. No clear separation between shared and site-specific code
5. Styles and Tailwind configs scattered

## New Clean Structure

```
/astro-multi-tenant/src/
├── shared/                      ← Shared across all sites
│   ├── components/
│   │   ├── BlogPost.astro     ← Blog display component
│   │   ├── BlogList.astro     ← Blog listing component
│   │   └── TipTapEditor.tsx   ← Rich text editor
│   ├── layouts/
│   │   └── BlogLayout.astro   ← Base blog layout
│   └── lib/
│       ├── blog-api.ts        ← Blog API functions
│       ├── tenant.ts          ← Tenant detection
│       └── auth.ts            ← Auth utilities
│
├── sites/                       ← Site-specific customization
│   ├── codersinflow.com/
│   │   ├── config.json        ← Site configuration
│   │   ├── layout.astro       ← Main site layout
│   │   ├── styles.css         ← Site-specific styles
│   │   └── tailwind.config.js ← Site Tailwind config
│   │
│   └── darkflows.com/
│       ├── config.json
│       ├── layout.astro
│       ├── styles.css
│       └── tailwind.config.js
│
├── pages/                       ← Clean Astro routing
│   ├── [...slug].astro        ← Main router
│   └── api/                   ← API routes if needed
│
└── styles/
    └── base.css                ← Shared base styles
```

## Implementation Steps

### Phase 1: Clean Up (5 mins)
1. Archive all experimental directories
2. Remove duplicate files
3. Clean up package.json

### Phase 2: Create Shared Core (10 mins)
1. Create `/shared` directory structure
2. Move blog components to shared
3. Move tenant detection to shared/lib
4. Create shared BlogLayout component

### Phase 3: Restructure Sites (10 mins)
1. Create clean `/sites` directory
2. Move existing layouts to site directories
3. Create config.json for each site
4. Set up site-specific Tailwind configs

### Phase 4: Update Routing (5 mins)
1. Simplify `[...slug].astro` to use new structure
2. Remove complex logic
3. Make it clean and understandable

### Phase 5: Test (5 mins)
1. Test codersinflow.localhost:4321
2. Test darkflows.localhost:4321
3. Verify blog works on both
4. Check styles are isolated

## Site Config Example

`/sites/codersinflow.com/config.json`:
```json
{
  "id": "codersinflow",
  "name": "CodersInFlow",
  "database": "codersinflow_db",
  "theme": {
    "primaryColor": "#3B82F6",
    "secondaryColor": "#8B5CF6"
  },
  "features": ["blog", "docs", "api"],
  "navigation": [
    { "label": "Home", "href": "/" },
    { "label": "Features", "href": "/features" },
    { "label": "Blog", "href": "/blog" },
    { "label": "Pricing", "href": "/pricing" }
  ]
}
```

## Router Simplification

The main `[...slug].astro` will be simple:
```typescript
---
import { getTenantFromHost } from '../shared/lib/tenant';

const hostname = Astro.request.headers.get('host');
const tenant = getTenantFromHost(hostname);
const route = Astro.params.slug || 'index';

// Load site layout
const Layout = (await import(`../sites/${tenant.directory}/layout.astro`)).default;

// For blog routes, use shared blog component
if (route.startsWith('blog')) {
  const BlogPost = (await import('../shared/components/BlogPost.astro')).default;
  // Render blog with site layout
}

// For other routes, check if site has custom pages
// Otherwise render default content
---
```

## Benefits of This Structure

1. **Clear Separation**: Shared vs site-specific is obvious
2. **No Duplication**: Blog code exists once
3. **Easy Customization**: Each site has simple config + layout
4. **Normal Astro**: Works like any Astro project
5. **Easy to Maintain**: Clear where everything goes
6. **Scalable**: Easy to add new sites

## What Gets Deleted

- `/src/styles/codersinflow.com/` - move to sites
- `/src/styles/darkflows.com/` - move to sites  
- `/src/layouts/codersinflow.com/` - move to sites
- `/src/layouts/darkflows.com/` - move to sites
- `/src/content/` - not needed
- `/src/pages/[domain]/` - not needed
- Old experimental files

## End Result

- Clean, understandable structure
- Works exactly like normal Astro
- Each site properly isolated
- Shared components prevent duplication
- Easy to add new sites
- Ready for production