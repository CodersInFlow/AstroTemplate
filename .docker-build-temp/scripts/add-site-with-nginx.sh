#!/bin/bash

# Add a new site to the multi-tenant platform with nginx config
set -e

DOMAIN="${1}"

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./add-site-with-nginx.sh <domain>"
    echo "Example: ./add-site-with-nginx.sh example.com"
    exit 1
fi

# Extract site name from domain (remove .com, .org, etc.)
SITE_NAME="${DOMAIN%%.*}"
SITE_ID="${SITE_NAME}"

echo "➕ Adding new site: $DOMAIN"
echo "   Site ID: $SITE_ID"
echo "=================================="

# First, run the original add-site script
echo "📁 Setting up Astro site structure..."
./scripts/add-a-site.sh "$DOMAIN"

# Now regenerate all nginx configurations including the new site
echo ""
echo "🔧 Regenerating nginx configurations..."
./scripts/generate-nginx-configs.sh
echo ""

# Update sites-config.json reminder (from original script)
echo "📝 Don't forget to add this to sites-config.json:"
echo "=================================="
cat << EOF

  "${DOMAIN}": {
    "id": "${SITE_ID}",
    "directory": "${DOMAIN}",
    "database": "${SITE_ID}_db",
    "theme": "light",
    "features": ["blog", "docs"],
    "adminUser": {
      "email": "admin@${DOMAIN}",
      "password": "changeme123!",
      "name": "${SITE_NAME} Admin"
    }
  },
  "www.${DOMAIN}": {
    "id": "${SITE_ID}",
    "directory": "${DOMAIN}",
    "database": "${SITE_ID}_db",
    "theme": "light",
    "features": ["blog", "docs"]
  }

EOF

echo ""
echo "✅ Site created successfully!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Add the configuration above to sites-config.json"
echo "2. Rebuild Docker image: ./scripts/build.sh"
echo "3. Deploy to server: ./scripts/deploy-full.sh"
echo ""
echo "The deployment script will:"
echo "  - Upload nginx config to server"
echo "  - Setup SSL certificate"
echo "  - Restart services"
echo ""
echo "Files created:"
echo "  📁 astro-multi-tenant/src/sites/${DOMAIN}/"
echo "  📄 nginx/sites-enabled/*.conf (regenerated all configs)"