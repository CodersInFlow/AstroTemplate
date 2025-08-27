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

## ⚙️ Configuration

### Site Configuration (site.config.json)

All site-specific settings are centralized in `site.config.json`. This file controls:

```json
{
  "site": {
    "name": "codersinflow",           // Internal name (used for containers)
    "displayName": "Coders in Flow",   // Display name  
    "domain": "codersinflow.com",      // Your domain
    "description": "Site description"
  },
  "ports": {
    "frontend": 4916,  // Astro server port (must be unique per site)
    "backend": 8752,   // API server port (must be unique per site)
    "mongodb": 27421   // MongoDB port (must be unique per site)
  },
  "database": {
    "name": "codersblog"  // MongoDB database name
  },
  "admin": {
    "email": "admin@codersinflow.com",  // Default admin email
    "password": "admin123",              // Default admin password
    "name": "Admin"                      // Admin display name
  },
  "deployment": {
    "server": {
      "host": "your-server.com",  // Server hostname/IP
      "user": "root",              // SSH user
      "port": 22,                  // SSH port
      "path": "/var/www/codersinflow.com"  // Deployment path
    }
  }
}
```

**Important Notes:**
- Each site MUST have unique port numbers to avoid conflicts
- Admin credentials are automatically created/updated during deployment
- The deployment path should match your domain name for clarity

## 🏗️ System Architecture Overview

### Tech Stack
- **Frontend**: Astro with React components, TailwindCSS for styling
- **Backend**: Go with Gorilla Mux, JWT authentication
- **Database**: MongoDB
- **Deployment**: Docker containers, nginx reverse proxy

### Current Authentication System
- **User Model** (backend/internal/models/user.go:10-19):
  - Currently 2 roles: admin and user
  - Approval system for new registrations
  - JWT tokens with 7-day expiration
  - httpOnly cookies for web security
  
- **Authentication Flow**:
  - Login creates JWT with userId, email, role
  - Token stored in httpOnly cookie
  - Middleware validates on each request
  - Role-based access control (admin/user)

## 🛥️ Boat Lift Management System

### Overview
The system supports multiple boat lifts per user account with a sophisticated mutual authentication system between the boat lift hardware, mobile app, and server. This creates a secure triangle of trust where the server and lift can verify each other through an untrusted mobile app intermediary.

### Core Components

#### 1. Boat Lift Entity
Each boat lift has:
- **Unique Lift ID**: System-generated identifier
- **Owner**: Reference to primary user account
- **Lift Secret Key**: Shared secret for lift-server authentication
- **Public Key**: For asymmetric cryptography operations
- **Metadata**: Name, location, model, installation date
- **Status**: Active, maintenance, offline
- **Access Log**: Audit trail of all access attempts

#### 2. Authentication Triangle
The system implements mutual authentication between three parties:

```
    Server (Trusted)
         /\
        /  \
       /    \
      /      \
Mobile App   Boat Lift
(Untrusted)  (Trusted)
```

**Authentication Flow**:
1. **User → Mobile App**: User opens app and selects boat lift
2. **Mobile App → Boat Lift**: App connects via Bluetooth/WiFi and requests access
3. **Boat Lift → Mobile App**: Lift generates challenge with:
   - Timestamp
   - Nonce (random value)
   - Lift ID
   - Signed with lift's private key
4. **Mobile App → Server**: Forwards challenge package (app cannot decrypt/modify)
5. **Server Verification**:
   - Validates lift signature using stored public key
   - Checks timestamp freshness (prevent replay attacks)
   - Verifies user has permission for this lift
   - Generates response token signed with server's private key
6. **Server → Mobile App**: Returns encrypted response token
7. **Mobile App → Boat Lift**: Forwards server response
8. **Boat Lift Verification**:
   - Validates server signature
   - Checks response matches challenge
   - Grants or denies access

This ensures:
- Lift knows response genuinely came from authorized server
- Server knows request genuinely came from registered lift
- Mobile app cannot forge either party's credentials
- Protection against replay attacks via timestamps/nonces

