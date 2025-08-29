#!/bin/bash

# Development startup script

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detect docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Starting Codersinflow Development Environment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check for .env.development
if [ ! -f ".env.development" ]; then
    echo -e "${YELLOW}Creating .env.development file...${NC}"
    cat > .env.development << 'EOF'
# Development Environment Variables

# MongoDB (using container's MongoDB)
MONGO_URI=mongodb://admin:devpassword@mongodb:27017/codersblog?authSource=admin
MONGO_PASSWORD=devpassword

# Application
JWT_SECRET=devsecret123456789
NODE_ENV=development
PUBLIC_API_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001

# Development settings
DEBUG=true
LOG_LEVEL=debug
EOF
    echo -e "${GREEN}✅ Created .env.development${NC}"
fi

# Check for docker-compose.dev.yml
if [ ! -f "docker-compose.dev.yml" ]; then
    echo -e "${YELLOW}Creating docker-compose.dev.yml...${NC}"
    cat > docker-compose.dev.yml << 'EOF'
version: '3.8'

services:
  # Frontend and Backend development container
  codersinflow-dev:
    container_name: codersinflow-dev
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"  # Frontend dev server
      - "3001:3001"  # Backend API
    env_file:
      - .env.development
    volumes:
      # Mount source code for hot reloading
      - .:/app
      - node_modules:/app/node_modules
      - go_modules:/root/go
      - ./uploads:/app/uploads
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://admin:devpassword@mongodb:27017/codersblog?authSource=admin
      - JWT_SECRET=${JWT_SECRET:-devsecret123}
      - PUBLIC_API_URL=http://localhost:3001
      - VITE_API_URL=http://localhost:3001
    depends_on:
      mongodb:
        condition: service_healthy
    stdin_open: true
    tty: true

  # MongoDB for development
  mongodb:
    image: mongo:7.0
    container_name: codersinflow-mongodb-dev
    ports:
      - "27017:27017"  # Expose MongoDB for external tools
    volumes:
      - mongodb_data_dev:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=devpassword
      - MONGO_INITDB_DATABASE=codersblog
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  mongodb_data_dev:
  node_modules:
  go_modules:
EOF
    echo -e "${GREEN}✅ Created docker-compose.dev.yml${NC}"
fi

# Parse command
case "${1:-up}" in
    up|start)
        echo -e "${YELLOW}🚀 Starting development environment...${NC}"
        $DOCKER_COMPOSE -f docker-compose.dev.yml up --build
        ;;
    
    down|stop)
        echo -e "${YELLOW}🛑 Stopping development environment...${NC}"
        $DOCKER_COMPOSE -f docker-compose.dev.yml down
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Restarting development environment...${NC}"
        $DOCKER_COMPOSE -f docker-compose.dev.yml restart
        ;;
    
    logs)
        $DOCKER_COMPOSE -f docker-compose.dev.yml logs -f ${2:-}
        ;;
    
    shell|bash)
        echo -e "${YELLOW}📦 Opening shell in development container...${NC}"
        docker exec -it codersinflow-dev sh
        ;;
    
    mongo|db)
        echo -e "${YELLOW}🗄️  Opening MongoDB shell...${NC}"
        docker exec -it codersinflow-mongodb-dev mongosh -u admin -p devpassword --authenticationDatabase admin
        ;;
    
    rebuild)
        echo -e "${YELLOW}🏗️  Rebuilding containers...${NC}"
        $DOCKER_COMPOSE -f docker-compose.dev.yml down
        $DOCKER_COMPOSE -f docker-compose.dev.yml build --no-cache
        $DOCKER_COMPOSE -f docker-compose.dev.yml up
        ;;
    
    clean)
        echo -e "${RED}⚠️  This will delete all development data!${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            $DOCKER_COMPOSE -f docker-compose.dev.yml down -v
            echo -e "${GREEN}✅ Cleaned development environment${NC}"
        fi
        ;;
    
    help|--help|-h)
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  up, start     Start development environment (default)"
        echo "  down, stop    Stop development environment"
        echo "  restart       Restart containers"
        echo "  logs [svc]    Show logs (optionally for specific service)"
        echo "  shell, bash   Open shell in development container"
        echo "  mongo, db     Open MongoDB shell"
        echo "  rebuild       Rebuild containers from scratch"
        echo "  clean         Remove all containers and volumes"
        echo "  help          Show this help message"
        echo ""
        echo "Services available:"
        echo "  Frontend:     http://localhost:3000"
        echo "  Backend API:  http://localhost:3001"
        echo "  MongoDB:      mongodb://localhost:27017"
        ;;
    
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Use './dev.sh help' for usage information"
        exit 1
        ;;
esac