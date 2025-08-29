# Modular Multi-Tenant Architecture - Shared Backend, Modular Frontends

## The Smart Structure: Best of Both Worlds

```
/var/www/sites/
├── shared/
│   ├── backend/           # ONE shared backend
│   │   ├── blog-api/
│   │   ├── auth-api/
│   │   └── media-api/
│   ├── components/        # Shared component library
│   │   ├── blog/
│   │   ├── ui/
│   │   └── layouts/
│   └── database/          # Shared MongoDB
│
├── frontends/             # Each site gets its own directory
│   ├── codersinflow.com/
│   │   ├── tailwind.config.js    # Custom Tailwind config
│   │   ├── package.json           # Site-specific deps
│   │   ├── astro.config.mjs       # Site config
│   │   ├── src/
│   │   │   ├── pages/            # Custom pages
│   │   │   ├── components/       # Custom components
│   │   │   └── styles/           # Custom styles
│   │   └── .env
│   │
│   ├── darkflows.com/
│   │   ├── tailwind.config.js    # Completely different config
│   │   ├── package.json
│   │   ├── src/
│   │   │   └── pages/
│   │   └── .env
│   │
│   └── clientsite.com/
│       ├── tailwind.config.js
│       ├── package.json
│       └── src/
```

## Implementation: Smart Module Loading

### 1. Shared Component Library with Override Pattern

```typescript
// shared/components/package.json
{
  "name": "@shared/components",
  "exports": {
    "./blog": "./blog/index.ts",
    "./ui": "./ui/index.ts"
  }
}
```

Each frontend can import shared components OR override them:

```typescript
// frontends/codersinflow.com/src/components/BlogPost.tsx
import { BlogPost as SharedBlogPost } from '@shared/components/blog';

// Extend the shared component with custom styling
export function BlogPost(props) {
  return (
    <SharedBlogPost 
      {...props}
      className="bg-coders-dark" // Site-specific styling
    />
  );
}
```

```typescript
// frontends/darkflows.com/src/components/BlogPost.tsx
// Completely custom implementation for this site
export function BlogPost(props) {
  return (
    <div className="dark-flows-blog-style">
      {/* Totally different implementation */}
    </div>
  );
}
```

### 2. Build System with Parallel Compilation

```json
// root package.json
{
  "scripts": {
    "dev": "node scripts/dev-server.js",
    "build": "node scripts/build-all.js",
    "build:site": "node scripts/build-site.js"
  }
}
```

```javascript
// scripts/dev-server.js
const { spawn } = require('child_process');
const sites = require('./sites.config.json');

// Start shared backend once
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './shared/backend'
});

// Start frontend based on HOST env or parameter
const site = process.env.SITE || process.argv[2];
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: `./frontends/${site}`,
  env: {
    ...process.env,
    API_URL: 'http://localhost:8000'
  }
});
```

### 3. Docker Compose with Smart Routing

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Shared backend - ONE instance
  backend:
    build: ./shared/backend
    ports:
      - "8000:8000"
    environment:
      - MULTI_TENANT=true
    volumes:
      - ./shared/backend:/app
      - uploads:/app/uploads

  # MongoDB - shared
  mongodb:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

  # Frontend builder/server
  frontend-server:
    build: ./docker/frontend-server
    ports:
      - "3000:3000"
    volumes:
      - ./frontends:/sites
      - ./shared/components:/shared/components
    environment:
      - NODE_ENV=production
    command: node /app/server.js

  # Nginx router
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/multi-site.conf:/etc/nginx/nginx.conf
      - ./frontends:/var/www/sites
    depends_on:
      - frontend-server
      - backend

volumes:
  mongo-data:
  uploads:
```

### 4. Smart Frontend Server that Builds on Demand

```typescript
// docker/frontend-server/server.ts
import express from 'express';
import { build } from 'vite';
import path from 'path';

const app = express();
const cache = new Map();

app.use(async (req, res, next) => {
  const host = req.hostname;
  const sitePath = `/sites/${host}`;
  
  // Check if site exists
  if (!fs.existsSync(sitePath)) {
    return res.status(404).send('Site not found');
  }
  
  // Build on demand if not cached or in dev mode
  if (!cache.has(host) || process.env.NODE_ENV === 'development') {
    const result = await build({
      root: sitePath,
      mode: process.env.NODE_ENV,
      build: {
        outDir: `/tmp/builds/${host}`
      }
    });
    cache.set(host, result);
  }
  
  // Serve the built site
  express.static(`/tmp/builds/${host}`)(req, res, next);
});

app.listen(3000);
```

### 5. Nginx Configuration for Multi-Site

```nginx
# nginx/multi-site.conf
map $host $site_name {
    codersinflow.com codersinflow.com;
    www.codersinflow.com codersinflow.com;
    darkflows.com darkflows.com;
    www.darkflows.com darkflows.com;
    ~^(?<subdomain>.+)\.client\.com$ $subdomain.client.com;
}