### User Access Management

#### Access Levels
1. **Owner**: Full control
   - Add/remove other users
   - View all access logs
   - Modify lift settings
   - Generate guest access keys

2. **Admin**: Delegated management
   - Can operate lift
   - Can generate temporary guest keys
   - Can view access logs
   - Cannot remove owner or other admins

3. **Guest**: Time-limited access
   - Can operate lift during valid time window
   - Access automatically expires
   - Cannot modify any settings
   - Cannot view logs or other users

#### Guest Access System
- **Key Generation**: Owner/Admin generates time-limited access key
- **Key Format**: Encrypted JWT containing:
  - Guest email/phone
  - Lift ID(s)
  - Start and end timestamps
  - Usage restrictions (e.g., max uses per day)
- **Key Distribution**: Send via email/SMS with setup link
- **Guest Setup Process**:
  1. Guest receives key via email/SMS
  2. Clicks setup link or enters key in app
  3. Creates temporary account (or uses existing)
  4. Access automatically configured with restrictions
  5. Receives notification when access is about to expire

### Database Schema

#### boat_lifts Collection
```javascript
{
  _id: ObjectId,
  lift_id: String (unique),
  owner_id: ObjectId (ref: users),
  name: String,
  location: {
    address: String,
    coordinates: [longitude, latitude]
  },
  keys: {
    secret_key: String (hashed),
    public_key: String,
    private_key_encrypted: String,
    key_rotation_date: Date
  },
  metadata: {
    model: String,
    serial_number: String,
    installation_date: Date,
    firmware_version: String,
    last_maintenance: Date
  },
  status: String (active|maintenance|offline),
  created_at: Date,
  updated_at: Date
}
```

#### lift_access Collection
```javascript
{
  _id: ObjectId,
  lift_id: String (ref: boat_lifts),
  user_id: ObjectId (ref: users),
  granted_by: ObjectId (ref: users),
  access_level: String (owner|admin|guest),
  permissions: [String],
  time_restrictions: {
    start_date: Date,
    end_date: Date,
    allowed_hours: {
      start: String (HH:MM),
      end: String (HH:MM)
    },
    max_uses_per_day: Number
  },
  access_key: String (for guests),
  created_at: Date,
  expires_at: Date,
  last_used: Date,
  usage_count: Number
}
```

#### access_logs Collection
```javascript
{
  _id: ObjectId,
  lift_id: String,
  user_id: ObjectId,
  action: String (access_granted|access_denied|settings_changed),
  method: String (mobile_app|physical_key|web_interface),
  details: {
    ip_address: String,
    device_info: String,
    location: [longitude, latitude],
    challenge_nonce: String,
    failure_reason: String (if denied)
  },
  timestamp: Date
}
```

### Mobile App Integration

#### App Capabilities
- **Lift Discovery**: Scan for nearby lifts via Bluetooth/WiFi
- **Access Request**: Initiate authentication flow
- **Guest Mode**: Enter access key to set up temporary access
- **Offline Mode**: Cache recent auth tokens for limited offline use
- **Push Notifications**: Access granted/denied, maintenance reminders

#### API Endpoints

**Authentication**:
- `POST /api/mobile/auth/challenge-response` - Process lift challenge
- `POST /api/mobile/auth/validate-guest-key` - Validate guest access key

**Lift Management**:
- `GET /api/mobile/lifts` - List user's accessible lifts
- `GET /api/mobile/lifts/:id/status` - Get lift status
- `POST /api/mobile/lifts/:id/operate` - Send operation command
- `GET /api/mobile/lifts/:id/logs` - View access logs (if permitted)

**Access Management**:
- `POST /api/lifts/:id/access/grant` - Grant user access
- `POST /api/lifts/:id/access/revoke` - Revoke user access
- `POST /api/lifts/:id/guest-key/generate` - Generate guest key
- `GET /api/lifts/:id/access/list` - List all users with access

### Security Considerations

