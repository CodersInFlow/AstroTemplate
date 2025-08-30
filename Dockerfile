# Unified SSR Multi-tenant Dockerfile
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Copy the unified Astro app
COPY astro-multi-tenant/ /build/

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
FROM node:20-alpine

# Install supervisor
RUN apk add --no-cache supervisor mongodb-tools

WORKDIR /app

# Copy built Astro app
COPY --from=frontend-builder /build/dist /app/dist
COPY --from=frontend-builder /build/package.json /app/
COPY --from=frontend-builder /build/node_modules /app/node_modules

# Copy backend
COPY --from=backend-builder /build/server /app/

# Copy configuration files
COPY sites-config.json /app/sites-config.json
COPY scripts/supervisor.conf /etc/supervisor/conf.d/

# Environment variables
ENV NODE_ENV=production
ENV PORT=4321
ENV API_PORT=3001
ENV MONGODB_URI=mongodb://127.0.0.1:27017/codersblog
ENV PUBLIC_API_URL=http://127.0.0.1:3001

# Expose ports
EXPOSE 4321 3001

# Start services
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]