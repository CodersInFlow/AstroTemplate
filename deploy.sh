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
        
        # Step 3: Sync files to server (respecting .gitignore)
        echo -e "${YELLOW}📤 Syncing files to server...${NC}"
        
        # Use git ls-files to only sync tracked files (respects .gitignore)
        echo "  Creating file list from git (respecting .gitignore)..."
        
        # Get all tracked files that actually exist
        git ls-files | while read -r file; do
            [ -e "$file" ] && echo "$file"
        done > /tmp/deploy-files.txt
        
        # Add necessary untracked files that we need on server
        [ -f ".env" ] && echo ".env" >> /tmp/deploy-files.txt
        [ -f "docker-compose.prod.yml" ] && echo "docker-compose.prod.yml" >> /tmp/deploy-files.txt
        [ -f "server-update.sh" ] && echo "server-update.sh" >> /tmp/deploy-files.txt
        [ -d "generated-configs" ] && find generated-configs -type f 2>/dev/null >> /tmp/deploy-files.txt
        [ -d "dist" ] && echo "dist" >> /tmp/deploy-files.txt
        [ -f "backend/server" ] && echo "backend/server" >> /tmp/deploy-files.txt
        
        # Remove duplicates
        sort -u /tmp/deploy-files.txt -o /tmp/deploy-files.txt
        
        echo "  Syncing files (this may take a moment)..."
        rsync -rltzv --progress \
            --files-from=/tmp/deploy-files.txt \
            --exclude '.codersinflow' \
            --exclude '.claude' \
            --exclude '.vscode' \
            --exclude 'node_modules' \
            --exclude '.DS_Store' \
            -e "ssh -p ${SERVER_PORT}" \
            . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/ || {
            # rsync exit code 23 is "partial transfer" which often happens with changing files
            # We'll continue if it's just code 23, but fail for other errors
            RSYNC_EXIT=$?
            if [ $RSYNC_EXIT -eq 23 ]; then
                echo -e "${YELLOW}⚠️  Rsync reported partial transfer (some files may have changed during sync)${NC}"
                echo "  This is usually harmless, continuing..."
            elif [ $RSYNC_EXIT -ne 0 ]; then
                echo -e "${RED}❌ Rsync failed with exit code $RSYNC_EXIT${NC}"
                rm /tmp/deploy-files.txt
                exit 1
            fi
        }
        
        # Clean up
        rm /tmp/deploy-files.txt
        
        # Only sync .git/config files for proper remote URLs
        if [ -f ".git/config" ]; then
            echo "  Syncing main .git/config..."
            ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/.git"
            scp -P ${SERVER_PORT} .git/config ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/.git/
        fi
        
        # Sync submodule .git/config files
        for submodule_config in $(find . -path '*/.git/config' -not -path './.git/config' 2>/dev/null); do
            submodule_path=$(dirname $(dirname "$submodule_config"))
            echo "  Syncing $submodule_path/.git/config..."
            ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/$submodule_path/.git"
            scp -P ${SERVER_PORT} "$submodule_config" ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/$submodule_config
        done
        
        # Explicitly copy important files
        scp -P ${SERVER_PORT} .env docker-compose.prod.yml server-update.sh ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/ 2>/dev/null || true
        
        # Step 4: Run update script on server (or just restart services)
        echo -e "${YELLOW}🔄 Restarting services on server...${NC}"
        
        # Read site name from config for service names
        SITE_NAME=$(jq -r '.site.name' site.config.json)
        
        # First try to run the full update script
        if ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "[ -f ${SERVER_PATH}/server-update.sh ]"; then
            echo "  Running server-update.sh..."
            ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
                cd ${SERVER_PATH}
                chmod +x server-update.sh
                bash ./server-update.sh
            " || {
                echo -e "${YELLOW}⚠️  Update script failed, trying direct service restart...${NC}"
                # Fallback: just restart the services directly
                ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
                    sudo systemctl restart ${SITE_NAME}-backend || true
                    sudo systemctl restart ${SITE_NAME}-frontend || true
                    echo '✅ Services restarted'
                "
            }
        else
            echo -e "${YELLOW}⚠️  No update script found, restarting services directly...${NC}"
            # Just restart the services
            ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "
                sudo systemctl restart ${SITE_NAME}-backend || true
                sudo systemctl restart ${SITE_NAME}-frontend || true
                echo '✅ Services restarted'
            "
        fi
        
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