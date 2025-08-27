#!/bin/bash
# Main deployment script - wrapper for initial setup and updates

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for site.config.json
if [ ! -f "site.config.json" ]; then
    echo -e "${RED}❌ site.config.json not found!${NC}"
    exit 1
fi

# Parse deployment mode from arguments
MODE=${1:-update}  # Default to update mode

# Read server details from config
SERVER_USER=$(jq -r '.deployment.server.user // "root"' site.config.json)
SERVER_HOST=$(jq -r '.deployment.server.host' site.config.json)
SERVER_PORT=$(jq -r '.deployment.server.port // 22' site.config.json)
SERVER_PATH=$(jq -r '.deployment.server.path' site.config.json)
DOMAIN=$(jq -r '.site.domain' site.config.json)

# Display header
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Deployment Script for ${DOMAIN}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

case "$MODE" in
    initial|init|setup)
        echo -e "${YELLOW}🚀 Running INITIAL DEPLOYMENT...${NC}"
        echo ""
        echo "This will:"
        echo "  • Set up MongoDB with secure passwords"
        echo "  • Configure nginx"
        echo "  • Create systemd services"
        echo "  • Set up admin user"
        echo "  • Initialize git repository on server"
        echo ""
        read -p "Continue with initial setup? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborted."
            exit 1
        fi
        
        # Run the initial deployment script
        bash deploy-initial.sh
        
        # After initial deployment, also sync the git directory and update script
        echo -e "${YELLOW}📂 Setting up git repository and update script on server...${NC}"
        
        # Initialize git repo on server if not exists
        ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
            cd ${SERVER_PATH}
            if [ ! -d .git ]; then
                git init
                git remote add origin https://github.com/yourusername/yourrepo.git
                echo '✅ Git repository initialized'
            fi
            
            # Make update script executable
            if [ -f server-update.sh ]; then
                chmod +x server-update.sh
                echo '✅ Update script is ready to use'
            fi
        "
        
        echo ""
        echo -e "${GREEN}✅ Initial deployment complete!${NC}"
        echo ""
        echo -e "${YELLOW}📝 For future updates, you can:${NC}"
        echo "  1. From local: ./deploy.sh update"
        echo "  2. From server: cd ${SERVER_PATH} && ./server-update.sh"
        ;;
        
    update|sync)
        echo -e "${YELLOW}🔄 Running UPDATE deployment...${NC}"
        echo ""
        echo "This will:"
        echo "  • Build locally"
        echo "  • Sync files to server" 
        echo "  • Run update script on server"
        echo ""
        
        # Step 1: Build locally
        echo -e "${YELLOW}📦 Building locally...${NC}"
        export PUBLIC_API_URL="https://${DOMAIN}"
        npm run build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Local build failed!${NC}"
            exit 1
        fi
        
        # Build backend for Linux
        echo -e "${YELLOW}🔧 Building backend for Linux...${NC}"
        cd backend
        GOOS=linux GOARCH=amd64 go build -o server cmd/server/main.go
        cd ..
        
        # Step 2: Process templates
        if [ -f "scripts/process-templates.sh" ]; then
            echo -e "${YELLOW}🔧 Processing templates...${NC}"
            
            # Get existing passwords from server if available
            EXISTING_ENV=$(ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "[ -f ${SERVER_PATH}/.env ] && cat ${SERVER_PATH}/.env" 2>/dev/null || echo "")
            if [ -n "${EXISTING_ENV}" ]; then
                export MONGO_PASSWORD=$(echo "${EXISTING_ENV}" | grep '^MONGO_PASSWORD=' | cut -d'=' -f2)
                export JWT_SECRET=$(echo "${EXISTING_ENV}" | grep '^JWT_SECRET=' | cut -d'=' -f2)
            fi
            
            bash scripts/process-templates.sh
        fi
        
        # Step 3: Sync files to server (including .git if it exists locally)
        echo -e "${YELLOW}📤 Syncing files to server...${NC}"
        
        # Create a file list of what to sync
        SYNC_EXCLUDES="
            --exclude 'node_modules'
            --exclude 'runtime/mongodb'
            --exclude 'runtime/uploads'
            --exclude '.DS_Store'
            --exclude '*.log'
            --exclude 'test-*'
            --exclude 'playwright*'
            --exclude '.env.local'
            --exclude '.env.development'
        "
        
        # If we have a local git repo, sync it
        if [ -d ".git" ]; then
            echo "  Including git repository..."
            rsync -rltz \
                ${SYNC_EXCLUDES} \
                -e "ssh -p ${SERVER_PORT}" \
                . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
        else
            # Exclude .git if we don't have it locally
            rsync -rltz \
                ${SYNC_EXCLUDES} \
                --exclude '.git' \
                -e "ssh -p ${SERVER_PORT}" \
                . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
        fi
        
        # Explicitly copy important files
        scp -P ${SERVER_PORT} .env docker-compose.prod.yml server-update.sh ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/ 2>/dev/null || true
        
        # Step 4: Run update script on server
        echo -e "${YELLOW}🔄 Running update script on server...${NC}"
        ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
            cd ${SERVER_PATH}
            
            # Make sure update script is executable
            chmod +x server-update.sh
            
            # Run the update
            ./server-update.sh
        "
        
        echo -e "${GREEN}✅ Update deployment complete!${NC}"
        ;;
        
    quick|fast)
        echo -e "${YELLOW}⚡ Running QUICK deployment (no local build)...${NC}"
        echo ""
        echo "This will:"
        echo "  • Sync current files to server"
        echo "  • Server will pull from git and rebuild"
        echo ""
        
        # Just sync the essential files and let server do the rest
        echo -e "${YELLOW}📤 Syncing essential files...${NC}"
        rsync -rltz \
            --include 'server-update.sh' \
            --include 'site.config.json' \
            --include 'docker-compose.prod.yml' \
            --include '.env' \
            --exclude '*' \
            -e "ssh -p ${SERVER_PORT}" \
            . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
        
        # Run update on server
        echo -e "${YELLOW}🔄 Server will now pull and rebuild...${NC}"
        ssh -t -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
            cd ${SERVER_PATH}
            chmod +x server-update.sh
            ./server-update.sh
        "
        
        echo -e "${GREEN}✅ Quick deployment complete!${NC}"
        ;;
        
    help|--help|-h)
        echo "Usage: ./deploy.sh [mode]"
        echo ""
        echo "Modes:"
        echo "  initial  - First-time setup (MongoDB, nginx, systemd, etc.)"
        echo "  update   - Build locally and sync to server (default)"
        echo "  quick    - Just trigger git pull & rebuild on server"
        echo "  help     - Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh initial    # First deployment to new server"
        echo "  ./deploy.sh update     # Regular deployment with local build"
        echo "  ./deploy.sh quick      # Let server pull from git and build"
        echo "  ./deploy.sh           # Same as 'update'"
        ;;
        
    *)
        echo -e "${RED}❌ Unknown mode: $MODE${NC}"
        echo "Use './deploy.sh help' for usage information"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}🌐 Site: https://${DOMAIN}${NC}"
echo -e "${YELLOW}📍 Server: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}${NC}"