server {
    listen 80;
    server_name _;
    
    # Static files from site directory
    location /assets {
        root /var/www/sites/frontends/$site_name/public;
        expires 30d;
    }
    
    # API calls go to shared backend
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header X-Tenant-Domain $host;
        proxy_set_header X-Site-Name $site_name;
    }
    
    # Everything else to frontend server
    location / {
        proxy_pass http://frontend-server:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Site-Path /sites/$site_name;
    }
}
```

### 6. Site-Specific Configuration

```javascript
// frontends/codersinflow.com/tailwind.config.js
export default {
  content: ['./src/**/*.{astro,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        dark: '#0A0A0A'
      }
    }
  }
}
```

```javascript
// frontends/darkflows.com/tailwind.config.js
export default {
  content: ['./src/**/*.{astro,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',  // Completely different!
        dark: '#000000'
      }
    }
  }
}
```

### 7. Shared Blog Components with Site Styling

```typescript
// shared/components/blog/BlogList.tsx
export function BlogList({ className, ...props }) {
  const posts = useBlogPosts(); // Shared data fetching
  
  return (
    <div className={className}> {/* Site provides styling */}
      {posts.map(post => (
        <BlogCard key={post.id} {...post} />
      ))}
    </div>
  );
}
```

```astro
---
// frontends/codersinflow.com/src/pages/blog.astro
import { BlogList } from '@shared/components/blog';
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <BlogList className="coders-blog-grid bg-gray-900" />
</Layout>
```

```astro
---
// frontends/darkflows.com/src/pages/blog.astro
import { BlogList } from '@shared/components/blog';
import DarkLayout from '../layouts/DarkLayout.astro';
---

<DarkLayout>
  <BlogList className="dark-flows-style bg-black border-red-500" />
</DarkLayout>
```

### 8. Development Workflow

```bash
# Start development for specific site
npm run dev codersinflow.com

# Or use environment variable
SITE=darkflows.com npm run dev

# Build specific site
npm run build:site darkflows.com

# Build all sites
npm run build:all

# Add new site
npm run create:site newclient.com
```

### 9. Create New Site Script

```javascript
// scripts/create-site.js
const siteName = process.argv[2];
const template = process.argv[3] || 'default';

// Copy template
fs.cpSync(`./templates/${template}`, `./frontends/${siteName}`, {
  recursive: true
});

// Update configuration
const config = {
  name: siteName,
  port: getNextPort(),
  api: 'http://localhost:8000'
};

fs.writeFileSync(
  `./frontends/${siteName}/site.config.json`,
  JSON.stringify(config, null, 2)
);

// Install dependencies
execSync(`cd ./frontends/${siteName} && npm install`);

console.log(`✅ Site ${siteName} created!`);
console.log(`📁 Location: ./frontends/${siteName}`);
console.log(`🚀 Start with: npm run dev ${siteName}`);
```

### 10. Production Deployment

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Build all frontends at startup
  builder:
    build: ./docker/builder
    volumes:
      - ./frontends:/sites
      - built-sites:/output
    command: /build-all.sh

  # Serve built sites
  nginx:
    image: nginx:alpine
    volumes:
      - built-sites:/var/www/sites
      - ./nginx/prod.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - builder

  backend:
    image: shared-backend:latest
    environment:
      - NODE_ENV=production

volumes:
  built-sites:
```

## Benefits of This Approach

1. **Clean Separation**: Each site has its own folder with its own configs
2. **True Customization**: Each site can have completely different Tailwind, React components, etc.
3. **Shared When Needed**: Import from shared library when you want
4. **Independent Builds**: Can update one site without touching others
5. **Easy Onboarding**: `npm run create:site newclient.com` and done!
6. **Git Friendly**: Each site can even be its own git repo if needed
7. **Developer Friendly**: Developers work in familiar structure

## File Structure Example

```
frontends/codersinflow.com/
├── package.json
├── tailwind.config.js      # Unique config
├── astro.config.mjs
├── tsconfig.json
├── .env
├── public/
│   ├── favicon.ico         # Site-specific assets
│   └── logo.svg
└── src/
    ├── pages/
    │   ├── index.astro      # Custom home page
    │   └── blog.astro       # Uses shared blog component
    ├── components/
    │   ├── Hero.tsx         # Custom hero
    │   └── Features.tsx     # Custom features
    ├── layouts/
    │   └── Layout.astro     # Site-specific layout
    └── styles/
        └── global.css       # Site-specific styles

frontends/darkflows.com/
├── package.json
├── tailwind.config.js      # Completely different!
├── next.config.js          # This one uses Next.js!
└── src/
    └── app/
        └── page.tsx         # Different framework even!
```

## Quick Commands

```bash
# Create new site from template
npm run create:site clientabc.com -- --template=blog

# Start dev server for specific site
npm run dev clientabc.com

# Build and deploy specific site
npm run deploy clientabc.com

# List all sites
npm run sites:list

# Update shared components
npm run update:shared
```

This gives you:
- **Organization**: Each site in its own directory
- **Flexibility**: Each site can be totally different
- **Efficiency**: Shared backend and components when needed
- **Simplicity**: Easy to understand structure
- **Scalability**: Add sites without complexity

Perfect balance between separation and sharing!