# Middleware Architecture Guide

## Overview

This document outlines strategies for implementing middleware in our multi-tenant Astro application, with a focus on modular, maintainable patterns that prevent common issues like the "response already sent" error.

## The Problem: Response Already Sent Error

When using Astro with Layouts, attempting to redirect from within a component that's wrapped by a Layout will fail with:

```
ResponseSentError: Unable to set response. 
The response has already been sent to the browser and cannot be altered.
```

### Why This Happens

```
Request Flow:
1. Request → Page Component
2. Page → Starts rendering Layout
3. Layout → Sends response headers to browser ← POINT OF NO RETURN
4. Layout → Renders child components
5. Child → Attempts redirect ❌ TOO LATE!
```

## The Solution: Middleware

Middleware runs **BEFORE** any page rendering begins, allowing safe redirects and response modifications.

```
Request Flow with Middleware:
1. Request → Middleware ← CAN REDIRECT HERE ✅
2. Middleware → Page Component
3. Page → Layout
4. Layout → Child Components
```

## Implementation Patterns

### Pattern 1: Direct Module Import (Recommended for Starting)

Simple and explicit - each module exports its middleware function.

#### Main Middleware File
```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { getTenantFromHost } from './shared/lib/tenant';

// Import middleware from modules
import { blogMiddleware } from './modules/blog/middleware';
import { shopMiddleware } from './modules/shop/middleware';
import { forumMiddleware } from './modules/forum/middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  
  // Add tenant info to context for all requests
  const hostname = context.request.headers.get('host') || '127.0.0.1:4321';
  const tenant = getTenantFromHost(hostname);
  context.locals.tenant = tenant;
  context.locals.database = tenant.database || tenant.id;
  
  // Run module-specific middleware based on path
  if (url.pathname.startsWith('/blog')) {
    return blogMiddleware(context, next);
  }
  
  if (url.pathname.startsWith('/shop')) {
    return shopMiddleware(context, next);
  }
  
  if (url.pathname.startsWith('/forum')) {
    return forumMiddleware(context, next);
  }
  
  // No module middleware needed
  return next();
});
```

#### Module Middleware
```typescript
// src/modules/blog/middleware.ts
import { API_URL } from '../../shared/lib/api-config';

export async function blogMiddleware(context, next) {
  const { url, cookies, redirect, locals } = context;
  const pathname = url.pathname;
  
  // Define protected routes
  const PROTECTED_PATTERNS = [
    /^\/blog\/editor(?!\/login|\/register)/,  // Editor except login/register
    /^\/blog\/api\/admin/,                     // Admin API endpoints
  ];
  
  // Check if route needs protection
  const isProtected = PROTECTED_PATTERNS.some(pattern => 
    pattern.test(pathname)
  );
  
  if (!isProtected) {
    return next();
  }
  
  // Check authentication
  const token = cookies.get('auth-token');
  
  if (!token) {
    return redirect('/blog/editor/login');
  }
  
  // Verify token with backend
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Cookie': `auth-token=${token.value}`,
        'X-Site-Database': locals.database
      }
    });
    
    if (!response.ok) {
      cookies.delete('auth-token', { path: '/' });
      return redirect('/blog/editor/login');
    }
    
    // Store user info for components to use
    const user = await response.json();
    locals.user = user;
    
  } catch (error) {
    console.error('Auth verification failed:', error);
    return redirect('/blog/editor/login');
  }
  
  return next();
}
```

### Pattern 2: Dynamic Module Loading

Automatically discover and load module middleware.

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { loadModuleMiddleware } from './shared/lib/module-loader';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  
  // Extract module name from path
  const moduleName = url.pathname.split('/').filter(Boolean)[0];
  
  if (!moduleName) {
    return next();
  }
  
  // Try to load middleware for this module
  const moduleMiddleware = await loadModuleMiddleware(moduleName);
  
  if (moduleMiddleware) {
    return moduleMiddleware(context, next);
  }
  
  return next();
});
```

```typescript
// src/shared/lib/module-loader.ts
const middlewareCache = new Map();

