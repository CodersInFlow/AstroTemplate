# Nginx Custom Includes for Multi-Tenant System

## Overview

Each domain in the multi-tenant system can have custom nginx configurations through include files. This allows domain-specific features like WebSocket servers, API proxies, admin interfaces, etc.

## How It Works

1. **Main Config**: Each domain gets a standard nginx config from the template
2. **Custom Include**: The main config includes `/etc/nginx/includes/{domain}.conf*`
3. **Domain-Specific**: Each domain can have its own custom configuration

## File Structure

```
nginx/
├── sites-available/
│   ├── codersinflow.com.conf    # Main config (generated)
│   ├── darkflows.com.conf       # Main config (generated)
│   └── example.com.conf         # Main config (generated)
├── includes/
│   ├── codersinflow.com.conf    # Custom config (manual)
│   ├── darkflows.com.conf       # Custom config (manual)
│   └── example.com.conf         # Custom config (manual)
└── nginx.conf                    # Master nginx config
```

## Custom Include Examples

### 1. WebSocket Server

```nginx
# nginx/includes/mysite.com.conf

upstream websocket_server {
    server 127.0.0.1:8080;
}

location /ws {
    proxy_pass http://websocket_server;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # WebSocket timeout
    proxy_read_timeout 300s;
    proxy_buffering off;
}
```

### 2. Admin Interface

```nginx
# nginx/includes/mysite.com.conf

upstream admin_server {
    server 127.0.0.1:4321;
}

location /admin/ {
    proxy_pass http://admin_server/admin/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Disable caching for admin
    proxy_cache off;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 3. API Gateway

```nginx
# nginx/includes/mysite.com.conf

# External API proxy
location /external-api/ {
    proxy_pass https://api.external-service.com/;
    proxy_set_header Authorization "Bearer YOUR_API_KEY";
    proxy_set_header Host api.external-service.com;
    
    # Cache API responses
    proxy_cache_valid 200 10m;
    proxy_cache_bypass $http_pragma;
}
```

### 4. Static File Serving

```nginx
# nginx/includes/mysite.com.conf

# Serve downloads from different location
location /downloads/ {
    alias /var/www/downloads/mysite/;
    autoindex on;
    
    # Force download for certain files
    location ~ \.(zip|tar|gz)$ {
        add_header Content-Disposition "attachment";
    }
}
```

## Adding Custom Configuration

### For Existing Domain

1. Edit the include file:
   ```bash
   vim nginx/includes/yourdomain.com.conf
   ```

2. Add your custom configuration

3. Test nginx configuration:
   ```bash
   sudo nginx -t
   ```

4. Reload nginx:
   ```bash
   sudo systemctl reload nginx
   ```

### For New Domain

When you add a new site with `npm run site:add`, an empty include file is automatically created with helpful comments.

## Real Example: CodersInFlow.com

CodersInFlow.com has complex requirements:
- Admin interface at `/admin/`
- WebSocket server at `/ws`
- Multiple API endpoints (`/v1/`, `/api/v1/`, `/admin-api/`)
- Registration endpoint
- Health checks
- Special caching rules

All these are handled in `nginx/includes/codersinflow.com.conf` without affecting other domains.

## Best Practices

1. **Keep It Domain-Specific**: Only add configurations specific to that domain
2. **Document Upstreams**: Comment what each upstream server does
3. **Test Before Deploy**: Always run `nginx -t` before reloading
4. **Version Control**: Keep custom includes in git
5. **Security**: Don't expose internal services unnecessarily

## Troubleshooting

### Include Not Working

1. Check file exists: `ls -la /etc/nginx/includes/`
2. Check nginx error log: `tail -f /var/log/nginx/error.log`
3. Test configuration: `sudo nginx -t`

### Conflicts with Main Config

The include happens INSIDE the server block, so:
- ✅ Can add: `location` blocks
- ✅ Can add: `add_header` directives  
- ❌ Cannot add: `server` blocks
- ❌ Cannot add: `listen` directives

### WebSocket Not Working

Make sure you have the upgrade map:
```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
```

## Deployment

1. Edit includes locally
2. Test with Docker locally if possible
3. Deploy to server:
   ```bash
   scp -r nginx/includes/* server:/etc/nginx/includes/
   ssh server 'sudo nginx -t && sudo systemctl reload nginx'
   ```

## Summary

The custom include system allows complete flexibility for domain-specific configurations while maintaining a clean, templated base configuration for all domains. This is essential for complex sites like CodersInFlow.com that need WebSocket servers, admin interfaces, and special API handling.