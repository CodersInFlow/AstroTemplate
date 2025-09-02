#!/bin/bash

# Add a new site to the multi-tenant platform
# This script creates a new site from template and updates configuration

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo "Usage: $0 <domain> [options]"
    echo ""
    echo "Required:"
    echo "  domain          The domain name (e.g., example.com)"
    echo ""
    echo "Options:"
    echo "  --name          Display name for the site (default: derived from domain)"
    echo "  --description   Site description (default: 'Welcome to [name]')"
    echo "  --theme         Theme color scheme: light, dark, dark-blue, dark-red (default: light)"
    echo "  --features      Comma-separated features: blog,docs,auth,payments (default: blog,docs)"
    echo ""
    echo "Examples:"
    echo "  $0 example.com"
    echo "  $0 mysite.com --name \"My Awesome Site\" --theme dark-blue --features blog,auth,payments"
    echo "  $0 techblog.com --description \"Tech articles and tutorials\" --theme dark"
}

# Parse arguments
DOMAIN=""
NAME=""
DESCRIPTION=""
THEME="light"
FEATURES="blog,docs"

while [[ $# -gt 0 ]]; do
    case $1 in
        --name)
            NAME="$2"
            shift 2
            ;;
        --description)
            DESCRIPTION="$2"
            shift 2
            ;;
        --theme)
            THEME="$2"
            shift 2
            ;;
        --features)
            FEATURES="$2"
            shift 2
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
        *)
            if [ -z "$DOMAIN" ]; then
                DOMAIN="$1"
            fi
            shift
            ;;
    esac
done

# Validate domain
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Domain is required${NC}"
    show_usage
    exit 1
fi

# Validate domain format - must be like example.com, not subdomain or path
if ! echo "$DOMAIN" | grep -qE '^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$'; then
    echo -e "${RED}Error: Invalid domain format${NC}"
    echo "Domain must be in the format: example.com, mysite.org, etc."
    echo "Do not include:"
    echo "  • Subdomains (www.example.com, blog.example.com)"
    echo "  • Protocols (http://, https://)"
    echo "  • Paths (/blog, /page)"
    echo "  • Ports (:3000, :8080)"
    echo ""
    echo "Examples of valid domains:"
    echo "  ✅ example.com"
    echo "  ✅ mysite.org"
    echo "  ✅ tech-blog.net"
    echo ""
    echo "Examples of invalid input:"
    echo "  ❌ www.example.com"
    echo "  ❌ https://example.com"
    echo "  ❌ example.com/blog"
    echo "  ❌ subdomain.example.com"
    exit 1
fi

# Additional check - warn if it looks like they included www
if [[ "$DOMAIN" == www.* ]]; then
    echo -e "${RED}Error: Do not include 'www.' prefix${NC}"
    echo "Just use the base domain (e.g., example.com instead of www.example.com)"
    echo "The script will automatically configure both www and non-www versions."
    exit 1
fi

# Extract site ID from domain (remove .com, .org, etc.)
SITE_ID="${DOMAIN%%.*}"

# Generate display name if not provided
if [ -z "$NAME" ]; then
    # Convert domain to title case (example-site -> Example Site)
    NAME=$(echo "$SITE_ID" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
fi

# Generate description if not provided
if [ -z "$DESCRIPTION" ]; then
    DESCRIPTION="Welcome to $NAME"
fi

# Validate theme
case $THEME in
    light|dark|dark-blue|dark-red)
        ;;
    *)
        echo -e "${YELLOW}Warning: Unknown theme '$THEME', using 'light'${NC}"
        THEME="light"
        ;;
esac

echo -e "${BLUE}🚀 Adding new site: $DOMAIN${NC}"
echo "=================================="
echo "  ID: $SITE_ID"
echo "  Name: $NAME"
echo "  Description: $DESCRIPTION"
echo "  Theme: $THEME"
echo "  Features: $FEATURES"
echo ""

# Check if site already exists
SITES_CONFIG="sites-config.json"
if [ -f "$SITES_CONFIG" ]; then
    if grep -q "\"$DOMAIN\"" "$SITES_CONFIG"; then
        echo -e "${RED}Error: Site $DOMAIN already exists in configuration${NC}"
        exit 1
    fi
fi

# Create site directory from template
TEMPLATE_DIR="astro-multi-tenant/src/sites/.template"
SITE_DIR="astro-multi-tenant/src/sites/$DOMAIN"

if [ ! -d "$TEMPLATE_DIR" ]; then
    echo -e "${RED}Error: Template directory not found at $TEMPLATE_DIR${NC}"
    echo "Please ensure the template directory exists."
    exit 1
fi

if [ -d "$SITE_DIR" ]; then
    echo -e "${YELLOW}Warning: Site directory already exists at $SITE_DIR${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
    rm -rf "$SITE_DIR"
fi

echo -e "${GREEN}📁 Creating site directory...${NC}"
cp -r "$TEMPLATE_DIR" "$SITE_DIR"

# Replace placeholders in the copied files
echo -e "${GREEN}🔧 Configuring site files...${NC}"

# Escape special characters for sed
escape_for_sed() {
    echo "$1" | sed 's/[[\.*^$()+?{|]/\\&/g' | sed "s/'/\\\\'/g"
}

