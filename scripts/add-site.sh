#!/bin/bash

# Add a new site to the platform
set -e

DOMAIN="${1}"
SITE_ID="${2}"

if [ -z "$DOMAIN" ] || [ -z "$SITE_ID" ]; then
    echo "Usage: ./add-site.sh <domain> <site-id>"
    echo "Example: ./add-site.sh example.com example"
    exit 1
fi

echo "➕ Adding new site: $DOMAIN"
echo "=========================="

# Create layout directory
echo "📁 Creating layout directory..."
mkdir -p astro-multi-tenant/src/layouts/$DOMAIN

# Create default layout
echo "🎨 Creating default layout..."
cat > astro-multi-tenant/src/layouts/$DOMAIN/Layout.astro << 'EOF'
---
export interface Props {
  title: string;
  tenant?: any;
}

const { title, tenant } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <nav>
      <div class="container">
        <a href="/">{tenant?.id || 'Home'}</a>
        <a href="/blog">Blog</a>
      </div>
    </nav>
    <slot />
  </body>
</html>
EOF

# Update sites-config.json
echo "📝 Updating sites-config.json..."
echo ""
echo "Add this to sites-config.json:"
echo ""
cat << EOF
  "$DOMAIN": {
    "id": "$SITE_ID",
    "directory": "$DOMAIN",
    "database": "${SITE_ID}_db",
    "theme": "default",
    "features": ["blog"],
    "adminUser": {
      "email": "admin@$DOMAIN",
      "password": "changeme123!",
      "name": "$SITE_ID Admin"
    }
  }
EOF

echo ""
echo "✅ Site structure created!"
echo "========================="
echo "Next steps:"
echo "1. Add the above config to sites-config.json"
echo "2. Customize the layout in astro-multi-tenant/src/layouts/$DOMAIN/"
echo "3. Restart the development server"