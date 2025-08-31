#!/bin/bash

# Add a new site to the multi-tenant platform with Tailwind theming
set -e

DOMAIN="${1}"

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./add-a-site.sh <domain>"
    echo "Example: ./add-a-site.sh example.com"
    exit 1
fi

# Extract site name from domain (remove .com, .org, etc.)
SITE_NAME="${DOMAIN%%.*}"
SITE_ID="${SITE_NAME}"
# Create a display name from the domain (capitalize words)
DISPLAY_NAME=$(echo "$SITE_NAME" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

echo "➕ Adding new site: $DOMAIN"
echo "   Site ID: $SITE_ID"
echo "=================================="

# Create site directory structure
echo "📁 Creating site directory structure..."
SITE_DIR="astro-multi-tenant/src/sites/$DOMAIN"
mkdir -p "$SITE_DIR"/{pages,components,styles}

# Create Tailwind configuration
echo "🎨 Creating Tailwind configuration..."
cat > "$SITE_DIR/tailwind.config.cjs" << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/sites/DOMAIN_PLACEHOLDER/**/*.{astro,tsx}',
    './src/modules/blog/**/*.{astro,tsx}',
    './src/shared/components/**/*.{astro,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors - customize these for your brand
        'primary': '#3B82F6',         // blue-500 - main brand color
        'secondary': '#8B5CF6',       // violet-500
        'accent': '#10B981',          // green-500
        
        // Background colors
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
        
        // Status colors (keep these consistent)
        'success': '#10B981',         // green-500
        'warning': '#F59E0B',         // yellow-500
        'error': '#EF4444',           // red-500
        'info': '#3B82F6',            // blue-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  safelist: [
    // Background colors
    'bg-background',
    'bg-surface',
    'bg-surface-hover',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    
    // Text colors
    'text-text-primary',
    'text-text-secondary',
    'text-text-muted',
    'text-text-inverse',
    'text-link',
    'text-link-hover',
    
    // Border colors
    'border-border',
    'border-primary',
    
    // Hover states
    'hover:bg-primary/90',
    'hover:bg-surface-hover',
    'hover:text-link-hover',
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
EOF

# Replace placeholder with actual domain
sed -i '' "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$SITE_DIR/tailwind.config.cjs"

# Create site configuration
echo "📝 Creating site configuration..."
cat > "$SITE_DIR/config.json" << EOF
{
  "name": "$SITE_NAME",
  "description": "Welcome to $SITE_NAME",
  "features": ["blog", "docs"],
  "logo": "/logo.svg",
  "favicon": "/favicon.ico",
  "social": {
    "twitter": "",
    "github": ""
  }
}
EOF

# Create layout file
echo "🎨 Creating layout file..."
cat > "$SITE_DIR/layout.astro" << 'EOF'
---
// CRITICAL: Import CSS as raw text to ensure isolation
import siteStyles from './styles/main.css?raw';

export interface Props {
  title?: string;
  description?: string;
}

const { 
  title = 'SITE_NAME_PLACEHOLDER', 
  description = 'Welcome to SITE_NAME_PLACEHOLDER' 
} = Astro.props;

import config from './config.json';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-background text-text-primary min-h-screen">
    <!-- CRITICAL: Inject CSS inline for isolation -->
    <style set:html={siteStyles}></style>
    
    <!-- Simple navigation -->
    <nav class="bg-surface border-b border-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <a href="/" class="text-xl font-semibold">{config.name}</a>
          <div class="flex gap-6">
            <a href="/" class="text-link hover:text-link-hover">Home</a>
            <a href="/blog" class="text-link hover:text-link-hover">Blog</a>
            <a href="/docs" class="text-link hover:text-link-hover">Docs</a>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Page content -->
    <slot />
    
    <!-- Simple footer -->
    <footer class="bg-surface border-t border-border mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-8 text-center text-text-secondary">
        <p>&copy; 2024 {config.name}. All rights reserved.</p>
      </div>
    </footer>
  </body>
</html>

<style is:global>
  /* Additional global styles for this site */
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
  }
</style>
EOF

# Replace placeholders
sed -i '' "s/SITE_NAME_PLACEHOLDER/$SITE_NAME/g" "$SITE_DIR/layout.astro"

# Create index page
echo "📄 Creating index page..."
cat > "$SITE_DIR/pages/index.astro" << EOF
---
import Layout from '../layout.astro';
---

