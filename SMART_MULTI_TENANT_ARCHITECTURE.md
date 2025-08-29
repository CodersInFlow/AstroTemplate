# Smart Multi-Tenant Architecture - Single Codebase, Infinite Sites

## The Vision: One App, Many Faces

Instead of copying projects, we build ONE smart application that morphs based on the domain accessing it.

## Architecture: Dynamic Component Federation

```
     [Single Astro/Next App Instance]
              |
      Domain Detection Layer
              |
    ┌─────────┴─────────┐
    │                   │
[Component Registry] [Theme Engine]
    │                   │
    └─────────┬─────────┘
              │
     [Dynamic Page Builder]
```

## Implementation: Smart Single-Instance Multi-Tenancy

### 1. Domain-Driven Component Loading

```typescript
// middleware.ts - Runs on EVERY request
export async function middleware(request: Request) {
  const hostname = request.headers.get('host') || '';
  
  // Load tenant config from Redis/Memory Cache
  const tenant = await getTenantConfig(hostname);
  
  // Inject tenant data into request
  request.headers.set('x-tenant', JSON.stringify(tenant));
  
  // Rewrite URLs to tenant-specific paths
  if (tenant.id !== 'default') {
    return NextResponse.rewrite(
      new URL(`/_tenants/${tenant.id}${request.nextUrl.pathname}`, request.url)
    );
  }
}
```

### 2. Dynamic Component Registry System

```typescript
// components/registry.ts
class ComponentRegistry {
  private components = new Map();
  
  // Register component variations
  register(name: string, variant: string, component: ComponentType) {
    this.components.set(`${name}:${variant}`, component);
  }
  
  // Get component for current tenant
  get(name: string, tenant: string): ComponentType {
    // Try tenant-specific first
    const specific = this.components.get(`${name}:${tenant}`);
    if (specific) return specific;
    
    // Fall back to default
    return this.components.get(`${name}:default`);
  }
}

// Usage Example
registry.register('Hero', 'default', DefaultHero);
registry.register('Hero', 'codersinflow', CodersHero);
registry.register('Hero', 'darkflows', DarkflowsHero);
registry.register('Hero', 'client-xyz', CustomHero);
```

### 3. Runtime Page Composition

```typescript
// pages/[[...slug]].tsx - Single catch-all route
export default function DynamicPage({ tenant, pageConfig }) {
  return (
    <PageBuilder
      config={pageConfig}
      tenant={tenant}
      render={(section) => {
        const Component = registry.get(section.type, tenant.id);
        return <Component {...section.props} theme={tenant.theme} />;
      }}
    />
  );
}

// Page config loaded from database/CMS
const pageConfig = {
  "codersinflow.com": {
    "/": [
      { type: "Hero", props: { title: "AI Coding" } },
      { type: "Features", props: { style: "grid" } },
      { type: "Blog", props: { posts: 3 } }
    ],
    "/about": [
      { type: "Hero", props: { variant: "simple" } },
      { type: "Team", props: {} }
    ]
  },
  "clientsite.com": {
    "/": [
      { type: "Hero", props: { title: "Welcome" } },
      { type: "Services", props: {} },
      { type: "Contact", props: {} }
    ]
  }
}
```

### 4. CSS-in-JS Theming with Zero Build Time

```typescript
// lib/theme-engine.ts
import { create } from '@emotion/css';

class ThemeEngine {
  private cache = new Map();
  
  generateStyles(tenant: Tenant) {
    if (this.cache.has(tenant.id)) {
      return this.cache.get(tenant.id);
    }
    
    // Generate CSS at runtime
    const styles = `
      :root {
        --primary: ${tenant.colors.primary};
        --background: ${tenant.colors.background};
        --blog-bg: ${tenant.colors.blogBg};
      }
      
      ${tenant.customCSS || ''}
    `;
    
    this.cache.set(tenant.id, styles);
    return styles;
  }
}

// Inject into page
export function ThemeProvider({ tenant, children }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = themeEngine.generateStyles(tenant);
    style.id = `theme-${tenant.id}`;
    document.head.appendChild(style);
    
    return () => style.remove();
  }, [tenant]);
  
  return children;
}
```

### 5. Edge-Rendered Content with Cloudflare Workers/Vercel Edge

```typescript
// edge-function.ts
export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const hostname = new URL(request.url).hostname;
  
  // Get tenant from KV/Edge Config
  const tenant = await TENANT_KV.get(hostname, 'json');
  
  // Fetch page structure from edge cache
  const pageStructure = await PAGES_KV.get(`${tenant.id}:${pathname}`);
  
  // Render at the edge
  return new Response(
    renderToString(
      <DynamicApp tenant={tenant} structure={pageStructure} />
    ),
    { headers: { 'content-type': 'text/html' } }
  );
}
```

### 6. Smart Asset Management

```typescript
// Dynamic asset loading based on tenant
class AssetManager {
  getAsset(type: string, tenant: string) {
    // Tenant-specific assets stored in R2/S3
    const baseUrl = `https://cdn.example.com/tenants/${tenant}`;
    
    return {
      logo: `${baseUrl}/logo.svg`,
      favicon: `${baseUrl}/favicon.ico`,
      fonts: tenant.fonts?.map(f => `${baseUrl}/fonts/${f}`),
      images: new Proxy({}, {
        get: (_, prop) => `${baseUrl}/images/${prop}`
      })
    };
  }
}
```

### 7. Database Structure - Single DB, Smart Schemas

```sql
-- Single database with tenant isolation
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) NOT NULL,
  title TEXT,
  content JSONB,
  created_at TIMESTAMP,
  INDEX idx_tenant (tenant_id)
);

