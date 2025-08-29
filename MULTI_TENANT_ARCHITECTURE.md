# Multi-Tenant Architecture Recommendations

## Current Setup Analysis
Your current architecture uses:
- **Single container per site** with unique ports (4916/8752 for codersinflow)
- **Host nginx** routing to different containers
- **Hardcoded blog styles** in Tailwind config (`blog-bg`, `blog-card-bg`, etc.)
- **Single MongoDB** inside each container

## Recommended Architecture: Hybrid Multi-Tenant Solution

### Option 1: Domain-Based Multi-Tenancy (RECOMMENDED)
**Best for your use case - different sites with completely different looks**

```
                    Internet
                        |
                  [Host Nginx]
                 /      |      \
               /        |        \
         Site A      Site B      Site C
       Container    Container   Container
         /  \         /  \        /  \
    Frontend Backend  ...         ...
        |     |
    [Shared Blog API]
```

#### Implementation:

**1. Shared Blog Backend Service**
```yaml
# docker-compose.shared.yml
services:
  blog-api:
    container_name: shared-blog-api
    image: ${DOCKER_USERNAME}/blog-api:latest
    ports:
      - "127.0.0.1:9000:9000"  # Shared blog API
    environment:
      - MULTI_TENANT=true
      - MONGODB_URI=mongodb://admin:${MONGO_PASSWORD}@shared-mongo:27017
    networks:
      - shared-backend

  shared-mongo:
    container_name: shared-mongo
    image: mongo:7.0
    ports:
      - "127.0.0.1:27018:27017"
    volumes:
      - /var/www/shared/mongodb:/data/db
    networks:
      - shared-backend

networks:
  shared-backend:
    driver: bridge
```

**2. Tenant Configuration Structure**
```json
// tenants.config.json
{
  "tenants": {
    "codersinflow.com": {
      "id": "codersinflow",
      "name": "Coders in Flow",
      "theme": "dark-tech",
      "database": "codersinflow_blog",
      "styles": {
        "primary": "59 130 246",
        "accent": "168 85 247",
        "background": "10 10 10",
        "blog-bg": "#030712",
        "blog-card-bg": "#1f2937"
      },
      "features": {
        "blog": true,
        "comments": true,
        "analytics": true
      }
    },
    "darkflows.com": {
      "id": "darkflows",
      "name": "DarkFlows",
      "theme": "dark-red",
      "database": "darkflows_blog",
      "styles": {
        "primary": "220 38 38",
        "accent": "251 146 60",
        "background": "10 10 10",
        "blog-bg": "#0a0a0a",
        "blog-card-bg": "#1a1a1a"
      },
      "features": {
        "blog": true,
        "comments": false,
        "analytics": true
      }
    }
  }
}
```

**3. Dynamic Theme Loading in Frontend**
```typescript
// src/lib/tenant.ts
export async function getTenantConfig(domain: string) {
  const response = await fetch(`/api/tenant/${domain}`);
  return response.json();
}

export function applyTenantStyles(tenant: TenantConfig) {
  const root = document.documentElement;
  Object.entries(tenant.styles).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}
```

**4. Nginx Configuration for Multi-Tenant**
```nginx
# /etc/nginx/sites-available/multi-tenant.conf

# Map domain to tenant ID
map $host $tenant_id {
    codersinflow.com codersinflow;
    www.codersinflow.com codersinflow;
    darkflows.com darkflows;
    www.darkflows.com darkflows;
    clientsite.com clientsite;
}

# Shared blog API backend
upstream shared_blog_api {
    server 127.0.0.1:9000;
}

# Site-specific frontends
upstream codersinflow_frontend {
    server 127.0.0.1:4916;
}

upstream darkflows_frontend {
    server 127.0.0.1:4917;
}

server {
    listen 443 ssl http2;
    server_name *.com;

    # Pass tenant information to backend
    location /api/blog {
        proxy_pass http://shared_blog_api;
        proxy_set_header X-Tenant-Id $tenant_id;
        proxy_set_header X-Tenant-Domain $host;
        proxy_set_header Host $host;
    }

    # Route to appropriate frontend based on domain
    location / {
        if ($host = codersinflow.com) {
            proxy_pass http://codersinflow_frontend;
        }
        if ($host = darkflows.com) {
            proxy_pass http://darkflows_frontend;
        }
    }
}
```