export async function loadModuleMiddleware(moduleName: string) {
  if (middlewareCache.has(moduleName)) {
    return middlewareCache.get(moduleName);
  }
  
  try {
    const module = await import(`../../modules/${moduleName}/middleware.ts`);
    if (module.middleware) {
      middlewareCache.set(moduleName, module.middleware);
      return module.middleware;
    }
  } catch (e) {
    // No middleware for this module
  }
  
  return null;
}
```

### Pattern 3: Configuration-Based Middleware

Modules export configuration objects defining their middleware needs.

```typescript
// src/modules/blog/middleware.config.ts
export const middlewareConfig = {
  routes: [
    {
      pattern: /^\/blog\/editor(?!\/login)/,
      handlers: ['requireAuth', 'checkPermissions']
    },
    {
      pattern: /^\/blog\/api\//,
      handlers: ['requireApiAuth', 'rateLimit']
    }
  ],
  handlers: {
    requireAuth: async (context, next) => {
      const token = context.cookies.get('auth-token');
      if (!token) {
        return context.redirect('/blog/editor/login');
      }
      // Verify token...
      return next();
    },
    checkPermissions: async (context, next) => {
      const user = context.locals.user;
      if (!user?.permissions?.canEdit) {
        return context.redirect('/blog/unauthorized');
      }
      return next();
    },
    requireApiAuth: async (context, next) => {
      // API authentication logic
      return next();
    },
    rateLimit: async (context, next) => {
      // Rate limiting logic
      return next();
    }
  }
};
```

### Pattern 4: Middleware Chain (Most Flexible)

Support multiple middleware functions per module in a composable chain.

```typescript
// src/modules/blog/middleware/index.ts
import { authMiddleware } from './auth';
import { rateLimitMiddleware } from './rateLimit';
import { loggingMiddleware } from './logging';
import { corsMiddleware } from './cors';

export const middlewareChain = [
  loggingMiddleware,    // Runs first
  corsMiddleware,       // Then CORS
  rateLimitMiddleware,  // Then rate limiting
  authMiddleware        // Finally auth
];
```

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { getModuleMiddleware } from './shared/lib/module-registry';

export const onRequest = defineMiddleware(async (context, next) => {
  const moduleName = context.url.pathname.split('/')[1];
  const middlewareChain = await getModuleMiddleware(moduleName);
  
  if (!middlewareChain) {
    return next();
  }
  
  // Execute middleware chain
  let index = 0;
  
  async function executeNext() {
    if (index >= middlewareChain.length) {
      return next();
    }
    
    const middleware = middlewareChain[index++];
    return middleware(context, executeNext);
  }
  
  return executeNext();
});
```

## Best Practices

### 1. Keep Middleware Focused
Each middleware function should have a single responsibility:
- Authentication
- Authorization
- Rate limiting
- Logging
- CORS
- etc.

### 2. Order Matters
```typescript
// Good order:
[
  loggingMiddleware,      // Log all requests
  corsMiddleware,         // Handle CORS early
  rateLimitMiddleware,    // Block excessive requests
  authMiddleware,         // Authenticate user
  authorizationMiddleware // Check permissions
]
```

### 3. Use Context Locals for Data Passing
```typescript
// In middleware:
context.locals.user = authenticatedUser;
context.locals.database = tenantDatabase;
context.locals.permissions = userPermissions;

// In components:
const { user, database, permissions } = Astro.locals;
```

### 4. Handle Errors Gracefully
```typescript
export async function authMiddleware(context, next) {
  try {
    // Auth logic
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Don't expose internal errors
    return context.redirect('/error?code=500');
  }
}
```

### 5. Cache Expensive Operations
```typescript
const userCache = new Map();

export async function authMiddleware(context, next) {
  const token = context.cookies.get('auth-token');
  
  // Check cache first
  if (userCache.has(token.value)) {
    context.locals.user = userCache.get(token.value);
    return next();
  }
  
  // Fetch and cache
  const user = await fetchUser(token);
  userCache.set(token.value, user);
  context.locals.user = user;
  
  return next();
}
```

