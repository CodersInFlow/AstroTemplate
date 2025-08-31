# Astro Multi-Tenant Application

A sophisticated multi-tenant web application built with Astro, supporting multiple sites with distinct themes, configurations, and content - all from a single codebase.

## 🏗️ Architecture Overview

### How It Works

1. **Request Routing**: When a request arrives (e.g., `darkflows.localhost:4321`), the system:
   - Extracts the hostname from request headers
   - Maps it to a site configuration via `sites-config.json`
   - Dynamically loads the appropriate site's layout and pages
   - Serves site-specific content with isolated CSS

2. **Site Isolation**: Each site maintains complete independence:
   - Separate Tailwind configurations
   - Isolated CSS generation
   - Custom components and layouts
   - Independent content and assets

3. **Dynamic Site Loading**: The router (`src/pages/[...slug].astro`) dynamically imports site-specific resources based on the hostname.

## 📁 Project Structure

```
astro-multi-tenant/
├── src/
│   ├── pages/
│   │   └── [...slug].astro          # Dynamic router for all sites
│   ├── sites/                       # Site-specific configurations
│   │   ├── codersinflow.com/
│   │   │   ├── layout.astro         # Site layout wrapper
│   │   │   ├── tailwind.config.cjs  # Site-specific Tailwind config
│   │   │   ├── styles/
│   │   │   │   └── main.css        # Generated CSS (do not edit)
│   │   │   ├── pages/              # Site pages
│   │   │   ├── components/         # Site-specific components
│   │   │   └── config.json         # Site configuration
│   │   ├── darkflows.com/
│   │   └── prestongarrison.com/
│   ├── shared/
│   │   ├── components/             # Shared components across sites
│   │   └── lib/
│   │       └── tenant.ts           # Tenant resolution logic
│   └── middleware.ts               # Authentication and routing middleware
├── scripts/
│   ├── generate-all-css.sh        # CSS generation for all sites
│   └── add-a-site.sh              # Script to add new sites
└── sites-config.json              # Master site configuration (parent directory)
```

## 🎨 Theming System

### Semantic Color System

Each site uses semantic color names that map to different actual colors:

```javascript
// Same class names, different colors per site
'background'    // Black for DarkFlows, White for Preston, Dark gray for CodersInFlow
'primary'       // Red for DarkFlows, Blue for CodersInFlow, Gray for Preston
'text-primary'  // Light for dark themes, Dark for light themes
```

### CSS Generation Pipeline

1. **Build Time**: 
   - `npm run dev` triggers `generate-all-css.sh`
   - For each site with `tailwind.config.cjs`:
     - Generates CSS using site's Tailwind config
     - Outputs to `site/styles/main.css`

2. **Runtime**:
   - Each layout imports its CSS as raw text: `import styles from './styles/main.css?raw'`
   - CSS is injected inline: `<style set:html={styles}></style>`
   - Ensures complete CSS isolation between sites

### Available Semantic Classes

#### Background Colors
- `bg-background` - Main page background
- `bg-surface` - Card/component backgrounds
- `bg-surface-hover` - Hover state for surfaces
- `bg-primary` - Primary brand color
- `bg-secondary` - Secondary brand color
- `bg-accent` - Accent color

#### Text Colors
- `text-text-primary` - Main text color
- `text-text-secondary` - Secondary text color
- `text-text-muted` - Muted/disabled text
- `text-text-inverse` - Text on inverted backgrounds
- `text-link` - Link color
- `text-link-hover` - Link hover color

#### Other
- `border-border` - Border colors
- Status colors: `success`, `warning`, `error`, `info`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate CSS for all sites
npm run generate-css

# Start development server
npm run dev
```

### Accessing Sites

With the dev server running, access sites via:
- http://codersinflow.localhost:4321
- http://darkflows.localhost:4321
- http://prestongarrison.localhost:4321

Or directly via localhost (defaults to first configured site):
- http://localhost:4321

## 🛠️ Development

### Adding a New Site

Use the automated script:
```bash
./scripts/add-a-site.sh yourdomain.com
```

Or see [ADD_A_SITE.md](./ADD_A_SITE.md) for manual instructions.

### Site-Specific Development

```bash
# Develop a specific site
npm run dev:codersinflow
npm run dev:darkflows
npm run dev:prestongarrison

# Build a specific site
npm run build:codersinflow
```

### Creating Site Pages

Add pages to `src/sites/[domain]/pages/`:
```astro
---
// src/sites/yourdomain.com/pages/about.astro
import Layout from '../layout.astro';
---

<Layout title="About">
  <h1 class="text-text-primary">About Us</h1>
  <div class="bg-surface p-4">
    <p class="text-text-secondary">Content here...</p>
  </div>
</Layout>
```

### Using Shared Components

```astro
---
// Import shared components
import Button from '../../../shared/components/Button.astro';
---

<Button class="bg-primary text-text-inverse">
  Click Me
</Button>
```

## 🔧 Configuration

### Site Configuration (`sites-config.json`)

Located in the parent directory, maps domains to site configurations:

```json
{
  "yourdomain.com": {
    "id": "yourdomain",
    "directory": "yourdomain.com",
    "database": "yourdomain_db",
    "theme": "light|dark",
    "features": ["blog", "auth", "payments"]
  }
}
```

### Tailwind Configuration

Each site has its own `tailwind.config.cjs`:

```javascript
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/sites/yourdomain.com/**/*.{astro,tsx}',
    './src/shared/components/**/*.{astro,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#YourColor',
        'background': '#YourBackground',
        // ... other semantic colors
      }
    }
  },
  safelist: [
    'bg-background',
    'bg-primary',
    // ... ensure semantic classes are generated
  ]
}
```

## 📝 Important Notes

### CSS Isolation
- Each site's CSS is completely isolated
- Never import CSS files directly with regular imports
- Always use the `?raw` import pattern in layouts
- CSS is injected inline to prevent cross-contamination

### Dynamic Imports
- Sites are loaded dynamically based on hostname
- Page components are imported at runtime
- This allows true multi-tenancy from a single deployment

### Semantic Classes
- Always use semantic class names (bg-primary, not bg-blue-500)
- This ensures themes work correctly across sites
- Add new semantic colors to ALL site configs when needed

### Safelist
- Always add semantic classes to Tailwind's safelist
- This ensures classes are generated even if not found during scanning
- Critical for dynamically generated content

## 🔍 Debugging

### CSS Not Loading
1. Check if CSS was generated: `ls src/sites/*/styles/main.css`
2. Regenerate CSS: `npm run generate-css`
3. Verify Tailwind config exists for the site
4. Check browser console for errors

### Wrong Colors Showing
1. Verify only ONE site's CSS is loaded (check browser DevTools)
2. Ensure layout uses `?raw` import pattern
3. Check for CSS file cross-contamination

### Site Not Loading
1. Verify site exists in `sites-config.json`
2. Check directory name matches configuration
3. Ensure layout.astro exists for the site
4. Check browser console for import errors

## 🚢 Deployment

### Building for Production

```bash
# Build all sites
npm run build

# Build specific site
SITE=yourdomain.com npm run build
```

### Environment Variables

- `SITE`: Specify which site to build/develop
- `SITES_CONFIG_PATH`: Path to sites-config.json (defaults to parent directory)

### Docker Support

The application includes Docker configuration for containerized deployment. Each site can be deployed as a separate container or as a single multi-tenant instance.

## 📚 Additional Resources

- [Adding a New Site](./ADD_A_SITE.md)
- [Astro Documentation](https://astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all sites still build: `npm run build`
4. Submit a pull request

## 📄 License

[Your License Here]