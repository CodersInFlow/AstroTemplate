# Coders in Flow - Blog & Documentation System

A modern blog and documentation system built with Astro, Go, and MongoDB.

## 🚀 Features

- **Blog System**: Write and manage blog posts with a rich text editor
- **Documentation**: Create technical documentation with syntax highlighting
- **Admin Panel**: Full-featured content management at `/editor`
- **Image Uploads**: Drag-and-drop image support in the editor
- **Authentication**: Secure JWT-based authentication
- **Categories**: Organize content with categories
- **SEO Optimized**: Static site generation for optimal performance

## 📋 Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- Docker and Docker Compose
- Git

## 🛠️ Development Setup

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd coders.website

# Install dependencies
npm install

# Start the development environment
./scripts/dev-blog.sh
```

This will start:
- MongoDB on port 27419
- Go backend API on port 8749
- Astro frontend on port 4321

### Access Points

- **Frontend**: http://localhost:4321
- **Blog**: http://localhost:4321/blog
- **Docs**: http://localhost:4321/docs
- **Editor**: http://localhost:4321/editor
  - Default login: `admin@example.com` / `admin123`
- **API**: http://localhost:8749
- **MongoDB**: `mongodb://admin:password@localhost:27419`

### Manual Development Setup

If you prefer to run services separately:

```bash
# Terminal 1: Start MongoDB
docker-compose up coders-blog-mongodb

# Terminal 2: Start Go backend
cd backend
./scripts/dev.sh

# Terminal 3: Start Astro frontend
npm run dev
```

## 🏗️ Project Structure

```
coders.website/
├── src/                    # Astro frontend source
│   ├── components/         # React/Astro components
│   ├── pages/             # Page routes
│   │   ├── blog/          # Blog pages
│   │   ├── docs/          # Documentation pages
│   │   └── editor/        # Admin panel
│   ├── layouts/           # Page layouts
│   └── styles/            # CSS files
├── backend/               # Go backend API
│   ├── cmd/server/        # Main server entry
│   ├── internal/          # Internal packages
│   │   ├── handlers/      # HTTP handlers
│   │   ├── models/        # Data models
│   │   └── middleware/    # HTTP middleware
│   └── scripts/           # Backend scripts
├── public/                # Static assets
├── nginx/                 # Production Nginx configs
└── scripts/              # Development scripts
```

## 📦 Production Deployment

### 1. Build the Frontend

```bash
# Set production environment
cp .env.production .env

# Build the static site
npm run build
```

The built files will be in the `dist/` directory.

### 2. Deploy to Server

```bash
# Copy built files to your server
rsync -avz dist/ user@server:/var/www/codersinflow.com/

# Copy backend and deployment files
rsync -avz backend/ docker-compose.prod.yml user@server:/opt/codersinflow-blog/
```

### 3. Set Up Production Environment

On your server:

```bash
cd /opt/codersinflow-blog

# Create environment file
cat > .env << EOF
JWT_SECRET=your-very-strong-secret-here
MONGO_PASSWORD=your-strong-mongo-password
MONGODB_URI=mongodb://admin:your-strong-mongo-password@blog-mongodb:27017/codersblog?authSource=admin
EOF

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Configure Nginx

Add the blog locations to your Nginx config:

```bash
# Copy Nginx configuration
cp nginx/includes/blog-locations.conf /etc/nginx/includes/

# Edit your site config to include it
# Add this line after your existing includes:
# include /etc/nginx/includes/blog-locations.conf;

# Test and reload
nginx -t
systemctl reload nginx
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
- `PUBLIC_API_URL`: API base URL (no trailing slash)
  - Development: `http://localhost:8749`
  - Production: `https://yourdomain.com`

#### Backend
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed CORS origin
- `UPLOAD_DIR`: Directory for uploaded files
- `PORT`: Server port (default: 8749)

## 🧞 Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `./scripts/dev-blog.sh` | Start full dev environment |

## 📝 Creating Content

