# Multi-Tenant Blog System Documentation

## Overview
This document describes the multi-tenant blog system implementation for the CodersInFlow platform. The system supports multiple sites (CodersInFlow, DarkFlows, PrestonGarrison) each with their own database, theme, and content.

## Architecture

### Multi-Tenant Access Pattern
Sites are accessed using `.localhost` domains in development:
- `http://codersinflow.localhost:4321` - CodersInFlow site (dark theme, blue accents)
- `http://darkflows.localhost:4321` - DarkFlows site (dark theme, red accents)
- `http://prestongarrison.localhost:4321` - Preston Garrison site (light theme, minimal)
- `http://127.0.0.1:4321` or `http://localhost:4321` - Shows directory/default site

### Database Isolation
Each site has its own MongoDB database:
- CodersInFlow: `codersinflow_db`
- DarkFlows: `darkflows_db` 
- PrestonGarrison: `prestongarrison_db`

**Note**: There's a naming inconsistency where the backend sometimes creates databases without the `_db` suffix (e.g., `codersinflow` instead of `codersinflow_db`).

## File Structure

```
astro-multi-tenant/
├── src/
│   ├── modules/
│   │   └── blog/                    # Shared blog module
│   │       ├── BlogApp.astro        # Main router component
│   │       ├── components/
│   │       │   ├── editor/          # Admin/editor components
│   │       │   │   ├── Login.astro
│   │       │   │   ├── Dashboard.astro
│   │       │   │   ├── PostsNew.astro
│   │       │   │   ├── PostsEdit.astro
│   │       │   │   ├── RichTextEditor.tsx  # TipTap-based editor
│   │       │   │   └── ...
│   │       │   ├── BlogListing.astro
│   │       │   ├── BlogPost.astro
│   │       │   └── BlogPostViewer.tsx
│   │       └── styles/
│   │           └── blog-theme.css   # ⚠️ Currently hardcoded light theme
│   ├── sites/
│   │   ├── codersinflow.com/
│   │   │   ├── config.json         # Site configuration
│   │   │   ├── layout.astro        # Site layout
│   │   │   └── pages/
│   │   │       └── blog/
│   │   │           └── [...slug].astro  # Catch-all route
│   │   ├── darkflows.com/
│   │   │   └── (similar structure)
│   │   └── prestongarrison.com/
│   │       └── (similar structure)
│   ├── pages/
│   │   └── api/                    # API proxy endpoints
│   │       └── auth/
│   │           ├── login.ts
│   │           ├── check-admin.ts
│   │           └── create-admin.ts
│   └── middleware.ts               # Authentication middleware
```

## Color/Theme System

### CORRECT Theme Architecture Using Tailwind
Each site has its own Tailwind configuration file IN ITS SITE FOLDER that defines semantic color names. Components use these semantic names directly. NO theme props, NO hardcoded colors in components.

### How It Actually Works

#### Build Time (Not Runtime!)
1. **Each site has its own Tailwind config IN its folder**:
   - `src/sites/codersinflow.com/tailwind.config.js` - Dark theme with blue accents
   - `src/sites/darkflows.com/tailwind.config.js` - Dark/black theme with red accents  
   - `src/sites/prestongarrison.com/tailwind.config.js` - Light theme with gray accents

2. **When building/developing, specify which site**:
   ```bash
   # Development
   SITE=codersinflow.com npm run dev
   SITE=darkflows.com npm run dev
   SITE=prestongarrison.com npm run dev
   
   # Production builds
   SITE=codersinflow.com npm run build
   SITE=darkflows.com npm run build
   SITE=prestongarrison.com npm run build
   ```

3. **PostCSS loads the correct Tailwind config**:
   ```javascript
   // postcss.config.js
   const site = process.env.SITE || 'codersinflow.com';
   module.exports = {
     plugins: {
       tailwindcss: {
         config: `./src/sites/${site}/tailwind.config.js`
       }
     }
   }
   ```