# Prepare escaped values
DOMAIN_ESCAPED=$(escape_for_sed "$DOMAIN")
NAME_ESCAPED=$(escape_for_sed "$NAME")
DESCRIPTION_ESCAPED=$(escape_for_sed "$DESCRIPTION")
SITE_ID_ESCAPED=$(escape_for_sed "$SITE_ID")

# Update all files with placeholders
find "$SITE_DIR" -type f \( -name "*.astro" -o -name "*.tsx" -o -name "*.ts" -o -name "*.cjs" -o -name "*.js" -o -name "*.json" \) | while read file; do
    # Use different sed syntax for macOS vs Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/DOMAIN_PLACEHOLDER/$DOMAIN_ESCAPED/g" "$file"
        sed -i '' "s/SITE_NAME_PLACEHOLDER/$NAME_ESCAPED/g" "$file"
        sed -i '' "s/SITE_DESCRIPTION_PLACEHOLDER/$DESCRIPTION_ESCAPED/g" "$file"
        sed -i '' "s/SITE_ID_PLACEHOLDER/$SITE_ID_ESCAPED/g" "$file"
    else
        sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN_ESCAPED/g" "$file"
        sed -i "s/SITE_NAME_PLACEHOLDER/$NAME_ESCAPED/g" "$file"
        sed -i "s/SITE_DESCRIPTION_PLACEHOLDER/$DESCRIPTION_ESCAPED/g" "$file"
        sed -i "s/SITE_ID_PLACEHOLDER/$SITE_ID_ESCAPED/g" "$file"
    fi
done

# Create/update sites-config.json
echo -e "${GREEN}📝 Updating sites configuration...${NC}"

# Escape for JSON
escape_for_json() {
    echo "$1" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed "s/'/\\'/g" | sed ':a;N;$!ba;s/\n/\\n/g' | sed 's/\t/\\t/g' | sed 's/\r/\\r/g'
}

# Prepare JSON-escaped values
NAME_JSON=$(escape_for_json "$NAME")
DESCRIPTION_JSON=$(escape_for_json "$DESCRIPTION")

# Convert comma-separated features to JSON array
FEATURES_JSON=$(echo "$FEATURES" | awk -F',' '{
    printf "["
    for(i=1; i<=NF; i++) {
        gsub(/^[ \t]+|[ \t]+$/, "", $i)
        gsub(/"/, "\\\"", $i)
        printf "\"%s\"", $i
        if(i<NF) printf ", "
    }
    printf "]"
}')

# Create the site config JSON with localhost version for development
SITE_CONFIG=$(cat <<EOF
{
  "$DOMAIN": {
    "id": "$SITE_ID",
    "name": "$NAME_JSON",
    "description": "$DESCRIPTION_JSON",
    "directory": "$DOMAIN",
    "database": "${SITE_ID}_db",
    "theme": "$THEME",
    "features": $FEATURES_JSON
  },
  "www.$DOMAIN": {
    "id": "$SITE_ID",
    "name": "$NAME_JSON",
    "description": "$DESCRIPTION_JSON",
    "directory": "$DOMAIN",
    "database": "${SITE_ID}_db",
    "theme": "$THEME",
    "features": $FEATURES_JSON
  },
  "${SITE_ID}.localhost": {
    "id": "$SITE_ID",
    "name": "$NAME_JSON",
    "description": "$DESCRIPTION_JSON",
    "directory": "$DOMAIN",
    "database": "${SITE_ID}_db",
    "theme": "$THEME",
    "features": $FEATURES_JSON
  }
}
EOF
)

# Update or create sites-config.json
if [ -f "$SITES_CONFIG" ]; then
    # Backup existing config
    cp "$SITES_CONFIG" "${SITES_CONFIG}.backup"
    
    # Use Node.js to merge JSON properly
    node -e "
        const fs = require('fs');
        const existing = JSON.parse(fs.readFileSync('$SITES_CONFIG', 'utf8'));
        const newSite = $SITE_CONFIG;
        const merged = { ...existing, ...newSite };
        fs.writeFileSync('$SITES_CONFIG', JSON.stringify(merged, null, 2));
    "
    
    echo -e "${GREEN}✅ Updated sites-config.json${NC}"
else
    # Create new config file
    echo "$SITE_CONFIG" | node -e "
        const fs = require('fs');
        let input = '';
        process.stdin.on('data', chunk => input += chunk);
        process.stdin.on('end', () => {
            const config = JSON.parse(input);
            fs.writeFileSync('$SITES_CONFIG', JSON.stringify(config, null, 2));
        });
    "
    echo -e "${GREEN}✅ Created sites-config.json${NC}"
fi

# Create directories for pages if they don't exist
mkdir -p "$SITE_DIR/pages/blog"
mkdir -p "$SITE_DIR/pages/docs"
mkdir -p "$SITE_DIR/components"
mkdir -p "$SITE_DIR/styles"

echo ""
echo -e "${GREEN}🎉 Site created successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the dev server: npm run dev"
echo "  2. Access your site:"
echo "     • Development: http://${SITE_ID}.localhost:4321"
echo "     • Production: https://$DOMAIN"
echo ""
echo "Customize your site:"
echo "  • Layout: $SITE_DIR/layout.astro"
echo "  • Homepage: $SITE_DIR/pages/index.astro"
echo "  • Tailwind config: $SITE_DIR/tailwind.config.cjs"
echo "  • Components: $SITE_DIR/components/"
echo ""
echo "To remove this site later, run:"
echo "  ./scripts/remove-site.sh $DOMAIN"