1. **Access the Editor**: Go to http://localhost:4321/editor
2. **Login**: Use the default credentials or create a new account
3. **Create Content**: 
   - Click "New Blog Post" or "New Documentation"
   - Use the rich text editor to write
   - Add code blocks with syntax highlighting
   - Upload images by clicking the image button
   - Save as draft or publish immediately

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on specific ports
   lsof -ti:4321 | xargs kill -9
   lsof -ti:8749 | xargs kill -9
   ```

2. **MongoDB connection failed**
   ```bash
   # Check if MongoDB is running
   docker-compose ps
   
   # View MongoDB logs
   docker-compose logs coders-blog-mongodb
   ```

3. **Image upload fails**
   - Check backend logs: `docker-compose logs coders-blog-backend`
   - Ensure uploads directory has write permissions
   - Verify you're logged in (check for auth cookie)

## 🚀 Advanced Usage

### Running with Docker (Full Stack)

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Database Management

```bash
# Connect to MongoDB
docker exec -it coders-blog-mongodb mongosh -u admin -p password

# Backup database
docker exec coders-blog-mongodb mongodump --authenticationDatabase admin -u admin -p password --db codersblog --out /backup

# Restore database
docker exec coders-blog-mongodb mongorestore --authenticationDatabase admin -u admin -p password --db codersblog /backup/codersblog
```

## 🖥️ Server Deployment

### Directory Structure on Production Server

Everything is deployed to `/var/www/codersinflow.com/`:

```
/var/www/codersinflow.com/
├── dist/                    # Built Astro frontend files
│   ├── client/             # Static assets served by Astro
│   └── server/             # Node.js server files (entry.mjs)
├── backend/                 # Go backend source code
│   ├── cmd/server/         # Main server entry
│   ├── internal/           # Internal packages
│   └── Dockerfile          # Docker build file
├── runtime/                 # Runtime data (NOT in git)
│   ├── mongodb/            # MongoDB database files
│   ├── uploads/            # User uploaded images
│   └── .env                # Production secrets (JWT_SECRET, MONGO_PASSWORD)
├── node_modules/            # Node dependencies
├── docker-compose.prod.yml  # Production Docker config
├── package.json             # Node package config
└── [other source files]     # Your git repo files
```

### System Services & Configs

**Nginx Configuration:**
- `/etc/nginx/sites-enabled/codersinflow.com` - Main site config
- `/etc/nginx/includes/codersinflow-locations.conf` - Sync server routes
- `/etc/nginx/conf.d/codersinflow-server.conf` - Upstream definitions
- `/etc/nginx/backups/` - Config backups

**Systemd Services:**
- `/etc/systemd/system/codersinflow-blog.service` - Docker containers (MongoDB + Go API)
- `/etc/systemd/system/codersinflow-astro.service` - Astro Node.js frontend server

### Running Services

| Service | Port | Description |
|---------|------|-------------|
| Astro Frontend | 4321 | Node.js SSR server |
| Blog/Docs API | 8749 | Go API in Docker |
| MongoDB | 27017 | Database in Docker (internal only) |
| Sync Server | 8080 | Extension sync API |
| Admin UI | 4004 | Sync server admin panel |

### Docker Containers
- `codersinflow-blog-backend` - Go API server
- `codersinflow-blog-mongodb` - MongoDB database

### Environment Variables

Production secrets are stored in `/var/www/codersinflow.com/runtime/.env`:
- `JWT_SECRET` - Authentication token secret
- `MONGO_PASSWORD` - MongoDB root password
- `MONGODB_URI` - Full MongoDB connection string

This file is created automatically during deployment with secure random values.

### Managing Services

```bash
# Check service status
systemctl status codersinflow-astro
systemctl status codersinflow-blog

# View logs
journalctl -u codersinflow-astro -f
docker-compose -f /var/www/codersinflow.com/docker-compose.prod.yml logs -f

# Restart services
systemctl restart codersinflow-astro
cd /var/www/codersinflow.com && docker-compose -f docker-compose.prod.yml restart
```

### Deployment

Run `./deploy.sh` from your local machine. It will:
1. Build the Astro site locally
2. Sync files to the server
3. Install Node dependencies
4. Set up environment variables
5. Start/restart all services
6. Configure systemd for auto-start

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]