4. **Each Tailwind config defines THE SAME semantic color names**:
   ```javascript
   // src/sites/codersinflow.com/tailwind.config.js
   colors: {
     'primary': '#3B82F6',         // blue for CodersInFlow
     'background': '#111827',      // dark gray
     'surface': '#1F2937',         // darker gray
     'text-primary': '#F3F4F6',    // light gray
   }
   
   // src/sites/darkflows.com/tailwind.config.js  
   colors: {
     'primary': '#DC2626',         // red for DarkFlows
     'background': '#000000',      // black
     'surface': '#111827',         // dark gray
     'text-primary': '#F3F4F6',    // light gray
   }
   
   // src/sites/prestongarrison.com/tailwind.config.js
   colors: {
     'primary': '#111827',         // dark gray for Preston
     'background': '#FFFFFF',      // white
     'surface': '#FFFFFF',         // white
     'text-primary': '#111827',    // dark gray
   }
   ```

5. **Components use ONLY semantic class names**:
   ```astro
   <!-- SAME code for ALL sites -->
   <div class="bg-background">
     <div class="bg-surface border border-border rounded-lg">
       <h1 class="text-text-primary">Title</h1>
       <p class="text-text-secondary">Description</p>
       <button class="bg-primary hover:bg-primary/90 text-white">
         Action
       </button>
     </div>
   </div>
   ```

### Why This Works
- **Build-time compilation**: Tailwind CSS is compiled at BUILD time, not runtime
- **One build per site**: Each site gets its own build with its own colors
- **Site isolation**: People can edit their site folder including Tailwind config
- **Clean separation**: No mixing of configs, no theme props, no complexity

### Implementation Steps (IN ORDER)

#### Step 1: Move Tailwind configs into site folders
```bash
# Move existing configs
mv tailwind.config.codersinflow.js src/sites/codersinflow.com/tailwind.config.js
mv tailwind.config.darkflows.js src/sites/darkflows.com/tailwind.config.js  
mv tailwind.config.prestongarrison.js src/sites/prestongarrison.com/tailwind.config.js

# Delete old configs from root
rm tailwind.config.*.js
```

#### Step 2: Update PostCSS config
```javascript
// postcss.config.js
const site = process.env.SITE || 'codersinflow.com';
module.exports = {
  plugins: {
    tailwindcss: {
      config: `./src/sites/${site}/tailwind.config.js`
    },
    autoprefixer: {},
  },
}
```

#### Step 3: Complete ALL semantic colors in each Tailwind config
Each config needs these EXACT semantic names:
- `primary`, `secondary`, `accent` - Brand colors
- `background` - Page background
- `surface`, `surface-hover` - Card/component backgrounds
- `text-primary`, `text-secondary`, `text-muted`, `text-inverse` - Text colors
- `border` - Border color
- `link`, `link-hover` - Link colors
- `success`, `warning`, `error`, `info` - Status colors

#### Step 4: Remove ALL theme props
1. Delete theme objects from:
   - `src/sites/codersinflow.com/pages/blog/[...slug].astro`
   - `src/sites/darkflows.com/pages/blog/[...slug].astro`
   - `src/sites/prestongarrison.com/pages/blog/[...slug].astro`
2. Remove `theme` prop from `BlogApp.astro`
3. Remove `theme` from all component props

#### Step 5: Update ALL components SITE-WIDE to use semantic classes

**IMPORTANT**: This applies to EVERYTHING, not just blog components!

Replace ALL hardcoded colors with semantic names:
- `bg-gray-900`, `bg-gray-800`, `bg-black` → `bg-background` or `bg-surface`
- `bg-white`, `bg-gray-50` → `bg-background` (for light themes)
- `text-gray-100`, `text-white` → `text-text-primary` or `text-text-inverse`
- `text-gray-900`, `text-black` → `text-text-primary` (for light themes)
- `text-gray-300`, `text-gray-600` → `text-text-secondary`
- `text-gray-500`, `text-gray-400` → `text-text-muted`
- `border-gray-700`, `border-gray-200` → `border-border`
- `text-blue-400`, `text-red-400` → `text-link`
- `bg-blue-500`, `bg-red-500` → `bg-primary`
- `hover:bg-blue-600` → `hover:bg-primary/90`
- etc.

**Files to update in each site folder**:
1. Main site pages:
   - `src/sites/[site]/pages/*.astro`
   - `src/sites/[site]/pages/**/*.astro`
   - `src/sites/[site]/layout.astro`
   
2. Site components:
   - `src/sites/[site]/components/**/*.astro`
   - `src/sites/[site]/components/**/*.tsx`
   
3. Blog components:
   - `src/modules/blog/components/**/*.astro`
   - `src/modules/blog/components/**/*.tsx`

