# Blog & Documentation System

A complete content management system built with Astro (frontend) and Go (backend) using MongoDB for data storage.

## Important: Data Storage Architecture

**All content is stored as structured data in MongoDB**, not as rendered HTML:
- Posts are stored as **TipTap JSON** format (raw editor data)
- All metadata (title, description, author, category, etc.) is in the database
- Images are referenced by URL paths in the content
- **Pages can be regenerated anytime** with different styles
- Style changes are easy - just update components and regenerate

This means you can completely change the design/layout without touching the content!

## Features

### Core Features
- **Dual Content Types**: Blog posts and documentation with identical functionality
- **Rich Text Editor**: TipTap with code highlighting, images, links, lists
- **Table of Contents**: Auto-generated from headings with smooth scrolling
- **Image Management**: Upload and lightbox/modal viewing
- **Code Blocks**: Syntax highlighting with copy button
- **Featured Posts**: Special section for highlighted content
- **Category System**: Organize content with active filtering

### Authentication & Security
- **JWT Authentication**: Secure token-based auth with httpOnly cookies
- **Role Management**: Admin and user roles
- **User Approval**: New users require admin approval
- **Protected Routes**: Editor interface requires authentication

### Developer Experience
- **Hot Reload**: Both frontend (Astro) and backend (Go)
- **Unique Ports**: Avoid conflicts (API: 8749, MongoDB: 27419)
- **Unique Container Names**: `coders-blog-frontend`, `coders-blog-backend`, `coders-blog-mongodb`
- **Docker Setup**: Everything containerized for easy deployment
- **Development Script**: One command to run everything

## Quick Start

### Option 1: Development Mode (Recommended)
```bash
# Install dependencies
npm install

# Run the dev script
./scripts/dev-blog.sh
```

**What the script does:**
1. ✅ Checks if Docker is running
2. 🗄️ Starts MongoDB in Docker (container: `coders-blog-mongodb`, port: 27419)
3. 🔧 Starts Go backend locally (port: 8749, hot reload enabled)
4. 🎨 Starts Astro frontend locally (port: 4321, hot reload enabled)
5. 🛑 Cleans up everything when you press Ctrl+C

### Option 2: Docker (Everything in Containers)
```bash
# Run all services in containers
docker-compose up
```

**This creates:**
- `coders-blog-frontend` - Astro app (port 4321)
- `coders-blog-backend` - Go API (port 8749)
- `coders-blog-mongodb` - MongoDB database (port 27419)

## Access Points

- **Main Site**: http://localhost:4321
- **Blog**: http://localhost:4321/blog
- **Documentation**: http://localhost:4321/docs
- **Editor**: http://localhost:4321/editor
- **API**: http://localhost:8749
- **MongoDB**: mongodb://admin:password@localhost:27419/codersblog

## Default Credentials

- Email: `admin@codersinflow.com`
- Password: `admin123`

**Important**: Change the password after first login!

### Creating the Admin User

If the admin user doesn't exist, run:
```bash
cd backend && go run scripts/seed_admin.go
```

## Project Structure

```
coders.website/
├── src/
│   ├── pages/
│   │   ├── blog/               # Blog section
│   │   │   ├── index.astro     # Blog listing
│   │   │   └── [slug].astro    # Individual blog post
│   │   ├── docs/               # Documentation section
│   │   │   ├── index.astro     # Docs listing
│   │   │   └── [slug].astro    # Individual doc
│   │   └── editor/             # Content management
│   │       ├── index.astro     # Dashboard
│   │       ├── login.astro     # Login page
│   │       ├── register.astro  # Registration
│   │       ├── posts/          # Post management
│   │       │   ├── new.astro   # Create post
│   │       │   └── edit/       # Edit post
│   │       └── categories/     # Category management
│   └── components/
│       ├── BlogPost.tsx        # Blog post display with TOC
│       ├── RichTextRenderer.tsx # Content renderer
│       └── editor/
│           └── RichTextEditor.tsx # TipTap editor
├── backend/
│   ├── cmd/server/            # Main Go application
│   ├── internal/
│   │   ├── models/           # Data models
│   │   ├── handlers/         # API handlers
│   │   ├── middleware/       # Auth middleware
│   │   └── database/         # MongoDB connection
│   └── scripts/
│       ├── dev.sh           # Backend dev script
│       └── init-mongo.js    # DB initialization
├── docker-compose.yml        # Container setup
├── scripts/
│   └── dev-blog.sh          # Full dev environment script
└── uploads/                 # Image storage
```

## API Reference

### Authentication
```bash
# Login
POST /api/auth/login
{ "email": "user@example.com", "password": "password" }

# Register (requires admin approval)
POST /api/auth/register
{ "name": "John Doe", "email": "john@example.com", "password": "password" }

# Get current user
GET /api/auth/me (requires auth)

# Logout
POST /api/auth/logout (requires auth)
```

