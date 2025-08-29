# Modular Component System with Site-Aware Database Routing

## The Concept: Smart Components That Adapt

```typescript
// Any component can be site-aware
<BlogComponent site="codersinflow" />  // Uses codersinflow_blog DB
<BlogComponent site="darkflows" />     // Uses darkflows_blog DB
<BlogComponent />                      // Uses default_blog DB

// Future modules work the same way
<ForumComponent site="codersinflow" />
<ShopComponent site="darkflows" />
<AnalyticsComponent site="clientabc" />
```

## Implementation: Site-Aware API Routes

### Backend: Smart Database Selection

```go
// backend/middleware/database.go
func DatabaseMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Get site from header, query param, or domain
        site := c.GetHeader("X-Site-Id")
        if site == "" {
            site = c.Query("site")
        }
        if site == "" {
            // Extract from domain
            host := c.GetHeader("Host")
            site = extractSiteFromDomain(host)
        }
        if site == "" {
            site = "default"
        }
        
        // Set database name for this request
        dbName := fmt.Sprintf("%s_blog", site)
        c.Set("database", dbName)
        c.Set("site", site)
        
        c.Next()
    }
}

// backend/handlers/blog.go
func GetPosts(c *gin.Context) {
    dbName := c.GetString("database") // Automatically gets right DB
    db := mongoClient.Database(dbName)
    
    posts := db.Collection("posts").Find(...)
    c.JSON(200, posts)
}
```

### Frontend: Site-Aware Components

```typescript
// components/BlogComponent.tsx
interface BlogComponentProps {
  site?: string;  // Optional site identifier
  theme?: 'inherit' | 'custom';  // Use site theme or custom
  className?: string;
}

export function BlogComponent({ site, theme = 'inherit', className }: BlogComponentProps) {
  const currentSite = site || useCurrentSite(); // Auto-detect if not specified
  
  // Fetch posts from the right database
  const { data: posts } = useQuery({
    queryKey: ['posts', currentSite],
    queryFn: () => fetch(`/api/blog/posts?site=${currentSite}`).then(r => r.json())
  });
  
  // Get theme for this site
  const siteTheme = theme === 'inherit' ? getSiteTheme(currentSite) : null;
  
  return (
    <div className={`blog-container ${siteTheme?.className} ${className}`}>
      {posts?.map(post => (
        <BlogPost key={post.id} {...post} theme={siteTheme} />
      ))}
    </div>
  );
}
```

## Database Structure: Clean Separation

```
MongoDB Instance
├── codersinflow_blog     # Blog posts for codersinflow
├── codersinflow_users    # Users for codersinflow
├── codersinflow_shop     # Shop data for codersinflow
├── darkflows_blog        # Blog posts for darkflows
├── darkflows_docs        # Documentation for darkflows
├── clientabc_blog        # Blog for client
└── shared_assets         # Shared across all sites (optional)
```

## Theme System: Each Site's Look

```typescript
// themes/registry.ts
const themes = {
  codersinflow: {
    className: 'theme-coders',
    colors: {
      primary: '#3B82F6',
      background: '#0A0A0A',
      card: '#1F2937'
    },
    fonts: {
      heading: 'font-mono',
      body: 'font-sans'
    }
  },
  darkflows: {
    className: 'theme-darkflows',
    colors: {
      primary: '#DC2626',
      background: '#000000',
      card: '#1A1A1A'
    },
    fonts: {
      heading: 'font-serif',
      body: 'font-sans'
    }
  }
};
```

```css
/* styles/themes.css */
.theme-coders {
  --primary: 59 130 246;
  --background: 10 10 10;
  --card-bg: 31 41 55;
}

.theme-coders .blog-card {
  @apply bg-gray-800 border-blue-500;
}

.theme-darkflows {
  --primary: 220 38 38;
  --background: 0 0 0;
  --card-bg: 26 26 26;
}

.theme-darkflows .blog-card {
  @apply bg-black border-red-500;
}
```

## Usage Examples

### 1. Blog on Main Site (Inherits Everything)

```astro
---
// pages/blog.astro on codersinflow.com
import BlogComponent from '@shared/components/BlogComponent';
---

<Layout>
  <!-- Automatically uses codersinflow DB and theme -->
  <BlogComponent />
</Layout>
```

### 2. Embedding Different Site's Blog

```astro
---
// Show darkflows blog posts on codersinflow site
---

<Layout>
  <h2>Partner Content from DarkFlows</h2>
  <!-- Uses darkflows DB but codersinflow styling -->
  <BlogComponent site="darkflows" theme="inherit" />
</Layout>
```

### 3. Admin Dashboard Showing All Sites

```tsx
// admin/dashboard.tsx
export function AdminDashboard() {
  const sites = ['codersinflow', 'darkflows', 'clientabc'];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {sites.map(site => (
        <div key={site}>
          <h3>{site} Recent Posts</h3>
          <BlogComponent 
            site={site} 
            theme="custom"
            className="admin-style"
          />
        </div>
      ))}
    </div>
  );
}
```

