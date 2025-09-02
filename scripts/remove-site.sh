#!/bin/bash

# Remove a site from the multi-tenant platform

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo "Usage: $0 <domain>"
    echo ""
    echo "Remove a site from the multi-tenant platform"
    echo ""
    echo "Example:"
    echo "  $0 example.com"
}

# Parse arguments
DOMAIN="$1"

if [ -z "$DOMAIN" ] || [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    show_usage
    exit 0
fi

echo -e "${YELLOW}⚠️  Removing site: $DOMAIN${NC}"
echo "=================================="
echo ""

# Confirm removal
read -p "Are you sure you want to remove this site? This cannot be undone. (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Remove site directory
SITE_DIR="astro-multi-tenant/src/sites/$DOMAIN"
if [ -d "$SITE_DIR" ]; then
    echo -e "${RED}🗑️  Removing site directory...${NC}"
    rm -rf "$SITE_DIR"
    echo -e "${GREEN}✅ Site directory removed${NC}"
else
    echo -e "${YELLOW}⚠️  Site directory not found: $SITE_DIR${NC}"
fi

# Remove from sites-config.json
SITES_CONFIG="sites-config.json"
if [ -f "$SITES_CONFIG" ]; then
    echo -e "${RED}📝 Removing from configuration...${NC}"
    
    # Backup existing config
    cp "$SITES_CONFIG" "${SITES_CONFIG}.backup"
    
    # Use Node.js to remove entries
    node -e "
        const fs = require('fs');
        const config = JSON.parse(fs.readFileSync('$SITES_CONFIG', 'utf8'));
        
        // Remove both domain and www.domain entries
        delete config['$DOMAIN'];
        delete config['www.$DOMAIN'];
        
        fs.writeFileSync('$SITES_CONFIG', JSON.stringify(config, null, 2));
        
        console.log('✅ Configuration updated');
    "
else
    echo -e "${YELLOW}⚠️  Configuration file not found${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Site removed successfully!${NC}"
echo ""
echo "The site has been removed from:"
echo "  • Site directory: $SITE_DIR"
echo "  • Configuration: $SITES_CONFIG"
echo ""
echo "Note: If you had any custom nginx configs or database data,"
echo "those may need to be cleaned up separately."