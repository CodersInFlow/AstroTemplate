#!/bin/bash

# Deploy to production server with blacklist support
set -e

# Load configuration from .env
if [ -f ".env" ]; then
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        # Remove inline comments and trim whitespace
        value="${value%%#*}"
        value="${value%"${value##*[![:space:]]}"}"
        # Export the variable
        export "$key=$value"
    done < <(grep -v '^#' .env | grep -v '^$')
fi

# Use environment variables or defaults
REGISTRY="${DOCKER_REGISTRY:-local}"
TAG="${DOCKER_TAG:-latest}"
IMAGE_NAME="${DOCKER_IMAGE_NAME:-multi-tenant-app}"
CONTAINER_NAME="${DOCKER_CONTAINER_NAME:-multi-tenant-container}"
SERVER="${DEPLOY_SERVER}"
USER="${DEPLOY_USER:-root}"
PORT="${DEPLOY_PORT:-22}"

# Check if server is configured
if [ -z "$SERVER" ] || [ "$SERVER" = "your-server.com" ]; then
    echo "❌ Error: DEPLOY_SERVER not configured in .env file"
    echo "   Please set DEPLOY_SERVER in your .env file"
    exit 1
fi
REMOTE_BASE_DIR="${REMOTE_BASE_DIR:-/var/www/docker}"
NGINX_CONFIG_DIR="${NGINX_CONFIG_DIR:-/etc/nginx}"

echo "🚀 Deploying to Production"
echo "========================="
echo "Server: $USER@$SERVER:$PORT"
echo "Image: $IMAGE_NAME:$TAG"
echo "Container: $CONTAINER_NAME"
echo "Registry: $REGISTRY"
echo "Remote dir: $REMOTE_BASE_DIR"
echo ""

# Check blacklist
if [ -f "blacklist.txt" ]; then
    echo "📋 Using blacklist.txt for deployment"
    BLACKLISTED_SITES=$(cat blacklist.txt | grep -v '^#' | grep -v '^$' | tr '\n' ' ')
    echo "🚫 Excluding: $BLACKLISTED_SITES"
    echo ""
fi

# Build image with blacklist support
if [ -f "scripts/build-with-blacklist.sh" ] && [ -f "blacklist.txt" ]; then
    echo "📦 Building Docker image with blacklist..."
    # Need to pass the image name to the build script
    DOCKER_IMAGE_NAME=$IMAGE_NAME DOCKER_TAG=$TAG ./scripts/build-with-blacklist.sh
else
    echo "📦 Building Docker image..."
    docker build -f Dockerfile -t $IMAGE_NAME:$TAG .
fi

# Handle registry push (skip if local)
if [ "$REGISTRY" != "local" ]; then
    echo "🏷️  Tagging image for registry..."
    docker tag $IMAGE_NAME:$TAG $REGISTRY/$IMAGE_NAME:$TAG
    
    echo "⬆️  Pushing to registry..."
    docker push $REGISTRY/$IMAGE_NAME:$TAG
    REMOTE_IMAGE="$REGISTRY/$IMAGE_NAME:$TAG"
else
    echo "📦 Saving Docker image locally..."
    docker save $IMAGE_NAME:$TAG | gzip > $IMAGE_NAME-$TAG.tar.gz
    
    echo "⬆️  Uploading image to server..."
    scp -P $PORT $IMAGE_NAME-$TAG.tar.gz $USER@$SERVER:$REMOTE_BASE_DIR/
    
    echo "🔄 Loading image on server..."
    ssh -p $PORT $USER@$SERVER "cd $REMOTE_BASE_DIR && gunzip -c $IMAGE_NAME-$TAG.tar.gz | docker load && rm $IMAGE_NAME-$TAG.tar.gz"
    
    rm $IMAGE_NAME-$TAG.tar.gz
    REMOTE_IMAGE="$IMAGE_NAME:$TAG"
fi

# Generate nginx configs (respecting blacklist)
echo "🔧 Generating nginx configurations..."
./scripts/generate-nginx-configs.sh

# Upload nginx configs (only non-blacklisted)
echo "📤 Uploading nginx configurations..."
ssh -p $PORT $USER@$SERVER "mkdir -p $NGINX_CONFIG_DIR/sites-enabled $NGINX_CONFIG_DIR/includes"

for conf in nginx/sites-enabled/*.conf; do
    if [ -f "$conf" ]; then
        domain=$(basename "$conf" .conf)
        site_id="${domain%.com}"
        
        # Skip if blacklisted
        if [ -f "blacklist.txt" ] && grep -q "^$site_id$" blacklist.txt; then
            echo "  ⏭️  Skipping $domain (blacklisted)"
        else
            echo "  📤 Uploading $domain"
            scp -P $PORT "$conf" $USER@$SERVER:$NGINX_CONFIG_DIR/sites-enabled/
        fi
    fi
done

# Upload include files if they exist (only for non-blacklisted sites)
if [ -d "nginx/includes" ]; then
    for include in nginx/includes/*; do
        if [ -f "$include" ]; then
            filename=$(basename "$include")
            site_id="${filename%-locations.conf}"
            
            # Skip if blacklisted
            if [ -f "blacklist.txt" ] && grep -q "^$site_id$" blacklist.txt; then
                echo "  ⏭️  Skipping include for $site_id (blacklisted)"
            else
                echo "  📤 Uploading include: $filename"
                scp -P $PORT "$include" $USER@$SERVER:$NGINX_CONFIG_DIR/includes/
            fi
        fi
    done
fi

# Upload filtered sites-config.json
if [ -f "blacklist.txt" ]; then
    echo "📝 Creating filtered sites-config.json..."
    python3 << EOF > sites-config-filtered.json
import json
import os

with open('sites-config.json', 'r') as f:
    config = json.load(f)

blacklist = []
if os.path.exists('blacklist.txt'):
    with open('blacklist.txt', 'r') as f:
        blacklist = [line.strip() for line in f if line.strip() and not line.startswith('#')]

# Handle both old format (object) and new format (array)
if isinstance(config, dict) and 'sites' not in config:
    # Old format: domains as keys
    filtered_config = {}
    for domain, site_data in config.items():
        if site_data.get('id') not in blacklist:
            filtered_config[domain] = site_data
else:
    # New format: array of sites
    filtered_sites = [site for site in config.get('sites', []) if site['id'] not in blacklist]
    filtered_config = {'sites': filtered_sites}

print(json.dumps(filtered_config, indent=2))
EOF
    
    echo "  📤 Uploading filtered sites-config.json..."
    scp -P $PORT sites-config-filtered.json $USER@$SERVER:$REMOTE_BASE_DIR/sites-config.json
    rm sites-config-filtered.json
else
    echo "  📤 Uploading sites-config.json..."
    scp -P $PORT sites-config.json $USER@$SERVER:$REMOTE_BASE_DIR/
fi

# Upload docker-compose.yml
echo "  📤 Uploading docker-compose.yml..."
scp -P $PORT docker-compose.yml $USER@$SERVER:$REMOTE_BASE_DIR/

# Deploy on server
echo "🌐 Deploying on $SERVER..."
ssh -p $PORT $USER@$SERVER << EOF
  cd $REMOTE_BASE_DIR
  
  # Stop existing container with same name
  docker stop $CONTAINER_NAME 2>/dev/null || true
  docker rm $CONTAINER_NAME 2>/dev/null || true
  
  # Create deployment-specific docker-compose
  cat > docker-compose-$CONTAINER_NAME.yml << 'COMPOSE'
version: '3.8'
services:
  app:
    image: $REMOTE_IMAGE
    container_name: $CONTAINER_NAME
    ports:
      - "${FRONTEND_PORT:-80}:4321"
      - "${BACKEND_PORT:-3001}:3001"
    environment:
      - NODE_ENV=production
      - PORT=4321
      - API_PORT=3001
      - MONGODB_URI=${MONGODB_URI:-mongodb://host.docker.internal:27017/codersblog}
      - JWT_SECRET=${JWT_SECRET}
      - PUBLIC_API_URL=${PUBLIC_API_URL:-http://127.0.0.1:3001}
    volumes:
      - ./uploads:/app/uploads
      - ./sites-config.json:/app/sites-config.json:ro
    restart: unless-stopped
COMPOSE
  
  # Start new container
  docker-compose -f docker-compose-$CONTAINER_NAME.yml up -d
  
  # Reload nginx
  nginx -t && nginx -s reload
  
  # Show status
  docker ps | grep $CONTAINER_NAME
EOF

echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo "Deployed sites:"
python3 << EOF
import json

with open('sites-config.json', 'r') as f:
    config = json.load(f)

blacklist = []
try:
    with open('blacklist.txt', 'r') as f:
        blacklist = [line.strip() for line in f if line.strip() and not line.startswith('#')]
except:
    pass

# Handle both old format (object) and new format (array)
if isinstance(config, dict) and 'sites' not in config:
    # Old format: domains as keys
    for domain, site_data in config.items():
        if site_data.get('id') not in blacklist:
            print(f"  ✓ https://{domain}")
else:
    # New format: array of sites
    for site in config.get('sites', []):
        if site['id'] not in blacklist:
            print(f"  ✓ https://{site['domain']}")
EOF