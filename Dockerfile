# Unified SSR Multi-tenant Dockerfile
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Copy the unified Astro app
COPY astro-multi-tenant/ /build/

# Make scripts executable
RUN chmod +x /build/scripts/*.sh

# Install dependencies and build
RUN npm ci && npm run build

# Backend builder
FROM golang:1.21-alpine AS backend-builder

WORKDIR /build

# Copy backend source
COPY backend/ /build/

# Build backend
RUN go mod download && \
    go build -o server cmd/server/main.go

# Runtime stage  
FROM node:20-slim

# Install supervisor, MongoDB and required tools
RUN apt-get update && apt-get install -y \
    supervisor \
    wget \
    gnupg \
    && wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add - \
    && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /var/log/supervisor /data/db /var/log/mongodb

WORKDIR /app

# Copy built Astro app
COPY --from=frontend-builder /build/dist /app/dist
COPY --from=frontend-builder /build/package.json /app/
COPY --from=frontend-builder /build/node_modules /app/node_modules

# Copy backend
COPY --from=backend-builder /build/server /app/

# Copy configuration files
COPY sites-config.json /app/sites-config.json
COPY scripts/supervisor.conf /etc/supervisor/supervisord.conf

# Expose ports (these will be overridden by runtime env vars)
EXPOSE 4321 3001

# Start services
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]