<Layout title="Welcome to $SITE_NAME">
  <main class="flex-1">
    <div class="max-w-7xl mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold mb-6">
          Welcome to $SITE_NAME
        </h1>
        <p class="text-xl text-text-secondary max-w-2xl mx-auto">
          Your new site is ready! Customize this page and add your content.
        </p>
      </div>
      
      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div class="bg-surface p-6 rounded-lg border border-border">
          <h2 class="text-2xl font-semibold mb-3">Blog Module</h2>
          <p class="text-text-secondary mb-4">
            Full-featured blog with editor, categories, and markdown support.
          </p>
          <a href="/blog" class="text-link hover:text-link-hover">
            Visit Blog →
          </a>
        </div>
        
        <div class="bg-surface p-6 rounded-lg border border-border">
          <h2 class="text-2xl font-semibold mb-3">Documentation</h2>
          <p class="text-text-secondary mb-4">
            Create and organize documentation with the built-in docs module.
          </p>
          <a href="/docs" class="text-link hover:text-link-hover">
            View Docs →
          </a>
        </div>
        
        <div class="bg-surface p-6 rounded-lg border border-border">
          <h2 class="text-2xl font-semibold mb-3">Customizable</h2>
          <p class="text-text-secondary mb-4">
            Fully customizable with Tailwind CSS and semantic theming.
          </p>
          <a href="/blog/editor" class="text-link hover:text-link-hover">
            Create Content →
          </a>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div class="text-center bg-surface rounded-lg p-12 border border-border">
        <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-text-secondary mb-8">
          Edit this page at <code class="bg-surface-hover px-2 py-1 rounded">src/sites/$DOMAIN/pages/index.astro</code>
        </p>
        <div class="flex gap-4 justify-center">
          <a href="/blog" class="bg-primary text-text-inverse px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Explore Blog
          </a>
          <a href="/docs" class="bg-surface-hover text-text-primary px-6 py-3 rounded-lg hover:bg-surface border border-border transition-colors">
            Read Documentation
          </a>
        </div>
      </div>
    </div>
  </main>
</Layout>
EOF

# Create a sample about page
echo "📄 Creating about page..."
cat > "$SITE_DIR/pages/about.astro" << EOF
---
import Layout from '../layout.astro';
---

<Layout title="About $SITE_NAME">
  <main class="flex-1">
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold mb-8">About $SITE_NAME</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="text-text-secondary">
          This is your about page. Edit it at <code>src/sites/$DOMAIN/pages/about.astro</code>
        </p>
        
        <h2 class="text-2xl font-semibold mt-8 mb-4">Features</h2>
        <ul class="space-y-2 text-text-secondary">
          <li>✓ Multi-tenant architecture</li>
          <li>✓ Semantic theming with Tailwind CSS</li>
          <li>✓ Built-in blog module</li>
          <li>✓ Documentation system</li>
          <li>✓ Server-side rendering with Astro</li>
        </ul>
        
        <h2 class="text-2xl font-semibold mt-8 mb-4">Customization</h2>
        <p class="text-text-secondary">
          Customize your site's colors by editing the Tailwind configuration at:
          <code>src/sites/$DOMAIN/tailwind.config.cjs</code>
        </p>
      </div>
    </div>
  </main>
</Layout>
EOF

# Update sites-config.json
echo ""
echo "📝 Add this to sites-config.json (in the repository root):"
echo "=================================="
cat << EOF

  "$DOMAIN": {
    "id": "$SITE_ID",
    "name": "$DISPLAY_NAME",
    "description": "Welcome to $DISPLAY_NAME",
    "directory": "$DOMAIN",
    "database": "${SITE_ID}_db",
    "theme": "light",
    "features": ["blog", "docs"],
    "adminUser": {
      "email": "admin@$DOMAIN",
      "password": "changeme123!",
      "name": "$SITE_NAME Admin"
    }
  },
  "www.$DOMAIN": {
    "id": "$SITE_ID",
    "name": "$DISPLAY_NAME",
    "description": "Welcome to $DISPLAY_NAME",
    "directory": "$DOMAIN",
    "database": "${SITE_ID}_db",
    "theme": "light",
    "features": ["blog", "docs"]
  }

EOF

# Generate CSS
echo ""
echo "🎨 Generating CSS for the new site..."
cd astro-multi-tenant
if [ -f "../scripts/generate-all-css.sh" ]; then
    ../scripts/generate-all-css.sh
elif [ -f "scripts/generate-all-css.sh" ]; then
    ./scripts/generate-all-css.sh
else
    echo "⚠️  CSS generation script not found. Run 'npm run generate-css' manually."
fi
cd ..

echo ""
echo "✅ Site created successfully!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Add the configuration above to sites-config.json"
echo "2. Restart the development server: npm run dev"
echo "3. Access your site at: http://${DOMAIN%.com}.localhost:4321"
echo ""
echo "Customization:"
echo "- Colors: Edit $SITE_DIR/tailwind.config.cjs"
echo "- Layout: Edit $SITE_DIR/layout.astro"
echo "- Homepage: Edit $SITE_DIR/pages/index.astro"
echo "- Add pages: Create new .astro files in $SITE_DIR/pages/"
echo ""
echo "📚 See ADD_A_SITE.md for detailed documentation"