# Deployment Guide for CodersInFlow

## Quick Start

1. **Prepare for deployment:**
   ```bash
   npm run deploy:prepare
   ```
   This will build the site and copy PHP files to the dist directory.

2. **Upload files to your server:**
   - Upload everything from the `dist/` directory to `/var/www/codersinflow.com/`
   - Make sure to preserve the directory structure

3. **Upload your VSIX files:**
   - Place your `.vsix` files in `/var/www/codersinflow.com/downloads/`
   - Follow the naming format: `codersinflow-X.X.X.vsix` (e.g., `codersinflow-0.0.695.vsix`)

4. **Update nginx configuration:**
   - Copy the contents of `nginx.conf` to your server's nginx config
   - Usually located at `/etc/nginx/sites-available/codersinflow.com`

5. **Reload nginx:**
   ```bash
   sudo nginx -s reload
   ```

## How the Download System Works

1. Users click "Get Started" which takes them to `/download`
2. The page loads and makes a request to `/api/latest-version.php`
3. The PHP script scans the `/downloads/` directory for `.vsix` files
4. It automatically finds the highest version number and returns it
5. The download page displays the version and provides a download link

## Adding New Versions

Simply upload a new `.vsix` file with a higher version number to the downloads directory. The system will automatically detect and serve it as the latest version. No code changes needed!

## Directory Structure on Server

```
/var/www/codersinflow.com/
├── api/
│   └── latest-version.php
├── downloads/
│   ├── README.md
│   └── codersinflow-0.0.695.vsix (and other versions)
├── index.html
└── ... (other Astro build files)
```

## Testing Locally

You can test the PHP functionality locally if you have PHP installed:

```bash
# Start PHP server in the public directory
cd public
php -S localhost:8000

# Then visit: http://localhost:8000/api/latest-version.php
```