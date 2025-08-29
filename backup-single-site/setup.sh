#!/bin/bash

# Setup script for initial repository clone with submodules
# This script is for new machines/developers

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up codersinflow.com repository...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

echo -e "${GREEN}Initializing git submodules...${NC}"
git submodule update --init --recursive

echo -e "${GREEN}Installing npm dependencies for main project...${NC}"
npm install

# Install dependencies for submodules if they have package.json
if [ -f "src/components/package.json" ]; then
    echo -e "${GREEN}Installing npm dependencies for src/components...${NC}"
    cd src/components && npm install && cd ../..
fi

if [ -f "src/pages/blog/package.json" ]; then
    echo -e "${GREEN}Installing npm dependencies for src/pages/blog...${NC}"
    cd src/pages/blog && npm install && cd ../../..
fi

echo -e "${YELLOW}Setup complete!${NC}"
echo -e "${YELLOW}Use ./pull_submodules.sh to update all repositories in the future.${NC}"
echo -e "${YELLOW}Use ./deploy.sh to deploy changes.${NC}"