-- Row-level security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON posts
  USING (tenant_id = current_setting('app.tenant_id'));
```

### 8. Feature Flags & Progressive Enhancement

```typescript
// features.config.ts
const features = {
  "codersinflow": {
    blog: true,
    aiChat: true,
    payments: true,
    customComponents: ['CodeEditor', 'AIAssistant']
  },
  "basicsite": {
    blog: true,
    aiChat: false,
    payments: false,
    customComponents: []
  }
};

// Component that auto-hides based on features
export function Feature({ name, children, tenant }) {
  if (!tenant.features[name]) return null;
  return children;
}

// Usage
<Feature name="aiChat" tenant={tenant}>
  <AIChat />
</Feature>
```

### 9. No-Code Page Builder for Clients

```typescript
// Admin panel component
export function PageBuilder({ tenant }) {
  const [sections, setSections] = useState([]);
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="page">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sections.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index}>
                {(provided) => (
                  <SectionEditor
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    section={section}
                    availableComponents={getComponentsForTenant(tenant)}
                  />
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
      
      <Button onClick={() => savePageStructure(tenant, sections)}>
        Publish Changes
      </Button>
    </DragDropContext>
  );
}
```

### 10. Smart Caching Strategy

```typescript
// cache.ts
class TenantCache {
  // In-memory cache for hot tenants
  private memCache = new LRU({ max: 100 });
  
  // Redis for warm tenants
  private redis = new Redis();
  
  // S3/R2 for cold storage
  private cold = new S3Client();
  
  async get(tenantId: string) {
    // L1: Memory
    if (this.memCache.has(tenantId)) {
      return this.memCache.get(tenantId);
    }
    
    // L2: Redis
    const redisData = await this.redis.get(`tenant:${tenantId}`);
    if (redisData) {
      this.memCache.set(tenantId, redisData);
      return redisData;
    }
    
    // L3: Cold storage
    const s3Data = await this.cold.getObject({
      Bucket: 'tenants',
      Key: `${tenantId}.json`
    });
    
    // Promote to warmer caches
    await this.redis.setex(`tenant:${tenantId}`, 3600, s3Data);
    this.memCache.set(tenantId, s3Data);
    
    return s3Data;
  }
}
```

## Deployment: Single Container, Infinite Sites

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: multi-tenant-app:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://cache:6379
    depends_on:
      - cache
      - db

  cache:
    image: redis:alpine
    volumes:
      - cache-data:/data

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=multitenantdb
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  cache-data:
  db-data:
```

## Nginx: Single Upstream, Smart Routing

```nginx
# All domains go to the SAME app
server {
    listen 443 ssl http2;
    server_name *.com *.net *.org;  # Or specific domains
    
    # Single upstream
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

## Admin Dashboard for Tenant Management

```typescript
// pages/admin/tenants.tsx
export function TenantManager() {
  return (
    <Dashboard>
      <TenantList />
      <TenantEditor 
        onSave={async (tenant) => {
          // Save to database
          await saveTenant(tenant);
          
          // Invalidate caches
          await invalidateCache(tenant.id);
          
          // Deploy changes instantly
          await deployTenant(tenant);
        }}
      />
      <LivePreview />
    </Dashboard>
  );
}
```

## Benefits of This Smart Approach

1. **True Multi-Tenancy**: One codebase, one deployment, infinite sites
2. **Zero Build Time**: New sites go live instantly
3. **Dynamic Everything**: Components, themes, features, pages - all configurable
4. **Cost Efficient**: One container can serve 1000+ sites
5. **Instant Updates**: Change propagates to all sites immediately
6. **A/B Testing Built-in**: Swap components per tenant for testing
7. **White Label Ready**: Clients can have completely custom experiences

## Quick Start

```bash
# 1. Install dependencies
npm install @emotion/react react-query zustand

# 2. Set up tenant config
echo '{"example.com": {"theme": "dark"}}' > tenants.json

# 3. Run single instance
npm run dev

# 4. Access different sites
# localhost:3000 with Host header: codersinflow.com
# localhost:3000 with Host header: darkflows.com
# Same app, different experience!
```

## Advanced Features

### Plugin System
```typescript
// Tenants can load custom plugins
interface Plugin {
  name: string;
  components?: Record<string, Component>;
  hooks?: Record<string, Function>;
  styles?: string;
}

registry.loadPlugin(tenant.plugins);
```

### AI-Powered Customization
```typescript
// AI generates optimal layout based on tenant's industry
const suggestedLayout = await ai.generateLayout({
  industry: tenant.industry,
  style: tenant.preferredStyle,
  competitors: tenant.competitors
});
```

### Real-time Configuration
```typescript
// WebSocket for instant updates
ws.on('tenant-update', (tenant) => {
  // No restart needed!
  cache.invalidate(tenant.id);
  reloadTenant(tenant);
});
```

This is TRUE multi-tenancy - one smart app that adapts to any domain!