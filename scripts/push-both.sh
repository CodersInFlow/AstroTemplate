#!/bin/bash

# Simple push script that pushes to both remotes without branch switching
# This avoids the issues with the smart-push.sh script losing changes

set -e

echo "🚀 Push to Both Remotes"
echo "======================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get current branch
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes. Please commit them first.${NC}"
    exit 1
fi

# Push to GitLab (with all files)
echo -e "${GREEN}📤 Pushing to GitLab (full repository)...${NC}"
if git remote | grep -q "^gitlab$"; then
    git push gitlab $BRANCH $@
    echo -e "${GREEN}✅ GitLab push complete${NC}"
else
    echo -e "${YELLOW}⚠️  GitLab remote not found${NC}"
fi

echo ""

# Push to GitHub 
echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
echo -e "${YELLOW}Note: GitHub has a 100MB file size limit.${NC}"
echo -e "${YELLOW}Large files (videos, binaries) will be rejected by GitHub.${NC}"
echo ""

if git remote | grep -q "^github$"; then
    # Try to push to GitHub
    # If it fails due to large files, GitHub will reject it but GitLab will still have everything
    if git push github $BRANCH $@ 2>&1 | tee /tmp/github-push.log; then
        echo -e "${GREEN}✅ GitHub push complete${NC}"
    else
        if grep -q "large files" /tmp/github-push.log || grep -q "exceeds GitHub's file size limit" /tmp/github-push.log; then
            echo -e "${YELLOW}⚠️  GitHub rejected push due to large files${NC}"
            echo -e "${YELLOW}   GitLab has the full repository with all files${NC}"
            echo -e "${YELLOW}   Consider using git-lfs or removing large files for GitHub${NC}"
        else
            echo -e "${RED}❌ GitHub push failed for another reason. Check the error above.${NC}"
        fi
    fi
elif git remote | grep -q "^origin$"; then
    if [[ "$(git remote get-url origin)" == *"github.com"* ]]; then
        if git push origin $BRANCH $@ 2>&1 | tee /tmp/github-push.log; then
            echo -e "${GREEN}✅ GitHub (origin) push complete${NC}"
        else
            if grep -q "large files" /tmp/github-push.log || grep -q "exceeds GitHub's file size limit" /tmp/github-push.log; then
                echo -e "${YELLOW}⚠️  GitHub rejected push due to large files${NC}"
                echo -e "${YELLOW}   GitLab has the full repository with all files${NC}"
            else
                echo -e "${RED}❌ Push failed. Check the error above.${NC}"
            fi
        fi
    else
        git push origin $BRANCH $@
        echo -e "${GREEN}✅ Origin push complete${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  GitHub remote not found${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Push operations complete!${NC}"
echo ""
echo "Summary:"
echo "  • GitLab: Full repository with all files"
echo "  • GitHub: Repository (large files may be rejected)"
echo ""
echo "If you need to push large files to GitHub, consider:"
echo "  1. Using Git LFS (Large File Storage)"
echo "  2. Hosting large files elsewhere (CDN, S3, etc.)"
echo "  3. Using the 'scripts/smart-push.sh' script (warning: may lose uncommitted changes)"