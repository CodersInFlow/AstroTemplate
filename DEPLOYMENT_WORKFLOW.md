# Deployment Workflow for Multi-Site Blog Module

## ✅ VERIFIED SOLUTION: Shared Blog Module Structure

### The Correct Setup

1. **Blog module location**: `/Users/prestongarrison/Source/convert/blog-module`
2. **Sites using it**: 
   - codersinflow.com
   - prestongarrison.com
   - Any future sites

### ALL Shared Pages Live in Blog Module

The blog-module contains ALL shared pages:
```
blog-module/src/pages/
├── blog/           # Blog listing and post pages
│   ├── index.astro
│   └── [slug].astro
├── docs/           # Documentation pages
│   ├── index.astro
│   └── [slug].astro
└── editor/         # Admin/editor pages
    ├── categories/
    ├── posts/
    ├── users/
    └── all editor files
```

### Each Site Uses Symlinks to Blog Module

Sites should ONLY have site-specific homepages, everything else is symlinked:
```
codersinflow.com/src/pages/
├── index.astro (site-specific homepage)
├── blog -> ../../../../blog-module/src/pages/blog
├── docs -> ../../../../blog-module/src/pages/docs
└── editor -> ../../../../blog-module/src/pages/editor

prestongarrison.com/src/pages/
├── index.astro (site-specific homepage)
├── blog -> ../../../../blog-module/src/pages/blog
├── docs -> ../../../../blog-module/src/pages/docs
└── editor -> ../../../../blog-module/src/pages/editor

### ⚠️ CRITICAL: When editing files in blog-module

**Files edited in `/Users/prestongarrison/Source/convert/blog-module/` need to be synced to ALL sites using it:**

1. **codersinflow.com** - Main site
2. **prestongarrison.com** - Personal site  
3. **Any other sites using the shared module**

### Correct Workflow for Blog Module Changes:

1. **Edit the file in the blog-module directory:**
   ```bash
   # Edit files in the source blog-module
   /Users/prestongarrison/Source/convert/blog-module/src/...
   ```

2. **Use quick-upload.sh to sync AND build on server:**
   ```bash
   # This syncs files AND triggers server-side build
   ./quick-upload.sh
   ```

3. **The server build is what matters!**
   - Local `npm run build` does NOT deploy
   - The quick-upload script handles:
     - Syncing files (follows symlinks with -L flag)
     - Building on server with correct environment
     - Restarting services

4. **Force rebuild on server if needed:**
   ```bash
   ssh -p 12222 root@ny "cd /var/www/codersinflow.com && \
     rm -rf dist .astro && \
     PUBLIC_API_URL=https://codersinflow.com npm run build && \
     sudo systemctl restart codersinflow-astro"
   ```

### How Deployment Works

1. **Blog-module is the single source of truth**: ALL shared pages live here
2. **Sites use symlinks**: Each site symlinks to blog-module directories
3. **rsync -L follows symlinks**: Deployment expands symlinks to actual files on server
4. **Each site uses its own Layout**: The blog-module pages import `../../layouts/Layout.astro` which resolves to each site's Layout

### ✅ TESTED Deployment Process

#### For Any Changes:
```bash
# 1. Edit files ONLY in blog-module
vim /Users/prestongarrison/Source/convert/blog-module/src/pages/[path-to-file]

# 2. No copying needed! Symlinks handle everything

# 3. Deploy with quick-upload (rsync -L follows the symlinks)
cd codersinflow.com && ./quick-upload.sh frontend
cd prestongarrison.com && ./quick-upload.sh frontend
```

#### Creating Symlinks (One-time setup):
```bash
cd [site]/src/pages
ln -sf ../../../../blog-module/src/pages/blog .
ln -sf ../../../../blog-module/src/pages/docs .
ln -sf ../../../../blog-module/src/pages/editor .
```

#### For Full Deployment:
```bash
# Use deploy.sh - it handles everything including Docker containers
cd codersinflow.com && ./deploy.sh
```

### Common Pitfalls to Avoid:

❌ **DON'T** have duplicate editor files - maintain them ONLY in blog-module
❌ **DON'T** forget to copy blog-module changes to site directories before deploying
❌ **DON'T** edit files directly in site directories - always edit blog-module first
❌ **DON'T** use symlinks if they cause build issues - copy files instead

### ⚠️ Import Path Note

Blog-module files use import paths relative to their final location in src/pages/editor:
```bash
# After deployment, fix import paths based on depth:
ssh -p 12222 root@ny "
# Files in src/pages/editor/ (2 levels up from editor/)
find /var/www/codersinflow.com/src/pages/editor -maxdepth 1 -name '*.astro' \
  -exec sed -i 's|../../../../../layouts/Layout.astro|../../layouts/Layout.astro|g' {} \;

# Files in src/pages/editor/users/ (3 levels up)
find /var/www/codersinflow.com/src/pages/editor -mindepth 2 -maxdepth 2 -name '*.astro' \
  -exec sed -i 's|../../../../../layouts/Layout.astro|../../../layouts/Layout.astro|g' {} \;

# Files in src/pages/editor/users/edit/ (4 levels up)
find /var/www/codersinflow.com/src/pages/editor -mindepth 3 -name '*.astro' \
  -exec sed -i 's|../../../../../layouts/Layout.astro|../../../../layouts/Layout.astro|g' {} \;
"
```

### Quick Commands:

```bash
# Quick sync and build (PREFERRED for most changes)
./quick-upload.sh

# Full deployment (only when needed)
./deploy.sh

# Backend only
./quick-upload.sh backend

# Frontend only  
./quick-upload.sh frontend

# Force server rebuild
ssh -p 12222 root@ny "cd /var/www/codersinflow.com && PUBLIC_API_URL=https://codersinflow.com npm run build && sudo systemctl restart codersinflow-astro"
```

### Testing Changes:

1. Make the change in blog-module
2. Run `./quick-upload.sh`
3. Wait for server build to complete
4. Hard refresh browser (Cmd+Shift+R)
5. If changes don't appear, force rebuild on server

### Social Media Integration Files:

- Frontend: `/blog-module/src/pages/editor/users/edit/[id].astro`
- Backend: `/backend/internal/handlers/social*.go`
- Remember: Blog-module changes affect multiple sites!