# Multi-Tenant CORS and Production Configuration

## Overview

The multi-tenant system now supports dynamic CORS handling for multiple domains in production. This allows the same backend API to serve multiple frontend domains securely.

## Key Changes

### 1. Dynamic CORS Middleware

Located in `backend/internal/middleware/cors.go`, this middleware:
- Automatically allows configured domains
- Reads allowed domains from environment variables or sites-config.json
- Supports both development (permissive) and production (strict) modes

### 2. Backend Configuration

The backend now:
- Uses `DynamicCORSMiddleware` instead of hardcoded CORS origins
- Applies `TenantMiddleware` to identify which site is making requests
- Supports tenant-specific database connections

### 3. Frontend API Configuration

- **Development**: Uses `PUBLIC_API_URL` environment variable (e.g., `http://127.0.0.1:3001`)
- **Production**: Uses relative `/api` path that gets proxied to backend

### 4. Production Environment Variables

Set these in `.env.production` or as environment variables:

```bash
# Environment
ENV=production

# Allowed domains for CORS (comma-separated)
ALLOWED_DOMAINS=codersinflow.com,darkflows.com,yourdomain.com

# MongoDB
MONGODB_URI=mongodb://admin:password@mongodb:27017/?authSource=admin

# Sites configuration
SITES_CONFIG_PATH=/app/sites-config.json
```

## Docker Configuration

The multi-tenant Docker container:
1. Builds all frontend sites
2. Runs a Node.js proxy server that:
   - Routes requests to correct frontend based on domain
   - Proxies `/api` requests to backend with tenant headers
   - Adds tenant information to backend requests
3. Backend receives tenant info and serves appropriate data

## Adding New Domains

To add a new domain to the multi-tenant system:

1. **Update sites-config.json**:
```json
{
  "newdomain.com": {
    "id": "newsite",
    "directory": "newsite",
    "database": "newsite_db",
    "theme": "dark",
    "features": ["blog", "docs"]
  }
}
```

2. **Add domain to ALLOWED_DOMAINS** in production environment:
```bash
ALLOWED_DOMAINS=codersinflow.com,darkflows.com,newdomain.com
```

3. **Create frontend directory** in `frontends/newdomain.com/`

4. **Build and deploy** the updated container

## Testing CORS Locally

To test CORS with different ports:

```bash
# Start backend with specific CORS origin
CORS_ORIGIN=http://127.0.0.1:4322 go run cmd/server/main.go

# Start frontend with API URL
PUBLIC_API_URL=http://127.0.0.1:3001 npm run dev
```

## Security Notes

1. **Production Mode**: Only explicitly configured domains are allowed
2. **Development Mode**: More permissive for testing
3. **Credentials**: The system supports credentials (cookies) for authentication
4. **Headers**: Custom headers for tenant identification are allowed

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check that the domain is in `ALLOWED_DOMAINS`
2. Verify the backend is running with correct environment
3. Check browser console for specific CORS error details

### API Connection Issues

If frontend can't connect to API:
1. In development: Check `PUBLIC_API_URL` is set correctly
2. In production: Verify proxy configuration in `docker/server.js`
3. Check backend logs for incoming requests

### Tenant Identification Issues

If wrong data is being served:
1. Check `X-Tenant-Domain` header in requests
2. Verify sites-config.json mapping
3. Check backend tenant middleware logs