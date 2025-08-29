#!/bin/bash

# Cleanup script for old/unused files in multi-tenant setup

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}   Cleanup Old Files for Multi-Tenant Setup${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Files and directories to potentially remove
OLD_SCRIPTS=(
    "fix-astro-server.sh"       # Old fix script
    "fix-auth-redirects.sh"     # Old fix script
    "pull_submodules.sh"        # Not using submodules
    "quick-upload.sh"           # Old deployment method
    "server-rebuild.sh"         # Old server script
    "server-update.sh"          # Old server script
    "deploy-initial.sh"         # Old deployment
)

OLD_DIRS=(
    "test-dist"                 # Old test build
    "claude-code"               # If exists
    ".astro"                    # Build cache (will be in frontends/*/
)

DOCS_TO_KEEP=(
    "MULTI_TENANT_README.md"
    "DOCKER_MULTI_SITE_INTEGRATION.md"
    "MODULAR_COMPONENT_SYSTEM.md"
    "SITE_ACCESS_CONTROL.md"
    "MODULAR_MULTI_TENANT_ARCHITECTURE.md"
    "SINGLE_CONTAINER_MULTI_SITE.md"
    "COMPONENT_MIGRATION_PLAN.md"
    "COMPONENT_USAGE_EXAMPLES.md"
)

# Check mode (dry-run by default)
MODE=${1:-check}

if [ "$MODE" == "check" ]; then
    echo -e "${YELLOW}🔍 Checking for old/unused files (dry run)...${NC}"
    echo ""
    
    echo -e "${CYAN}Old Scripts to Remove:${NC}"
    for script in "${OLD_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            echo -e "  ${RED}✗${NC} $script"
        fi
    done
    
    echo ""
    echo -e "${CYAN}Old Directories to Remove:${NC}"
    for dir in "${OLD_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            size=$(du -sh "$dir" 2>/dev/null | cut -f1)
            echo -e "  ${RED}✗${NC} $dir (${size})"
        fi
    done
    
    echo ""
    echo -e "${CYAN}Root src/ and public/ (now in frontends/codersinflow.com/):${NC}"
    if [ -d "src" ] && [ -d "frontends/codersinflow.com/src" ]; then
        echo -e "  ${YELLOW}⚠${NC}  src/ exists in root (should be only in frontends/)"
        echo "      This is the original site source - keep for now as backup"
    fi
    if [ -d "public" ] && [ -d "frontends/codersinflow.com/public" ]; then
        echo -e "  ${YELLOW}⚠${NC}  public/ exists in root (should be only in frontends/)"
        echo "      This is the original site assets - keep for now as backup"
    fi
    
    echo ""
    echo -e "${CYAN}Documentation Files (keeping):${NC}"
    for doc in "${DOCS_TO_KEEP[@]}"; do
        if [ -f "$doc" ]; then
            echo -e "  ${GREEN}✓${NC} $doc"
        fi
    done
    
    echo ""
    echo -e "${GREEN}Scripts to Keep:${NC}"
    echo -e "  ✓ dev.sh                    - Original dev environment (still works)"
    echo -e "  ✓ dev-multi-tenant.sh       - Multi-tenant dev environment"
    echo -e "  ✓ build-docker.sh           - Original Docker build (still works)"
    echo -e "  ✓ build-docker-multi-tenant.sh - Multi-tenant Docker build"
    echo -e "  ✓ deploy.sh                 - Original deployment (still works)"
    echo -e "  ✓ deploy-docker.sh          - Docker deployment"
    
    echo ""
    echo -e "${YELLOW}To actually remove files, run:${NC}"
    echo -e "  ./cleanup-old-files.sh remove"
    echo ""
    echo -e "${YELLOW}To remove and backup files, run:${NC}"
    echo -e "  ./cleanup-old-files.sh backup"
    
elif [ "$MODE" == "backup" ]; then
    echo -e "${YELLOW}📦 Creating backup and removing old files...${NC}"
    
    # Create backup directory
    BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup old scripts
    for script in "${OLD_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            mv "$script" "$BACKUP_DIR/"
            echo -e "  ${GREEN}✓${NC} Backed up $script"
        fi
    done
    
    # Backup old directories
    for dir in "${OLD_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            mv "$dir" "$BACKUP_DIR/"
            echo -e "  ${GREEN}✓${NC} Backed up $dir"
        fi
    done
    
    echo -e "${GREEN}✅ Files backed up to: $BACKUP_DIR${NC}"
    
elif [ "$MODE" == "remove" ]; then
    echo -e "${RED}⚠️  This will permanently delete old files!${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove old scripts
        for script in "${OLD_SCRIPTS[@]}"; do
            if [ -f "$script" ]; then
                rm "$script"
                echo -e "  ${GREEN}✓${NC} Removed $script"
            fi
        done
        
        # Remove old directories
        for dir in "${OLD_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                rm -rf "$dir"
                echo -e "  ${GREEN}✓${NC} Removed $dir"
            fi
        done
        
        echo -e "${GREEN}✅ Old files removed${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
else
    echo "Usage: ./cleanup-old-files.sh [check|backup|remove]"
    echo ""
    echo "  check   - List files that would be removed (default)"
    echo "  backup  - Move old files to backup directory"
    echo "  remove  - Permanently delete old files"
fi