1. **Key Rotation**: Regular rotation of lift secret keys (quarterly)
2. **Rate Limiting**: Prevent brute force attacks on authentication
3. **Audit Logging**: Complete audit trail of all access attempts
4. **Encryption**: All sensitive data encrypted at rest
5. **Challenge Expiry**: Challenges valid for only 30 seconds
6. **Geographic Fencing**: Optional restriction to specific locations
7. **Two-Factor Auth**: Optional 2FA for owner account operations
8. **Firmware Validation**: Verify lift firmware integrity before auth

### Implementation Roadmap

#### Phase 1: Core Infrastructure
- Extend user model with multi-level roles
- Create boat_lifts and lift_access collections
- Implement basic CRUD operations for lifts
- Set up owner/admin/guest access levels

#### Phase 2: Authentication System
- Implement challenge-response protocol
- Create key generation and validation
- Set up mutual authentication flow
- Add access logging

#### Phase 3: Mobile API
- Create mobile-specific endpoints
- Implement guest key system
- Add push notification support
- Build offline token caching

#### Phase 4: Security Hardening
- Add rate limiting
- Implement key rotation
- Set up comprehensive audit logging
- Add geographic restrictions

#### Phase 5: Advanced Features
- Maintenance scheduling system
- Usage analytics dashboard
- Automated access expiry notifications
- Integration with smart home systems

### Design Customization Points

#### Primary Styling Hooks
- **Global CSS** (src/styles/global.css) - Tailwind base styles
- **Tailwind Config** (tailwind.config.js) - Extend theme here
- **Layout Component** (src/layouts/Layout.astro) - Meta tags, global imports
- **Component Styling** - Each component uses Tailwind classes
- **Color Scheme** - Currently gray-900/800 backgrounds, indigo-400 accents

#### Key Components to Modify
- HeroSection.astro - Main landing hero
- HeaderSimple.astro - Navigation
- Footer.astro - Footer design
- Section components in src/components/sections/

## 📋 Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- Docker and Docker Compose
- Git

## 🛠️ Development Setup

### Repository Structure

This repository uses Git submodules for components and blog functionality:
- `src/components` - React components (submodule)
- `src/pages/blog` - Blog system (submodule)

### Quick Start

```bash
# Clone the repository with submodules
git clone --recurse-submodules <your-repo-url>
cd codersinflow.com

# OR if you already cloned without submodules
git submodule update --init --recursive

# Run setup script (initializes submodules and installs dependencies)
./setup.sh

# Start the development environment
./scripts/dev-blog.sh
```

### Updating Submodules

```bash
# Pull latest changes from all repositories
./pull_submodules.sh
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
  - Default login: Check `site.config.json` for admin credentials
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

### Automated Deployment with deploy.sh

The easiest way to deploy is using the automated deployment script:

```bash
# Configure your site settings first
nano site.config.json  # Edit server details and admin credentials

# Run the deployment
./deploy.sh
```

The deployment script will:
1. Build the Astro site with production settings
2. Create Docker configurations dynamically from your config
3. Sync all files to your server
4. Set up nginx with SSL (requires existing certificates)
5. Start all services (MongoDB, Go API, Astro frontend)
6. **Automatically create/update the admin user** from site.config.json
7. Set up systemd services for automatic startup

### What the Deploy Script Does

#### 1. Reads Configuration
The script reads all settings from `site.config.json`:
- Site name, domain, and ports
- Server connection details (host, user, SSH port)
- Admin credentials for automatic setup
- Database configuration

#### 2. Builds the Frontend
```bash
export PUBLIC_API_URL="https://yourdomain.com"
npm run build
```

#### 3. Creates Production Docker Compose
Generates `docker-compose.prod.yml` with your specific ports and settings.

#### 4. Syncs to Server
Uses rsync to efficiently transfer files:
- Excludes node_modules, .git, runtime directories
- Preserves file permissions
- Deletes removed files

#### 5. Sets Up Admin User
The script automatically:
- Generates a bcrypt hash of the admin password
- Creates or updates the admin user in MongoDB
- Uses credentials from site.config.json

Admin will be accessible at:
- URL: `https://yourdomain.com/editor/login`
- Email: From `admin.email` in config
- Password: From `admin.password` in config

