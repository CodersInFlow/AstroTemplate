#!/bin/bash

# Smart push script that filters large files for GitHub but keeps them for GitLab
set -e

echo "🚀 Smart Git Push Script"
echo "========================"

# Configuration
LARGE_FILE_SIZE="10M"  # Files larger than this will be filtered for GitHub
GITHUB_REMOTE="github"
GITLAB_REMOTE="gitlab"
ORIGIN_REMOTE="origin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
BRANCH="${1:-$(git branch --show-current)}"
FORCE_FLAG=""
if [[ "$2" == "--force" ]] || [[ "$1" == "--force" ]]; then
    FORCE_FLAG="--force"
    if [[ "$1" == "--force" ]]; then
        BRANCH="$(git branch --show-current)"
    fi
fi

echo "Branch: $BRANCH"
echo ""

# Function to push to GitLab (with all files)
push_to_gitlab() {
    echo -e "${GREEN}📤 Pushing to GitLab (with all files)...${NC}"
    git push $FORCE_FLAG $GITLAB_REMOTE $BRANCH
    echo -e "${GREEN}✅ GitLab push complete${NC}"
}

# Function to push to GitHub (without large files)
push_to_github() {
    echo -e "${YELLOW}📤 Preparing filtered push to GitHub...${NC}"
    
    # Create a temporary branch for GitHub
    TEMP_BRANCH="temp-github-push-$(date +%s)"
    echo "Creating temporary branch: $TEMP_BRANCH"
    
    # Save current branch state
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Create temp branch from current branch
    git checkout -b $TEMP_BRANCH
    
    # Find and remove large files from the index
    echo "Finding files larger than $LARGE_FILE_SIZE..."
    
    # Find large files
    LARGE_FILES=$(git ls-files | while read file; do
        if [ -f "$file" ]; then
            SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
            # 10MB in bytes
            if [ "$SIZE" -gt 10485760 ]; then
                echo "$file"
            fi
        fi
    done)
    
    if [ ! -z "$LARGE_FILES" ]; then
        echo -e "${YELLOW}Found large files to exclude:${NC}"
        echo "$LARGE_FILES" | while read file; do
            echo "  - $file ($(du -h "$file" | cut -f1))"
        done
        
        # Remove large files from this branch
        echo "$LARGE_FILES" | while read file; do
            git rm --cached "$file" 2>/dev/null || true
        done
        
        # Commit the removal
        git commit -m "Temporary: Remove large files for GitHub push" || true
    else
        echo "No large files found"
    fi
    
    # Push to GitHub
    echo -e "${YELLOW}Pushing to GitHub...${NC}"
    git push $FORCE_FLAG $GITHUB_REMOTE $TEMP_BRANCH:$BRANCH
    echo -e "${GREEN}✅ GitHub push complete (without large files)${NC}"
    
    # Clean up: return to original branch and delete temp branch
    # Force checkout to avoid issues with untracked files
    git checkout -f $CURRENT_BRANCH || {
        echo -e "${RED}❌ Failed to return to $CURRENT_BRANCH${NC}"
        echo -e "${YELLOW}You are still on $TEMP_BRANCH${NC}"
        echo -e "${YELLOW}To manually fix: git checkout -f $CURRENT_BRANCH${NC}"
        exit 1
    }
    git branch -D $TEMP_BRANCH
    
    # Restore any large files that were removed
    git checkout HEAD -- . 2>/dev/null || true
}

# Function to check if remote exists
check_remote() {
    git remote | grep -q "^$1$"
}

# Main execution
echo "🔍 Checking remotes..."

# Push to GitLab if it exists
if check_remote "$GITLAB_REMOTE"; then
    push_to_gitlab
else
    echo -e "${YELLOW}⚠️  GitLab remote not found${NC}"
fi

echo ""

# Push to GitHub if it exists
if check_remote "$GITHUB_REMOTE"; then
    push_to_github
elif check_remote "$ORIGIN_REMOTE"; then
    # Check if origin points to GitHub
    ORIGIN_URL=$(git remote get-url $ORIGIN_REMOTE)
    if [[ "$ORIGIN_URL" == *"github.com"* ]]; then
        GITHUB_REMOTE="$ORIGIN_REMOTE"
        push_to_github
    fi
else
    echo -e "${YELLOW}⚠️  GitHub remote not found${NC}"
fi

echo ""
echo -e "${GREEN}✅ All pushes complete!${NC}"
echo ""
echo "Note: Large files (>$LARGE_FILE_SIZE) were excluded from GitHub but included in GitLab"