### Content Management
```bash
# List posts
GET /api/posts?type=blog|docs&category=slug

# Get single post
GET /api/posts/:slug

# Create post (requires auth)
POST /api/posts
{
  "title": "Post Title",
  "slug": "post-slug",
  "description": "Brief description",
  "content": "{\"type\":\"doc\",\"content\":[...]}",  # TipTap JSON
  "type": "blog|docs",
  "category": "category-id",
  "published": true
}

# Update post (requires auth)
PUT /api/posts/:id

# Delete post (requires auth)
DELETE /api/posts/:id
```

### Categories
```bash
# List categories
GET /api/categories?type=blog|docs

# Create category (requires auth)
POST /api/categories
{ "name": "Tutorial", "type": "blog" }

# Delete category (requires auth)
DELETE /api/categories/:id
```

### File Upload
```bash
# Upload image (requires auth)
POST /api/upload
Content-Type: multipart/form-data
file: [image file]

# Returns: { "url": "/uploads/filename.jpg" }
```

### Admin Functions
```bash
# List all users (admin only)
GET /api/admin/users

# Approve user (admin only)
PUT /api/admin/users/:id/approve

# Change user role (admin only)
PUT /api/admin/users/:id/role
{ "role": "admin|user" }
```

## MongoDB Database Details

### Container Configuration
- **Container Name**: `coders-blog-mongodb` (unique to avoid conflicts)
- **Port**: 27419 (non-standard to avoid conflicts with local MongoDB)
- **Volume**: `coders_blog_mongodb_data` (persists data between restarts)
- **Credentials**: admin / password
- **Database Name**: codersblog

### Initial Setup
On first startup, MongoDB runs `backend/scripts/init-mongo.js` which:
1. Creates the database and collections
2. Sets up indexes for performance
3. Creates default admin user (admin@example.com / admin123)
4. Creates initial categories (General for blog, Getting Started for docs)

### Database Access

#### Via MongoDB Shell:
```bash
# Connect while container is running
docker exec -it coders-blog-mongodb mongosh -u admin -p password

# Switch to database
use codersblog

# Query data
db.posts.find().pretty()
db.users.find().pretty()
db.categories.find().pretty()

# Check indexes
db.posts.getIndexes()
```

#### Via MongoDB Compass:
Connect with: `mongodb://admin:password@localhost:27419/codersblog?authSource=admin`

### Data Persistence
- Data is stored in Docker volume `coders_blog_mongodb_data`
- **Data persists between container restarts**
- To completely reset database: `docker-compose down -v`

## Database Schema

### Posts Collection
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  content: String (TipTap JSON),
  description: String,
  type: "blog" | "docs",
  author: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  coverImage: String (optional),
  readingTime: Number,
  order: Number (for docs),
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "user",
  approved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  type: "blog" | "docs",
  createdAt: Date
}
```

## Development Tips

### Adding New Features
1. **Frontend**: Add Astro pages in `src/pages/`
2. **Components**: React components with `client:load` directive
3. **API**: Add handlers in `backend/internal/handlers/`
4. **Models**: Update in `backend/internal/models/`

### Styling
- Uses Tailwind CSS
- Dark theme throughout
- Responsive design
- Smooth transitions and hover effects

### Performance
- Static generation for public pages
- Dynamic rendering for editor
- Image optimization
- Code splitting

## Production Deployment

1. **Environment Variables**:
   ```env
   PUBLIC_API_URL=https://api.yoursite.com
   JWT_SECRET=strong-secret-key
   MONGODB_URI=mongodb://...
   CORS_ORIGIN=https://yoursite.com
   ```

2. **Build**:
   ```bash
   # Frontend
   npm run build
   
   # Backend
   cd backend
   go build -o server cmd/server/main.go
   ```

3. **Deploy with Docker**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Troubleshooting

### Common Issues

1. **Port Conflicts**:
   ```bash
   # Check what's using our unique ports
   lsof -i :8749    # API port
   lsof -i :27419   # MongoDB port
   
   # We use non-standard ports to avoid conflicts:
   # - 8749 instead of 8080 (common API port)
   # - 27419 instead of 27017 (default MongoDB)
   ```

2. **Container Name Conflicts**:
   ```bash
   # Check if containers already exist
   docker ps -a | grep coders-blog
   
   # Remove old containers if needed
   docker rm coders-blog-mongodb
   docker rm coders-blog-backend
   docker rm coders-blog-frontend
   ```

3. **MongoDB Connection**:
   ```bash
   # Check if MongoDB container is running
   docker ps | grep coders-blog-mongodb
   
   # View MongoDB logs
   docker logs coders-blog-mongodb
   
   # Test connection
   docker exec -it coders-blog-mongodb mongosh -u admin -p password
   ```

4. **CORS Errors**:
   - Check `CORS_ORIGIN` matches frontend URL
   - Ensure credentials are included in requests

5. **Editor Not Loading**:
   - Install TipTap dependencies: `npm install`
   - Check browser console for errors

## Next Steps

- [ ] Add search functionality
- [ ] Implement RSS feed
- [ ] Add sitemap generation
- [ ] Email notifications for new users
- [ ] Version control for docs
- [ ] API rate limiting
- [ ] Image optimization pipeline
- [ ] Backup/restore scripts

## License

Part of the Coders Website project.