### Option 2: Single Container with Dynamic Routing
**More efficient but more complex**

```yaml
# docker-compose.multi.yml
services:
  multi-tenant-app:
    container_name: multi-tenant
    image: ${DOCKER_USERNAME}/multi-tenant:latest
    ports:
      - "127.0.0.1:3000:3000"  # Single port
    environment:
      - MULTI_TENANT=true
    volumes:
      - ./tenants.config.json:/app/tenants.config.json
      - /var/www/uploads:/app/uploads  # Shared uploads
```

### Option 3: Microservices Architecture
**Most scalable but complex**

```
         [API Gateway / Nginx]
               /    |    \
         Auth API  Blog API  Media API
              \     |      /
           [Shared MongoDB]
```

## Implementation Steps

### Phase 1: Prepare Shared Blog Backend
```bash
# 1. Extract blog backend into separate service
cd backend
mkdir blog-service
mv cmd/blog/* blog-service/

# 2. Add multi-tenant middleware
```

```go
// middleware/tenant.go
func TenantMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tenantID := c.GetHeader("X-Tenant-Id")
        if tenantID == "" {
            tenantID = extractFromDomain(c.Request.Host)
        }
        
        c.Set("tenant_id", tenantID)
        c.Set("database", fmt.Sprintf("%s_blog", tenantID))
        c.Next()
    }
}
```

### Phase 2: Dynamic Styling System

**1. Create Theme Provider**
```typescript
// src/components/ThemeProvider.tsx
import { useEffect } from 'react';
import { getTenantConfig } from '@/lib/tenant';

export function ThemeProvider({ children, domain }) {
  useEffect(() => {
    const loadTheme = async () => {
      const config = await getTenantConfig(domain);
      
      // Apply CSS variables
      const root = document.documentElement;
      Object.entries(config.styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      
      // Load custom CSS if needed
      if (config.customCSS) {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = `/themes/${config.theme}.css`;
        document.head.appendChild(style);
      }
    };
    
    loadTheme();
  }, [domain]);
  
  return children;
}
```

**2. Update Tailwind Config for Dynamic Themes**
```javascript
// tailwind.config.js
module.exports = {
  content: [...],
  theme: {
    extend: {
      colors: {
        // Use CSS variables that will be set dynamically
        'tenant-primary': 'rgb(var(--tenant-primary) / <alpha-value>)',
        'tenant-accent': 'rgb(var(--tenant-accent) / <alpha-value>)',
        'tenant-bg': 'rgb(var(--tenant-bg) / <alpha-value>)',
        'blog-bg': 'var(--blog-bg)',
        'blog-card': 'var(--blog-card-bg)',
      }
    }
  }
}
```

### Phase 3: Database Isolation

```go
// Multi-tenant database connection
func GetTenantDB(tenantID string) *mongo.Database {
    client := GetMongoClient()
    dbName := fmt.Sprintf("%s_blog", tenantID)
    return client.Database(dbName)
}

// In your handlers
func GetPosts(c *gin.Context) {
    tenantID := c.GetString("tenant_id")
    db := GetTenantDB(tenantID)
    
    collection := db.Collection("posts")
    // ... rest of logic
}
```

### Phase 4: Deployment Structure

```bash
/var/www/
├── shared/
│   ├── blog-api/          # Shared blog backend
│   ├── mongodb/            # Shared MongoDB data
│   └── uploads/            # Shared uploads
├── tenants/
│   ├── codersinflow/
│   │   ├── frontend/       # Site-specific frontend
│   │   └── config.json     # Tenant config
│   ├── darkflows/
│   │   ├── frontend/
│   │   └── config.json
│   └── clientsite/
│       ├── frontend/
│       └── config.json
```

## Nginx Advanced Configuration

### Load Balancing Multiple Instances
```nginx
upstream blog_api_cluster {
    least_conn;  # Use least connections algorithm
    server 127.0.0.1:9001 weight=3;
    server 127.0.0.1:9002 weight=2;
    server 127.0.0.1:9003 weight=1;
    
    # Health checks
    keepalive 32;
}
```

