# Multi-stage build for all-in-one container
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG PUBLIC_API_URL=https://codersinflow.com/api
ENV PUBLIC_API_URL=$PUBLIC_API_URL
RUN npm run build

FROM golang:1.21-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o server cmd/server/main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o init-admin cmd/init-admin/main.go

# Final production image with everything
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install all dependencies (no nginx needed - host handles it)
RUN apt-get update && apt-get install -y \
    curl wget gnupg lsb-release \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install MongoDB
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && rm -rf /var/lib/apt/lists/*

# Create directories
RUN mkdir -p /data/db /var/log/supervisor /app/backend /app/dist /app/uploads

# Copy built frontend from builder
COPY --from=frontend-builder /app/dist /app/dist

# Copy backend binaries from builder
COPY --from=backend-builder /app/server /app/backend/server
COPY --from=backend-builder /app/init-admin /app/backend/init-admin

# Copy configuration files
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/startup.sh /usr/local/bin/startup.sh
COPY site.config.json /app/site.config.json

RUN chmod +x /usr/local/bin/startup.sh /app/backend/server /app/backend/init-admin

# Set permissions
RUN useradd -r -u 999 mongodb \
    && chown -R mongodb:mongodb /data/db \
    && chown -R www-data:www-data /app/uploads /app/dist

# Expose backend port and optionally frontend dev port
EXPOSE 3001 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["/usr/local/bin/startup.sh"]