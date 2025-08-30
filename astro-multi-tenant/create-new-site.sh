#!/bin/bash

# Create New Site Script for Multi-Tenant Astro Architecture
# This script creates a new site following the semantic color theming pattern

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if site name is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Please provide a site name${NC}"
    echo "Usage: ./create-new-site.sh <sitename.com>"
    exit 1
fi

SITE_NAME=$1
SITE_DIR="src/sites/$SITE_NAME"

# Check if site already exists
if [ -d "$SITE_DIR" ]; then
    echo -e "${RED}Error: Site $SITE_NAME already exists${NC}"
    exit 1
fi

echo -e "${GREEN}Creating new site: $SITE_NAME${NC}"

# Create site directory structure
echo "Creating directory structure..."
mkdir -p "$SITE_DIR"
mkdir -p "$SITE_DIR/pages"
mkdir -p "$SITE_DIR/pages/blog"
mkdir -p "$SITE_DIR/components"
mkdir -p "$SITE_DIR/styles"
mkdir -p "$SITE_DIR/data"

# Create tailwind.config.js with semantic colors
echo "Creating Tailwind configuration..."
cat > "$SITE_DIR/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/sites/SITE_NAME_PLACEHOLDER/**/*.{astro,tsx}',
    './src/modules/blog/**/*.{astro,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors - customize these for your site's theme
        'primary': '#3B82F6',         // blue-500 - main brand color
        'secondary': '#8B5CF6',       // purple-500
        'accent': '#10B981',          // green-500
        'background': '#FFFFFF',      // white - page background
        'surface': '#F9FAFB',         // gray-50 - card backgrounds
        'surface-hover': '#F3F4F6',   // gray-100 - hover state
        'border': '#E5E7EB',          // gray-200 - borders
        
        // Text colors
        'text-primary': '#111827',    // gray-900 - main text
        'text-secondary': '#4B5563',  // gray-600 - secondary text
        'text-muted': '#9CA3AF',      // gray-400 - muted text
        'text-inverse': '#FFFFFF',    // white - text on dark backgrounds
        
        // Interactive elements
        'link': '#2563EB',            // blue-600
        'link-hover': '#1D4ED8',      // blue-700
        
        // Status colors (keep consistent across all sites)
        'success': '#10B981',         // green-500
        'warning': '#F59E0B',         // yellow-500
        'error': '#EF4444',           // red-500
        'info': '#3B82F6',            // blue-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
EOF

# Replace placeholder with actual site name
sed -i '' "s/SITE_NAME_PLACEHOLDER/$SITE_NAME/g" "$SITE_DIR/tailwind.config.js"

# Create config.json
echo "Creating site configuration..."
cat > "$SITE_DIR/config.json" << EOF
{
  "site": "$SITE_NAME",
  "title": "Welcome to $SITE_NAME",
  "description": "A new multi-tenant site",
  "features": {
    "blog": true,
    "analytics": false
  }
}
EOF

# Create layout.astro
echo "Creating layout..."
cat > "$SITE_DIR/layout.astro" << 'EOF'
---
export interface Props {
  title: string;
}

const { title } = Astro.props;
import config from './config.json';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={config.description} />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title} - {config.title}</title>
  </head>
  <body class="bg-background text-text-primary min-h-screen">
    <nav class="bg-surface border-b border-border sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-primary">
              {config.title}
            </a>
            <div class="flex gap-6">
              <a href="/" class="text-text-secondary hover:text-link-hover transition">Home</a>
              <a href="/blog" class="text-text-secondary hover:text-link-hover transition">Blog</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <slot />
  </body>
</html>

<style is:global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
EOF

# Create index page
echo "Creating index page..."
cat > "$SITE_DIR/pages/index.astro" << 'EOF'
---
import Layout from '../layout.astro';
import config from '../config.json';
---

<Layout title="Home">
  <main class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-text-primary mb-6">
        {config.title}
      </h1>
      <p class="text-xl text-text-secondary mb-8">
        {config.description}
      </p>
      
      <div class="bg-surface rounded-lg p-8 border border-border">
        <h2 class="text-2xl font-semibold text-text-primary mb-4">
          Getting Started
        </h2>
        <p class="text-text-secondary mb-4">
          This is your new multi-tenant site. You can customize it by:
        </p>
        <ul class="list-disc list-inside space-y-2 text-text-secondary">
          <li>Editing the Tailwind configuration to change colors</li>
          <li>Updating the layout and navigation</li>
          <li>Adding new pages and components</li>
          <li>Configuring the blog module</li>
        </ul>
        
        <div class="mt-6">
          <a href="/blog" class="inline-block bg-primary text-text-inverse px-6 py-3 rounded-lg hover:bg-primary/90 transition">
            Visit Blog
          </a>
        </div>
      </div>
    </div>
  </main>
</Layout>
EOF

# Create blog [...slug].astro page
echo "Creating blog page..."
cat > "$SITE_DIR/pages/blog/[...slug].astro" << 'EOF'
---
// This page handles all blog routes and delegates to the BlogApp component
export const prerender = false;

import Layout from '../../layout.astro';
import BlogApp from '../../../../modules/blog/BlogApp.astro';
import config from '../../config.json';
---

<Layout title="Blog">
  <BlogApp config={config} />
</Layout>
EOF

# Update package.json scripts
echo -e "${YELLOW}Adding npm scripts...${NC}"
SITE_NAME_CLEAN=$(echo $SITE_NAME | sed 's/\./-/g')

# Check if scripts already exist
if grep -q "dev:$SITE_NAME_CLEAN" package.json; then
    echo "Scripts already exist for $SITE_NAME"
else
    # Add dev script
    npm pkg set "scripts.dev:$SITE_NAME_CLEAN"="SITE=$SITE_NAME astro dev"
    
    # Add build script
    npm pkg set "scripts.build:$SITE_NAME_CLEAN"="SITE=$SITE_NAME astro build"
    
    echo -e "${GREEN}Added npm scripts:${NC}"
    echo "  npm run dev:$SITE_NAME_CLEAN"
    echo "  npm run build:$SITE_NAME_CLEAN"
fi

# Update astro.config.mjs if needed
echo -e "${YELLOW}Note: You may need to update astro.config.mjs to add your site to the routing configuration${NC}"

echo -e "${GREEN}✅ Site created successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Customize the colors in $SITE_DIR/tailwind.config.js"
echo "2. Update the site configuration in $SITE_DIR/config.json"
echo "3. Run the development server: npm run dev:$SITE_NAME_CLEAN"
echo "4. Visit http://$SITE_NAME.localhost:4321"
echo ""
echo "Remember: The semantic color system allows you to maintain consistent theming."
echo "Update the Tailwind config to match your brand colors while keeping the semantic names."