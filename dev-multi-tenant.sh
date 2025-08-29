#!/bin/bash

# Multi-Tenant Development Script

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Detect docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Multi-Tenant Development Environment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to check if site exists
check_site() {
    local site=$1
    if [ ! -d "frontends/$site" ]; then
        echo -e "${RED}❌ Site not found: frontends/$site${NC}"
        echo -e "${YELLOW}Available sites:${NC}"
        ls -d frontends/*/ 2>/dev/null | xargs -n 1 basename || echo "No sites found"
        return 1
    fi
    return 0
}

# Function to build a site
build_site() {
    local site=$1
    echo -e "${YELLOW}🔨 Building $site...${NC}"
    
    if ! check_site "$site"; then
        return 1
    fi
    
    cd "frontends/$site"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies for $site...${NC}"
        npm install
    fi
    
    npm run build
    cd ../..
    
    echo -e "${GREEN}✅ Built $site${NC}"
}

# Parse command
case "${1:-help}" in
    up|start)
        SITE=${2:-codersinflow.com}
        echo -e "${YELLOW}🚀 Starting multi-tenant environment...${NC}"
        
        # Check if using docker or local
        if [ "${3}" == "--docker" ]; then
            $DOCKER_COMPOSE -f docker-compose.multi-tenant.yml up --build
        else
            # Local development with specific site
            echo -e "${CYAN}Starting local dev server for: $SITE${NC}"
            
            if ! check_site "$SITE"; then
                exit 1
            fi
            
            # Start backend in background
            echo -e "${YELLOW}Starting backend...${NC}"
            cd backend && go run cmd/server/main.go &
            BACKEND_PID=$!
            cd ..
            
            # Start frontend dev server
            echo -e "${YELLOW}Starting frontend for $SITE...${NC}"
            cd "frontends/$SITE"
            npm run dev
            
            # Cleanup on exit
            trap "kill $BACKEND_PID 2>/dev/null" EXIT
        fi
        ;;
    
    build)
        if [ -z "$2" ]; then
            # Build all sites
            echo -e "${YELLOW}Building all sites...${NC}"
            for dir in frontends/*/; do
                site=$(basename "$dir")
                if [ "$site" != "default" ]; then
                    build_site "$site"
                fi
            done
        else
            # Build specific site
            build_site "$2"
        fi
        ;;
    
    docker-build)
        echo -e "${YELLOW}🐳 Building Docker container...${NC}"
        docker build -f Dockerfile.multi-tenant -t multi-site-app:latest .
        echo -e "${GREEN}✅ Docker container built${NC}"
        ;;
    
    docker-up)
        echo -e "${YELLOW}🐳 Starting Docker container...${NC}"
        $DOCKER_COMPOSE -f docker-compose.multi-tenant.yml up
        ;;
    
    test)
        echo -e "${YELLOW}🧪 Starting test server...${NC}"
        
        # Check if express is installed
        if [ ! -d "node_modules/express" ]; then
            echo -e "${YELLOW}Installing express...${NC}"
            npm install express http-proxy-middleware compression
        fi
        
        # Run the multi-tenant dev server
        node scripts/dev-multi-tenant.js
        ;;
    
    add-site)
        if [ -z "$2" ]; then
            echo -e "${RED}Please provide a site name${NC}"
            echo "Usage: ./dev-multi-tenant.sh add-site <sitename>"
            exit 1
        fi
        
        SITE_NAME=$2
        echo -e "${YELLOW}➕ Creating new site: $SITE_NAME${NC}"
        
        # Copy from codersinflow as template
        cp -r frontends/codersinflow.com "frontends/$SITE_NAME"
        
        echo -e "${GREEN}✅ Created frontends/$SITE_NAME${NC}"
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Update sites-config.json to add your site"
        echo "2. Customize frontends/$SITE_NAME/tailwind.config.js"
        echo "3. Update frontends/$SITE_NAME/src/styles/global.css"
        echo "4. Build: ./dev-multi-tenant.sh build $SITE_NAME"
        ;;
    
    list)
        echo -e "${CYAN}📋 Available sites:${NC}"
        echo ""
        for dir in frontends/*/; do
            site=$(basename "$dir")
            if [ -f "$dir/package.json" ]; then
                echo -e "  ${GREEN}✓${NC} $site"
                if [ -d "$dir/dist" ]; then
                    echo -e "    ${CYAN}Built:${NC} Yes"
                else
                    echo -e "    ${YELLOW}Built:${NC} No (run: ./dev-multi-tenant.sh build $site)"
                fi
            fi
        done
        ;;
    
    clean)
        echo -e "${RED}⚠️  This will delete all built files and Docker volumes!${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Clean built files
            for dir in frontends/*/dist; do
                if [ -d "$dir" ]; then
                    rm -rf "$dir"
                    echo -e "${GREEN}✅ Cleaned $(dirname $dir)${NC}"
                fi
            done
            
            # Clean Docker
            $DOCKER_COMPOSE -f docker-compose.multi-tenant.yml down -v
            echo -e "${GREEN}✅ Cleaned Docker environment${NC}"
        fi
        ;;
    
    help|--help|-h|"")
        echo "Usage: ./dev-multi-tenant.sh [command] [options]"
        echo ""
        echo "Commands:"
        echo "  ${CYAN}up [site]${NC}           Start dev environment for a site (default: codersinflow.com)"
        echo "  ${CYAN}up [site] --docker${NC}  Start with Docker container"
        echo "  ${CYAN}build [site]${NC}        Build a specific site (or all if no site specified)"
        echo "  ${CYAN}docker-build${NC}        Build the Docker container"
        echo "  ${CYAN}docker-up${NC}           Start the Docker container"
        echo "  ${CYAN}test${NC}                Start test server with domain simulation"
        echo "  ${CYAN}add-site <name>${NC}     Create a new site from template"
        echo "  ${CYAN}list${NC}                List all available sites"
        echo "  ${CYAN}clean${NC}               Remove all built files and volumes"
        echo "  ${CYAN}help${NC}                Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./dev-multi-tenant.sh up codersinflow.com"
        echo "  ./dev-multi-tenant.sh build darkflows.com"
        echo "  ./dev-multi-tenant.sh test"
        echo "  ./dev-multi-tenant.sh add-site clientabc.com"
        echo ""
        echo "Test URLs (when using 'test' command):"
        echo "  http://localhost:3000/?site=codersinflow"
        echo "  http://localhost:3000/?site=darkflows"
        ;;
    
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Use './dev-multi-tenant.sh help' for usage information"
        exit 1
        ;;
esac