### Rate Limiting per Tenant
```nginx
# Define rate limit zones per tenant
limit_req_zone $tenant_id zone=tenant_rate:10m rate=100r/s;

location /api {
    limit_req zone=tenant_rate burst=50 nodelay;
    proxy_pass http://blog_api_cluster;
}
```

## Docker Compose for Complete Setup

```yaml
# docker-compose.multi-tenant.yml
version: '3.8'

services:
  # Shared services
  shared-mongo:
    image: mongo:7.0
    volumes:
      - shared-mongo-data:/data/db
    networks:
      - backend

  blog-api:
    image: ${DOCKER_USERNAME}/blog-api:latest
    depends_on:
      - shared-mongo
    environment:
      - MULTI_TENANT=true
    networks:
      - backend
    deploy:
      replicas: 3  # Run 3 instances

  # Tenant-specific frontends
  codersinflow-frontend:
    image: ${DOCKER_USERNAME}/codersinflow-frontend:latest
    environment:
      - TENANT_ID=codersinflow
      - API_URL=http://blog-api:9000
    networks:
      - backend
    ports:
      - "127.0.0.1:4916:3000"

  darkflows-frontend:
    image: ${DOCKER_USERNAME}/darkflows-frontend:latest
    environment:
      - TENANT_ID=darkflows
      - API_URL=http://blog-api:9000
    networks:
      - backend
    ports:
      - "127.0.0.1:4917:3000"

volumes:
  shared-mongo-data:

networks:
  backend:
    driver: bridge
```

## Benefits of This Approach

1. **Resource Efficiency**
   - Shared blog backend = less memory usage
   - Single MongoDB instance with database isolation
   - Reusable components across tenants

2. **Easy Maintenance**
   - Update blog features once, all sites get updates
   - Centralized monitoring and logging
   - Single point for security updates

3. **Scalability**
   - Can add new tenants without new containers
   - Horizontal scaling of blog API
   - Load balancing built-in

4. **Customization**
   - Each tenant gets custom theme
   - Feature flags per tenant
   - Custom domains with SSL

5. **Cost Effective**
   - Fewer containers to manage
   - Shared resources
   - Better resource utilization

## Migration Path

### Week 1: Setup Infrastructure
1. Create shared blog API service
2. Setup shared MongoDB
3. Configure nginx for multi-tenant routing

### Week 2: Tenant Configuration
1. Create tenant configuration system
2. Implement dynamic theming
3. Test with codersinflow.com

### Week 3: Add Second Tenant
1. Deploy darkflows.com as second tenant
2. Verify isolation and theming
3. Test shared blog functionality

### Week 4: Production Optimization
1. Setup monitoring
2. Configure backups
3. Implement caching

## Security Considerations

1. **Data Isolation**
   - Separate databases per tenant
   - Tenant ID validation on every request
   - No cross-tenant data access

2. **Authentication**
   - JWT with tenant scope
   - Separate admin users per tenant
   - Session isolation

3. **Resource Limits**
   - Rate limiting per tenant
   - Storage quotas
   - CPU/Memory limits in Docker

## Monitoring Setup

```yaml
# Add to docker-compose
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
grafana:
  image: grafana/grafana
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  ports:
    - "3001:3000"
```

## Quick Start Commands

```bash
# 1. Build shared blog API
cd blog-service
docker build -t blog-api .

# 2. Start multi-tenant setup
docker-compose -f docker-compose.multi-tenant.yml up -d

# 3. Configure nginx
sudo cp nginx/multi-tenant.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/multi-tenant.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# 4. Add new tenant
./scripts/add-tenant.sh newsite.com
```

## Conclusion

For your use case, I recommend **Option 1: Domain-Based Multi-Tenancy** because:
- You already have the infrastructure (nginx routing, Docker)
- Minimal changes to existing setup
- Each site can have completely different looks
- Shared blog backend reduces maintenance
- Easy to add new sites

The key is separating the blog backend into a shared service while keeping site-specific frontends separate. This gives you the best of both worlds: resource efficiency and complete customization per site.