## Future Modules Work the Same Way

### Forum Module

```typescript
// components/ForumComponent.tsx
export function ForumComponent({ site }: { site?: string }) {
  const currentSite = site || useCurrentSite();
  
  const { data: threads } = useQuery({
    queryKey: ['forum', currentSite],
    queryFn: () => fetch(`/api/forum/threads?site=${currentSite}`)
  });
  
  return <ForumLayout threads={threads} theme={getSiteTheme(currentSite)} />;
}
```

### E-Commerce Module

```typescript
// components/ShopComponent.tsx
export function ShopComponent({ site }: { site?: string }) {
  const currentSite = site || useCurrentSite();
  
  const { data: products } = useQuery({
    queryKey: ['products', currentSite],
    queryFn: () => fetch(`/api/shop/products?site=${currentSite}`)
  });
  
  return <ProductGrid products={products} theme={getSiteTheme(currentSite)} />;
}
```

### Analytics Module

```typescript
// components/AnalyticsComponent.tsx
export function AnalyticsComponent({ site }: { site?: string }) {
  const currentSite = site || useCurrentSite();
  
  const { data: stats } = useQuery({
    queryKey: ['analytics', currentSite],
    queryFn: () => fetch(`/api/analytics/stats?site=${currentSite}`)
  });
  
  return <StatsDisplay stats={stats} theme={getSiteTheme(currentSite)} />;
}
```

## API Endpoints: Consistent Pattern

```typescript
// All modules follow same pattern
GET /api/blog/posts?site=codersinflow
GET /api/forum/threads?site=darkflows
GET /api/shop/products?site=clientabc
GET /api/analytics/stats?site=codersinflow

// Or use headers
GET /api/blog/posts
Headers: X-Site-Id: codersinflow
```

## Configuration: Simple Site Registry

```json
// sites.config.json
{
  "sites": {
    "codersinflow": {
      "modules": ["blog", "forum", "shop"],
      "theme": "dark-tech",
      "databases": {
        "blog": "codersinflow_blog",
        "forum": "codersinflow_forum",
        "shop": "codersinflow_shop"
      }
    },
    "darkflows": {
      "modules": ["blog", "docs"],
      "theme": "dark-red",
      "databases": {
        "blog": "darkflows_blog",
        "docs": "darkflows_docs"
      }
    },
    "clientabc": {
      "modules": ["blog"],
      "theme": "light",
      "databases": {
        "blog": "clientabc_blog"
      }
    }
  },
  "defaults": {
    "database": "default_db",
    "theme": "light"
  }
}
```

## Automatic Site Detection

```typescript
// hooks/useCurrentSite.ts
export function useCurrentSite() {
  // Multiple detection methods
  
  // 1. From domain
  const domain = window.location.hostname;
  const site = domainToSite[domain];
  if (site) return site;
  
  // 2. From subdomain
  const subdomain = domain.split('.')[0];
  if (sites.includes(subdomain)) return subdomain;
  
  // 3. From path (for local dev)
  // localhost:3000/sites/codersinflow/blog
  const pathMatch = window.location.pathname.match(/^\/sites\/([^\/]+)/);
  if (pathMatch) return pathMatch[1];
  
  // 4. From localStorage (for testing)
  const override = localStorage.getItem('site-override');
  if (override) return override;
  
  return 'default';
}
```

## Development Tools

```bash
# Test different sites locally
SITE=codersinflow npm run dev
SITE=darkflows npm run dev

# Or use query params
http://localhost:3000/blog?site=darkflows

# Or use localStorage in browser console
localStorage.setItem('site-override', 'darkflows');
```

## Benefits of This Approach

1. **True Modularity** - Any component can work with any site
2. **Data Isolation** - Each site has its own databases
3. **Theme Flexibility** - Components adapt to site themes
4. **Easy Testing** - Switch sites without redeploying
5. **Cross-Pollination** - Show content from one site on another
6. **Future Proof** - New modules automatically work with all sites
7. **Developer Friendly** - Clear, consistent patterns

## Migration Path for Existing Code

```typescript
// Old component (hardcoded)
function BlogList() {
  const posts = fetch('/api/posts'); // Always same DB
  return <div className="blog-style">...</div>; // Always same style
}

// New component (site-aware)
function BlogList({ site }) {
  const posts = fetch(`/api/posts?site=${site}`); // Dynamic DB
  const theme = getSiteTheme(site); // Dynamic theme
  return <div className={theme.blogStyle}>...</div>;
}
```

## Real-World Example: News Aggregator

```typescript
// Show blog posts from multiple sites
export function NewsAggregator() {
  const sites = ['codersinflow', 'darkflows', 'techblog', 'devnews'];
  
  return (
    <div className="news-grid">
      {sites.map(site => (
        <section key={site}>
          <h2>{site} Latest</h2>
          <BlogComponent 
            site={site}
            limit={3}
            theme="custom"
            className="news-card"
          />
        </section>
      ))}
    </div>
  );
}
```

This approach scales beautifully - whether you have 2 sites or 200, the same patterns work!