**Search for these patterns to find all hardcoded colors**:
- `bg-(gray|black|white|blue|red|green|yellow)-\d+`
- `text-(gray|black|white|blue|red|green|yellow)-\d+`
- `border-(gray|black|white|blue|red|green|yellow)-\d+`
- `ring-(gray|black|white|blue|red|green|yellow)-\d+`
- `fill-(gray|black|white|blue|red|green|yellow)-\d+`
- `stroke-(gray|black|white|blue|red|green|yellow)-\d+`

#### Step 6: Update package.json scripts
```json
"scripts": {
  "dev:codersinflow": "SITE=codersinflow.com astro dev",
  "dev:darkflows": "SITE=darkflows.com astro dev",
  "dev:prestongarrison": "SITE=prestongarrison.com astro dev",
  "build:codersinflow": "SITE=codersinflow.com astro build",
  "build:darkflows": "SITE=darkflows.com astro build",
  "build:prestongarrison": "SITE=prestongarrison.com astro build"
}

### Complete Semantic Color Mappings

| Semantic Name | CodersInFlow (Dark) | DarkFlows (Black) | PrestonGarrison (Light) | Usage |
|--------------|---------------------|-------------------|-------------------------|--------|
| **Core Colors** |
| `primary` | #3B82F6 (blue-500) | #DC2626 (red-600) | #111827 (gray-900) | Main brand color, buttons |
| `secondary` | #8B5CF6 (violet-500) | #EA580C (orange-600) | #4B5563 (gray-600) | Secondary actions |
| `accent` | #10B981 (green-500) | #FACC15 (yellow-400) | #6B7280 (gray-500) | Highlights |
| **Backgrounds** |
| `background` | #111827 (gray-900) | #000000 (black) | #FFFFFF (white) | Page background |
| `surface` | #1F2937 (gray-800) | #111827 (gray-900) | #FFFFFF (white) | Cards, modals |
| `surface-hover` | #374151 (gray-700) | #1F2937 (gray-800) | #F9FAFB (gray-50) | Hover states |
| **Text Colors** |
| `text-primary` | #F3F4F6 (gray-100) | #F3F4F6 (gray-100) | #111827 (gray-900) | Main text |
| `text-secondary` | #D1D5DB (gray-300) | #D1D5DB (gray-300) | #4B5563 (gray-600) | Secondary text |
| `text-muted` | #6B7280 (gray-500) | #6B7280 (gray-500) | #9CA3AF (gray-400) | Disabled/muted |
| `text-inverse` | #111827 (gray-900) | #111827 (gray-900) | #FFFFFF (white) | Text on colored bg |
| **Interactive** |
| `link` | #60A5FA (blue-400) | #F87171 (red-400) | #374151 (gray-700) | Links |
| `link-hover` | #93C5FD (blue-300) | #FCA5A5 (red-300) | #000000 (black) | Link hover |
| `border` | #374151 (gray-700) | #1F2937 (gray-800) | #E5E7EB (gray-200) | Borders |
| **Status Colors** |
| `success` | #10B981 (green-500) | #10B981 (green-500) | #10B981 (green-500) | Success states |
| `warning` | #F59E0B (yellow-500) | #F59E0B (yellow-500) | #F59E0B (yellow-500) | Warnings |
| `error` | #EF4444 (red-500) | #EF4444 (red-500) | #EF4444 (red-500) | Errors |
| `info` | #3B82F6 (blue-500) | #3B82F6 (blue-500) | #3B82F6 (blue-500) | Information |

### Exact Color Replacement Mappings

#### CodersInFlow (Dark Theme with Blue)
```
BACKGROUNDS:
bg-gray-900 → bg-background
bg-gray-800 → bg-surface  
bg-gray-700 → bg-surface-hover
bg-white → bg-text-inverse (for white sections)

TEXT:
text-gray-100, text-white → text-text-primary
text-gray-300 → text-text-secondary
text-gray-500, text-gray-400 → text-text-muted
text-gray-900, text-black → text-text-inverse
text-blue-400, text-blue-500 → text-link
text-blue-300 → text-link-hover

BORDERS:
border-gray-700, border-gray-600 → border-border

BUTTONS/ACTIONS:
bg-blue-500, bg-blue-600 → bg-primary
bg-violet-500, bg-purple-500 → bg-secondary
bg-green-500 → bg-accent
hover:bg-blue-600 → hover:bg-primary/90
```

#### DarkFlows (Black Theme with Red)
```
BACKGROUNDS:
bg-black → bg-background
bg-gray-900 → bg-surface
bg-gray-800 → bg-surface-hover
bg-red-900, bg-red-950 → bg-surface (for dark red sections)

