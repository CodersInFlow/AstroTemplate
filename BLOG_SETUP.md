# Blog System Setup Guide

## Quick Start (All-in-One)

```bash
# Install dependencies
npm install

# Run everything with Docker Compose
docker-compose up
```

Visit:
- Main site: http://localhost:4321
- Blog: http://localhost:4321/blog
- Docs: http://localhost:4321/docs
- Editor: http://localhost:4321/editor

Default login: `admin@example.com` / `admin123`

## Development Setup (Recommended)

For faster development with hot reload:

```bash
# 1. Install dependencies
npm install

# 2. Run the development script
./scripts/dev-blog.sh
```

This script:
- Runs MongoDB in Docker (port 27419)
- Runs Go backend locally (port 8749)
- Runs Astro frontend locally (port 4321)
- All with hot reload enabled

## Manual Development Setup

If you prefer to run services individually:

### 1. Start MongoDB
```bash
docker-compose up -d mongodb
```

### 2. Start Backend
```bash
cd backend
go mod download  # First time only
./scripts/dev.sh
```

### 3. Start Frontend
```bash
npm run dev
```

## First Time Setup

1. **Create a `.env` file**:
   ```bash
   cp .env.example .env
   ```

2. **Login to the editor**: http://localhost:4321/editor
   - Email: `admin@example.com`
   - Password: `admin123`

3. **Create categories**:
   - Go to Categories section
   - Create at least one category for blog
   - Create at least one category for docs

4. **Create your first post**:
   - Click "New Blog Post" or "New Documentation"
   - Use the rich text editor
   - Save as draft or publish immediately

## Port Configuration

Non-standard ports to avoid conflicts:
- **4321**: Astro frontend (standard)
- **8749**: Go backend API (non-standard)
- **27419**: MongoDB (non-standard)

## Troubleshooting

### Port conflicts
```bash
# Check what's using the ports
lsof -i :8749
lsof -i :27419
```

### MongoDB connection issues
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# View MongoDB logs
docker-compose logs mongodb
```

### Backend not starting
```bash
# Check Go dependencies
cd backend
go mod tidy

# Run directly to see errors
go run cmd/server/main.go
```

### Frontend build issues
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

## Production Deployment

1. Update `.env` with production values
2. Build containers:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```
3. Run in production:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Architecture

- **Frontend**: Astro with React components
- **Backend**: Go with Gorilla Mux
- **Database**: MongoDB
- **Editor**: TipTap rich text editor
- **Auth**: JWT tokens in httpOnly cookies

## API Documentation

See [BLOG_SYSTEM_README.md](./BLOG_SYSTEM_README.md) for API endpoints.