#### 6. Configures Nginx
Creates and deploys nginx configuration with:
- SSL certificate paths
- Reverse proxy to Astro frontend
- API proxy to Go backend
- Static asset caching

#### 7. Starts Services
- Docker containers for MongoDB and Go API
- Systemd service for Astro frontend
- Automatic restart on failure

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
2. **Login**: Use credentials from `site.config.json` (admin section)
3. **Create Content**: 
   - Click "New Blog Post" or "New Documentation"
   - Use the rich text editor to write
   - Add code blocks with syntax highlighting
   - Upload images by clicking the image button
   - Save as draft or publish immediately

## 🔑 Admin User Management

### Setting Admin Credentials

Admin credentials are configured in `site.config.json`:

```json
"admin": {
  "email": "admin@codersinflow.com",
  "password": "admin123",
  "name": "Admin"
}
```

### Automatic Admin Setup

When you run `./deploy.sh`, the admin user is automatically:
- Created if it doesn't exist
- Updated with new password if it does exist
- Given full admin privileges

### Manual Password Reset

If you need to manually reset the admin password:

1. **Update site.config.json** with new password
2. **Run the setup script**:
   ```bash
   node scripts/setup-admin.js
   ```
   This will output the MongoDB commands needed.

3. **For local development**:
   ```bash
   # Connect to local MongoDB
   docker exec -it coders-blog-mongodb mongosh -u admin -p password codersblog
   
   # Paste the commands from setup-admin.js output
   ```

4. **For production server**:
   ```bash
   # SSH to your server
   ssh user@server
   
   # Navigate to site directory
   cd /var/www/codersinflow.com
   
   # Run setup script
   node scripts/setup-admin.js
   
   # Apply to MongoDB
   docker exec -i codersinflow-blog-mongodb mongosh -u admin -p ${MONGO_PASSWORD} codersblog < runtime/setup-admin.mongo
   ```

### Quick Password Reset Script

For convenience, use the included reset script:

```bash
# Edit reset-admin.js with your desired password
nano reset-admin.js

# Run it to get the hash
node reset-admin.js

# Copy the MongoDB command it outputs and run it in MongoDB
```

### Security Best Practices

1. **Change default password immediately** after first deployment
2. **Use strong passwords** - at least 12 characters with mixed case, numbers, and symbols
3. **Keep site.config.json secure** - never commit passwords to public repos
4. **Rotate passwords regularly** - every 3-6 months
5. **Use different passwords** for development and production

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

### Important: Disable IPv6 on Server

Before deploying, it's crucial to disable IPv6 on your server to prevent connection issues. Services that only listen on IPv4 will fail if nginx tries to connect via IPv6.

#### Quick Method:
```bash
# SSH to your server
ssh root@yourserver

# Disable IPv6 immediately
echo 'net.ipv6.conf.all.disable_ipv6 = 1' >> /etc/sysctl.conf
echo 'net.ipv6.conf.default.disable_ipv6 = 1' >> /etc/sysctl.conf
echo 'net.ipv6.conf.lo.disable_ipv6 = 1' >> /etc/sysctl.conf
sysctl -p
```

#### Using the Included Script:
```bash
# Copy and run the disable-ipv6 script on your server
scp scripts/disable-ipv6.sh root@yourserver:/tmp/
ssh root@yourserver "bash /tmp/disable-ipv6.sh"
```

#### Why This is Necessary:
- Astro and other services often bind only to IPv4 (0.0.0.0)
- Nginx defaults to `localhost` which resolves to both IPv4 and IPv6
- When nginx tries IPv6 `[::1]` first and the service isn't listening there, connections fail
- Our configs use `127.0.0.1` instead of `localhost` to force IPv4

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