## Multi-Tenant Considerations

### Tenant-Aware Middleware
```typescript
export async function tenantMiddleware(context, next) {
  const hostname = context.request.headers.get('host');
  const tenant = getTenantFromHost(hostname);
  
  // Make tenant info available everywhere
  context.locals.tenant = tenant;
  context.locals.database = tenant.database;
  context.locals.theme = tenant.theme;
  
  // Tenant-specific logic
  if (tenant.maintenance) {
    return context.redirect('/maintenance');
  }
  
  return next();
}
```

### Per-Tenant Feature Flags
```typescript
export async function featureMiddleware(context, next) {
  const { tenant } = context.locals;
  
  // Check if feature is enabled for this tenant
  if (context.url.pathname.startsWith('/shop') && !tenant.features.shop) {
    return context.redirect('/404');
  }
  
  return next();
}
```

## Implementation Roadmap

### Phase 1: Basic Auth Middleware
- [ ] Move blog authentication to middleware
- [ ] Remove redirect logic from components
- [ ] Test with all tenants

### Phase 2: Modular Structure
- [ ] Create middleware files in each module
- [ ] Implement Pattern 1 (Direct Import)
- [ ] Add logging middleware

### Phase 3: Advanced Features
- [ ] Add rate limiting
- [ ] Implement caching
- [ ] Add CORS handling
- [ ] Performance monitoring

### Phase 4: Full Flexibility
- [ ] Implement Pattern 4 (Middleware Chain)
- [ ] Add middleware configuration UI
- [ ] Per-tenant middleware customization

## Benefits of Middleware Approach

1. **No Timing Issues**: Redirects happen before rendering
2. **Centralized Logic**: One place for auth, not scattered
3. **Better Performance**: Single auth check vs multiple
4. **Cleaner Components**: Components just render, no auth logic
5. **Testability**: Middleware can be tested in isolation
6. **Reusability**: Modules with middleware are portable
7. **Multi-Tenant**: Each tenant can have custom middleware

## Common Pitfalls to Avoid

### ❌ Don't: Mix Redirect Logic
```astro
---
// Component file - DON'T DO THIS
if (!user) {
  return Astro.redirect('/login'); // Will fail if wrapped in Layout!
}
---
```

### ✅ Do: Use Middleware for Auth
```typescript
// Middleware - DO THIS
if (!token) {
  return context.redirect('/login'); // Safe, happens before rendering
}
```

### ❌ Don't: Duplicate Auth Checks
```astro
---
// Every component checking auth - DON'T DO THIS
const token = Astro.cookies.get('auth-token');
if (!token) { /* ... */ }
---
```

### ✅ Do: Check Once in Middleware
```typescript
// Middleware - DO THIS ONCE
context.locals.user = authenticatedUser;

// Components - JUST USE IT
const { user } = Astro.locals;
```

## Testing Middleware

### Unit Testing
```typescript
import { describe, it, expect } from 'vitest';
import { authMiddleware } from './auth';

describe('Auth Middleware', () => {
  it('redirects when no token', async () => {
    const context = {
      cookies: { get: () => null },
      redirect: (url) => ({ redirectUrl: url })
    };
    
    const result = await authMiddleware(context, () => {});
    expect(result.redirectUrl).toBe('/login');
  });
});
```

### Integration Testing
```typescript
import { preview } from 'astro';

describe('Protected Routes', () => {
  it('requires authentication for /blog/editor', async () => {
    const response = await fetch('http://localhost:4321/blog/editor');
    expect(response.redirected).toBe(true);
    expect(response.url).toContain('/login');
  });
});
```

## Conclusion

Middleware is the correct architectural pattern for handling cross-cutting concerns like authentication, authorization, and request processing in Astro applications. By implementing modular middleware:

1. We avoid the "response already sent" error
2. Keep our code organized and maintainable
3. Support multi-tenant requirements elegantly
4. Enable easy testing and debugging
5. Allow modules to be self-contained and portable

Start with Pattern 1 (Direct Import) for simplicity, and evolve to Pattern 4 (Middleware Chain) as complexity grows.