TEXT:
text-gray-100, text-white → text-text-primary
text-gray-300 → text-text-secondary
text-gray-500, text-gray-400 → text-text-muted
text-red-400, text-red-500 → text-link
text-red-300 → text-link-hover

BORDERS:
border-gray-800, border-gray-700 → border-border
border-red-500 → border-primary

BUTTONS/ACTIONS:
bg-red-500, bg-red-600 → bg-primary
bg-orange-500, bg-orange-600 → bg-secondary
bg-yellow-400, bg-yellow-500 → bg-accent
hover:bg-red-600 → hover:bg-primary/90
```

#### PrestonGarrison (Light Theme with Gray)
```
BACKGROUNDS:
bg-white → bg-background
bg-gray-50 → bg-surface-hover
bg-gray-100 → bg-surface-hover
bg-gray-900 → bg-text-primary (for dark sections)

TEXT:
text-gray-900, text-black → text-text-primary
text-gray-600, text-gray-700 → text-text-secondary
text-gray-400, text-gray-500 → text-text-muted
text-white → text-text-inverse
text-gray-700 → text-link
text-black → text-link-hover

BORDERS:
border-gray-200, border-gray-300 → border-border

BUTTONS/ACTIONS:
bg-gray-900, bg-black → bg-primary
bg-gray-600 → bg-secondary
bg-gray-500 → bg-accent
hover:bg-black → hover:bg-primary/90
bg-gray-100 → bg-surface
```

### Files That Need Color Updates

Based on search results, these files contain hardcoded colors:

#### Site-specific files:
**CodersInFlow** (`src/sites/codersinflow.com/`):
- `layout.astro`
- `pages/features.astro`
- `pages/download.astro`
- `pages/enterprise.astro`
- `pages/blog/[...slug].astro`

**DarkFlows** (`src/sites/darkflows.com/`):
- `pages/downloadpage.astro`
- `pages/blog/[...slug].astro`
- `components/Footer.astro`
- `components/FeatureCarousel.astro`
- `components/HeroSection.astro`
- `components/TopNavBar.astro`
- `components/FeaturedPost.astro`
- `components/DataConnectSection.astro`
- `components/ScrollReveal.astro`
- `components/FAQ.astro`

**PrestonGarrison** (`src/sites/prestongarrison.com/`):
- `pages/blog/[...slug].astro`
- `styles/global.css`

#### Shared blog components (`src/modules/blog/`):
- `components/editor/Dashboard.astro`
- `components/editor/Login.astro`
- `components/editor/PostsNew.astro`
- `components/editor/RichTextEditor.tsx`
- `components/editor/SocialPublishModal.tsx`
- `components/HeaderSimple.astro`
- Plus many editor pages in `editor/` folder

### Special Cases & Patterns

#### Opacity modifiers
- `bg-opacity-50`, `text-opacity-75` → Use Tailwind's slash notation: `bg-primary/50`, `text-primary/75`

#### Focus/Ring states
- `focus:ring-blue-500` → `focus:ring-primary`
- `focus:border-blue-500` → `focus:border-primary`
- `ring-gray-300` → `ring-border`

#### Gradients
- `from-blue-500 to-purple-500` → `from-primary to-secondary`
- `from-gray-900 to-black` → `from-background to-background`

#### Shadow colors
- `shadow-blue-500/50` → `shadow-primary/50`

#### SVG fills/strokes
- `fill-gray-400` → `fill-text-muted`
- `stroke-blue-500` → `stroke-primary`

#### Status colors (keep consistent across all sites)
- `bg-green-*`, `text-green-*` → `bg-success`, `text-success`
- `bg-red-*`, `text-red-*` → `bg-error`, `text-error`
- `bg-yellow-*`, `text-yellow-*` → `bg-warning`, `text-warning`
- `bg-blue-*` (for info) → `bg-info`, `text-info`

### Site Creation Script Updates

**IMPORTANT**: The current `scripts/add-site.sh` is OUTDATED and creates files in wrong locations!

#### Updated Site Creation Process

The script should create files in `src/sites/[sitename]/` not in `src/layouts/`!

Correct structure for a new site:

1. **Create Tailwind config in site folder**: `src/sites/[newsite]/tailwind.config.js`
   ```javascript
   module.exports = {
     content: [
       './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
       './src/sites/[newsite]/**/*.{astro,tsx}',
       './src/modules/blog/**/*.{astro,tsx}'
     ],
     theme: {
       extend: {
         colors: {
           // Define ALL semantic colors for the new site
           'primary': '#...',
           'secondary': '#...',
           'accent': '#...',
           'background': '#...',
           'surface': '#...',
           'surface-hover': '#...',
           'text-primary': '#...',
           'text-secondary': '#...',
           'text-muted': '#...',
           'text-inverse': '#...',
           'link': '#...',
           'link-hover': '#...',
           'border': '#...',
           'success': '#10B981',
           'warning': '#F59E0B',
           'error': '#EF4444',
           'info': '#3B82F6'
         }
       }
     },
     plugins: [
       require('@tailwindcss/typography'),
       require('@tailwindcss/forms'),
     ]
   }
   ```

2. **Add package.json scripts for the new site**:
   ```json
   "dev:[sitename]": "SITE=[sitename].com astro dev",
   "build:[sitename]": "SITE=[sitename].com astro build",
   ```

3. **Blog page template** (`src/sites/[newsite]/pages/blog/[...slug].astro`):
   ```astro
   ---
   export const prerender = false;
   import Layout from '../../layout.astro';
   import BlogApp from '../../../../modules/blog/BlogApp.astro';
   import config from '../../config.json';
   ---
   
   <Layout title="Blog">
     <BlogApp config={config} />
   </Layout>
   ```
   Note: NO theme prop!

4. **Use semantic colors in all site files** - Never use hardcoded colors like `bg-gray-900`

### Files Modified During Implementation

#### Core Configuration Files:
1. **postcss.config.js** - Updated to load Tailwind config from site folder based on SITE env var
2. **package.json** - Added site-specific dev and build scripts

#### Per-Site Files:
1. **Moved Tailwind configs** from root to site folders:
   - `/tailwind.config.codersinflow.js` → `/src/sites/codersinflow.com/tailwind.config.js`
   - `/tailwind.config.darkflows.js` → `/src/sites/darkflows.com/tailwind.config.js`
   - `/tailwind.config.prestongarrison.js` → `/src/sites/prestongarrison.com/tailwind.config.js`

2. **Blog pages** - Remove theme props:
   - `/src/sites/codersinflow.com/pages/blog/[...slug].astro`
   - `/src/sites/darkflows.com/pages/blog/[...slug].astro`
   - `/src/sites/prestongarrison.com/pages/blog/[...slug].astro`

#### Shared Blog Components:
1. **BlogApp.astro** - Remove theme prop handling
2. **All blog components** - Update to use semantic color classes

### Benefits of This Approach
- ✅ Single set of components works for all sites
- ✅ No theme props to pass around
- ✅ Uses Tailwind as intended
- ✅ Easy to maintain and extend
- ✅ Type-safe with IntelliSense support
- ✅ Tailwind purging works correctly

## Authentication Flow

1. **Auto-creation**: When accessing `/blog/editor/login`, the system checks for `admin@codersinflow.com` account
2. **Default credentials**: 
   - Email: `admin@codersinflow.com`
   - Password: `c0dersinflow`
3. **Session**: Uses JWT tokens stored in `auth-token` cookie
4. **Middleware**: `src/middleware.ts` protects `/blog/editor/*` routes (except `/login`)

## Blog URL Routing

The `BlogApp.astro` component handles all routing:

```
/blog                          → Blog listing
/blog/editor                   → Dashboard (requires auth)
/blog/editor/login            → Login page
/blog/editor/posts            → Posts list
/blog/editor/posts/new        → Create new post
/blog/editor/posts/edit/123   → Edit post
/blog/editor/categories       → Manage categories
/blog/editor/users            → Manage users (admin only)
/blog/post-slug               → View blog post
/blog/docs                    → Documentation listing
/blog/docs/doc-slug          → View documentation
```

## Development Setup

1. **Start MongoDB**: 
   ```bash
   docker start mongodb-dev
   # or use the dev script which handles existing containers
   ./scripts/dev.sh
   ```

2. **Start Backend** (port 3001):
   ```bash
   cd backend
   ./server
   ```

3. **Start Frontend** (port 4321):
   ```bash
   cd astro-multi-tenant
   npm run dev
   ```

4. **Access sites**:
   - http://codersinflow.localhost:4321/blog
   - http://darkflows.localhost:4321/blog
   - http://prestongarrison.localhost:4321/blog

## Known Issues & TODOs

### Critical Issues
1. ✅ **Theme System Broken**: Being fixed - removing blog-theme.css and using theme props
2. **Database Naming**: Inconsistency between `codersinflow` vs `codersinflow_db`
3. **401 Errors**: Post creation fails with authentication errors (cookie/CORS issue)

### Current Fix In Progress

#### Theme System Overhaul (IN PROGRESS)
**Approach: Semantic Tailwind Classes**

**Steps to Complete:**
1. ✅ Remove blog-theme.css file
2. ⏳ Update all three Tailwind configs with complete semantic colors
3. ⏳ Remove theme props from all blog pages and components
4. ⏳ Update all blog components to use semantic classes (bg-background, text-text-primary, etc.)
5. ⏳ Configure build/dev process to load correct Tailwind config per site
6. ⏳ Test each site to verify correct theme application

**Key Principle:** Components should ONLY use semantic class names like `bg-background`, `text-primary`, `border-border` - NEVER hardcoded colors like `bg-gray-900` or `text-blue-500`

#### 2. Fix Database Naming (Priority: MEDIUM)
- Standardize on either `sitename` or `sitename_db`
- Update backend tenant middleware
- Ensure consistent database creation

#### 3. Fix Post Creation Auth (Priority: HIGH)
- Debug why cookies aren't being sent with POST requests
- Check CORS configuration
- Verify auth token is being included in API calls

### Testing After Implementation

#### Test each site separately:
```bash
# Test CodersInFlow (dark with blue)
SITE=codersinflow.com npm run dev
# Visit http://codersinflow.localhost:4321/blog
# Should see: Dark gray background, blue accents

# Test DarkFlows (black with red)  
SITE=darkflows.com npm run dev
# Visit http://darkflows.localhost:4321/blog
# Should see: Black background, red accents

# Test PrestonGarrison (light with gray)
SITE=prestongarrison.com npm run dev
# Visit http://prestongarrison.localhost:4321/blog
# Should see: White background, gray accents
```

#### Checklist for EACH site:
- [ ] Blog listing page has correct background color
- [ ] Cards have correct surface color
- [ ] Text uses correct text colors
- [ ] Buttons use site's primary color
- [ ] Links use site's link color
- [ ] No hardcoded colors visible (no blue on red site, etc.)
- [ ] Editor dashboard matches site theme
- [ ] Login page matches site theme

## Rich Text Editor
Uses TipTap with these features:
- Bold, Italic, Headers (H1-H3)
- Bullet/Ordered lists
- Code blocks with syntax highlighting
- Blockquotes
- Links
- Image insertion
- YouTube embeds

Located in: `src/modules/blog/components/editor/RichTextEditor.tsx`

## Backend Architecture
- **Server**: Go backend at port 3001
- **Database**: MongoDB (multi-database support)
- **Auth**: JWT tokens
- **Middleware**: Tenant detection via `X-Site-Database` header

## Configuration Files
- `sites-config.json` - Backend tenant configuration
- `astro-multi-tenant/src/sites/*/config.json` - Frontend site configs
- `backend/internal/middleware/tenant.go` - Tenant middleware

## Next Steps for Development

1. **Immediate**: Decide on theme architecture (CSS variables vs props)
2. **Fix**: Update all blog components to use chosen theme system
3. **Test**: Verify each site displays correct colors
4. **Fix**: Resolve post creation 401 error
5. **Document**: Add inline comments explaining theme system
6. **Consider**: Move blog module to npm package for better isolation

## Useful Commands

```bash
# Check MongoDB databases
docker exec mongodb-dev mongosh --eval "show dbs"

# Check users in a database
docker exec mongodb-dev mongosh codersinflow_db --eval "db.users.find().pretty()"

# Test backend API
curl -X POST http://127.0.0.1:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Site-Database: codersinflow_db" \
  -d '{"email":"admin@codersinflow.com","password":"c0dersinflow"}'

# Watch for file changes
npm run dev -- --host
```

## Important Notes
- The `.localhost` domain works automatically in modern browsers (no /etc/hosts needed)
- Each site must have a `[...slug].astro` page that imports BlogApp
- Theme props must be passed from the site page to BlogApp to all child components
- The backend uses the `X-Site-Database` header to determine which database to use