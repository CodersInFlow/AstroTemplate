#!/bin/bash

# Exit on any error
set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Detect docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

echo -e "${YELLOW}🚀 Deploying codersinflow.com from Docker Hub${NC}"

# Check for environment file
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production not found!${NC}"
    echo "Please create .env.production with:"
    echo "  MONGO_PASSWORD=your_password"
    echo "  JWT_SECRET=your_secret"
    echo "  DOMAIN=codersinflow.com"
    exit 1
fi

# Load environment
source .env.production

# Verify required variables
required_vars=("MONGO_PASSWORD" "JWT_SECRET" "DOMAIN")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Error: $var is not set in .env.production${NC}"
        exit 1
    fi
done

# Create directories with proper permissions
echo -e "${YELLOW}📦 Setting up directories...${NC}"
sudo mkdir -p /var/www/codersinflow.com/data/db
sudo mkdir -p /var/www/codersinflow.com/uploads
sudo mkdir -p /var/www/codersinflow.com/logs

# Set MongoDB permissions (UID 999)
sudo chown -R 999:999 /var/www/codersinflow.com/data/db
sudo chmod -R 700 /var/www/codersinflow.com/data/db

# Set web permissions
sudo chown -R www-data:www-data /var/www/codersinflow.com/uploads
sudo chmod -R 775 /var/www/codersinflow.com/uploads

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
$DOCKER_COMPOSE -f docker-compose.production.yml down --remove-orphans

# Pull latest image
echo -e "${YELLOW}⬇️  Pulling latest image from Docker Hub...${NC}"
docker pull proggod/codersinflow:latest

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
$DOCKER_COMPOSE -f docker-compose.production.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check health
echo -e "${YELLOW}🔍 Checking container health...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}"

# Show logs
echo -e "${YELLOW}📝 Container logs:${NC}"
$DOCKER_COMPOSE -f docker-compose.production.yml logs --tail=50

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Site: https://${DOMAIN}${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:    $DOCKER_COMPOSE -f docker-compose.production.yml logs -f"
echo "  Restart:      $DOCKER_COMPOSE -f docker-compose.production.yml restart"
echo "  Stop:         $DOCKER_COMPOSE -f docker-compose.production.yml down"
echo "  Shell access: docker exec -it codersinflow bash"