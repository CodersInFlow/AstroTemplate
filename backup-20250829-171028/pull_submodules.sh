#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Pulling latest changes from main repository...${NC}"
git pull

echo -e "${GREEN}Initializing and updating submodules...${NC}"
git submodule update --init --recursive

echo -e "${GREEN}Fetching latest changes from submodules...${NC}"
git submodule update --remote --merge

# Show status of all repositories
echo -e "${YELLOW}Repository status:${NC}"
echo -e "${YELLOW}Main repository:${NC}"
git status -s

echo -e "${YELLOW}src/components:${NC}"
cd src/components && git status -s && cd ../..

echo -e "${YELLOW}src/pages/blog:${NC}"
cd src/pages/blog && git status -s && cd ../../..

echo -e "${GREEN}All repositories updated!${NC}"