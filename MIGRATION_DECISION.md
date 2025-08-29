# Migration Decision: Single-Site vs Multi-Tenant

## Current Situation

We have two complete deployment systems:

### Single-Site System (Original)
- **Scripts**: `dev.sh`, `deploy.sh`, `build-docker.sh`
- **Config**: `site.config.json`
- **Directories**: Root `src/`, `public/`
- **Docker**: `Dockerfile`, `docker-compose.yml`

### Multi-Tenant System (New)
- **Scripts**: `dev-multi-tenant.sh`, `build-docker-multi-tenant.sh`
- **Config**: `sites-config.json`
- **Directories**: `frontends/*/`
- **Docker**: `Dockerfile.multi-tenant`, `docker-compose.multi-tenant.yml`

## The Question

Should we remove the single-site scripts (`dev.sh`, `deploy.sh`) since we're on the multi-tenant branch?

## Recommendation: REMOVE Single-Site Scripts

### Why Remove?

1. **We're on the multi-tenant branch** - This branch is specifically for multi-tenant
2. **Avoids confusion** - Having two dev.sh scripts doing different things is confusing
3. **Cleaner codebase** - Less scripts to maintain
4. **Easy rollback** - Original scripts are in the main/master branch if needed
5. **Multi-tenant can do single-site** - You can run multi-tenant with just one site

### What to Remove

```bash
# Single-site scripts (remove from multi-tenant branch)
dev.sh                  # Single-site Docker dev
deploy.sh               # Single-site deployment
build-docker.sh         # Single-site Docker build
deploy-docker.sh        # Single-site Docker deployment
setup.sh                # Single-site setup

# Single-site configs (consider removing)
Dockerfile              # Single-site Dockerfile
docker-compose.yml      # Single-site compose
docker-compose.dev.yml  # Single-site dev compose
.env.development        # Single-site env

# Keep root src/ and public/ for now
# (can be removed later after confirming multi-tenant works)
```

### What to Keep

```bash
# Multi-tenant scripts (keep)
dev-multi-tenant.sh
build-docker-multi-tenant.sh
scripts/dev-multi-tenant.js
scripts/build-multi-tenant.sh

# Multi-tenant configs (keep)
Dockerfile.multi-tenant
docker-compose.multi-tenant.yml
sites-config.json

# Directories (keep)
frontends/
backend/
docker/
```

## Migration Path

If someone needs single-site:
1. Use the main/master branch (has all single-site scripts)
2. Or run multi-tenant with just one site configured

## Decision

Since this is the **multi-tenant branch**, we should:
1. Remove single-site scripts to avoid confusion
2. Keep multi-tenant scripts only
3. Document that single-site mode is available in main branch

This makes the branch purpose clear: **multi-tenant deployment**.