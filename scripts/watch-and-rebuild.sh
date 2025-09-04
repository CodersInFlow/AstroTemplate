#!/bin/bash

# Auto-rebuild script with file watching
# Watches for changes and rebuilds frontend/backend automatically

LOCK_FILE="/tmp/rebuild.lock"
LAST_BUILD_TIME=0
DEBOUNCE_SECONDS=3
LOG_PREFIX="[WATCHER]"

# Clean up lock file on exit
trap "rm -f $LOCK_FILE $LOCK_FILE.queued; echo '$LOG_PREFIX 🛑 Watcher stopped, cleaned up lock files'" EXIT INT TERM

echo "$LOG_PREFIX 👁️  Starting file watcher for auto-rebuild..."
echo "$LOG_PREFIX    Watching: /app/astro-multi-tenant/src/sites/"
echo "$LOG_PREFIX    Watching: /app/sites-config.json"
echo "$LOG_PREFIX    Watching: /app/backend/"
echo "$LOG_PREFIX    Excluding: *.css, dist/, node_modules/"

while true; do
    # Build list of directories to watch (only if they exist)
    WATCH_DIRS="/app/astro-multi-tenant/src/sites/ /app/sites-config.json"
    
    # Add backend directories if they exist
    for dir in /app/backend/cmd/ /app/backend/handlers/ /app/backend/models/ /app/backend/middleware/; do
        [ -d "$dir" ] && WATCH_DIRS="$WATCH_DIRS $dir"
    done
    
    # Wait for file close (complete write)
    # Fixed: Better exclude pattern for CSS files
    CHANGED_FILE=$(inotifywait -r -e close_write,moved_to \
        $WATCH_DIRS \
        --exclude '.*\.css$|.*dist/.*|.*node_modules/.*|.*\.git/.*|.*uploads/.*' \
        --format '%w%f' \
        --quiet 2>/dev/null)
    
    echo "$LOG_PREFIX 📝 Change detected: $CHANGED_FILE"
    
    # Debounce - wait for multiple rapid changes
    echo "$LOG_PREFIX ⏱️  Waiting ${DEBOUNCE_SECONDS}s for additional changes..."
    sleep $DEBOUNCE_SECONDS
    
    # Check lock to prevent concurrent builds
    if [ -f "$LOCK_FILE" ]; then
        # Check if lock is stale (older than 5 minutes)
        if [ $(find "$LOCK_FILE" -mmin +5 2>/dev/null | wc -l) -gt 0 ]; then
            echo "$LOG_PREFIX 🔓 Removing stale lock file (older than 5 minutes)"
            rm -f "$LOCK_FILE"
        else
            echo "$LOG_PREFIX ⏭️  Build already in progress, queuing rebuild..."
            touch "$LOCK_FILE.queued"
            continue
        fi
    fi
    
    # Lock to prevent concurrent builds
    touch "$LOCK_FILE"
    
    echo "$LOG_PREFIX 🔄 Starting rebuild at $(date '+%Y-%m-%d %H:%M:%S')"
    echo "$LOG_PREFIX    File that triggered: $CHANGED_FILE"
    
    # Determine what to rebuild based on changed file
    if [[ $CHANGED_FILE == *"/backend/"* ]]; then
        echo "🔧 Rebuilding Go backend..."
        cd /app/backend
        
        # Build Go server
        if go build -o server cmd/server/main.go; then
            echo "✅ Backend build successful"
            # Restart backend process
            supervisorctl restart backend
            echo "🔄 Backend restarted"
        else
            echo "❌ Backend build failed!"
        fi
    else
        echo "$LOG_PREFIX 🎨 Rebuilding frontend..."
        cd /app/astro-multi-tenant
        
        # Skip CSS generation if CSS file triggered the change
        if [[ $CHANGED_FILE == *".css" ]]; then
            echo "$LOG_PREFIX ⚠️  CSS file changed, skipping to avoid loop"
            rm "$LOCK_FILE"
            continue
        fi
        
        # Determine which site changed (for targeted CSS generation)
        SITE_DIR=$(echo $CHANGED_FILE | grep -oE 'sites/[^/]+' | cut -d'/' -f2 | head -1)
        
        if [ ! -z "$SITE_DIR" ] && [ -d "src/sites/$SITE_DIR" ]; then
            echo "$LOG_PREFIX 📦 Detected change in site: $SITE_DIR"
            
            # Only generate CSS if a non-CSS file changed
            if [[ $CHANGED_FILE != *".css" ]] && [ -f "src/sites/$SITE_DIR/tailwind.config.cjs" ]; then
                echo "$LOG_PREFIX 🎨 Generating CSS for $SITE_DIR..."
                npx tailwindcss -c src/sites/$SITE_DIR/tailwind.config.cjs \
                    -i src/sites/$SITE_DIR/styles/tailwind.css \
                    -o src/sites/$SITE_DIR/styles/main.css \
                    --minify 2>/dev/null
                echo "$LOG_PREFIX ✅ CSS generated for $SITE_DIR"
            fi
        else
            echo "$LOG_PREFIX 🎨 Generating CSS for all sites..."
            if [ -f "./scripts/generate-all-css.sh" ]; then
                ./scripts/generate-all-css.sh 2>/dev/null
            fi
        fi
        
        echo "$LOG_PREFIX 🏗️  Building Astro frontend..."
        
        # Build directly to dist (simpler approach)
        if npm run build 2>&1 | tail -5; then
            echo "$LOG_PREFIX ✅ Frontend build successful"
            
            # Create symlink for supervisor if needed
            if [ ! -L "/app/dist" ]; then
                ln -sf /app/astro-multi-tenant/dist /app/dist
            fi
            
            # Restart frontend process - kill ALL node processes to ensure clean restart
            echo "$LOG_PREFIX 🔄 Restarting frontend service..."
            
            # Kill all node processes (multiple attempts to ensure it's dead)
            echo "$LOG_PREFIX 🛑 Killing all node processes..."
            killall -9 node 2>/dev/null || true
            sleep 1
            killall -9 node 2>/dev/null || true
            
            # Double check port is free
            if lsof -i:4321 > /dev/null 2>&1; then
                echo "$LOG_PREFIX ⚠️  Port 4321 still in use, force killing..."
                lsof -ti:4321 | xargs kill -9 2>/dev/null || true
                sleep 1
            fi
            
            # Clear Node module cache to ensure fresh routes
            echo "$LOG_PREFIX 🧹 Clearing Node module cache..."
            rm -rf /tmp/v8-compile-cache* 2>/dev/null || true
            
            # Start fresh with NODE_ENV to ensure no caching
            echo "$LOG_PREFIX 🚀 Starting fresh frontend process..."
            cd /app/astro-multi-tenant && NODE_ENV=production nohup node --no-warnings dist/server/entry.mjs > /tmp/frontend.log 2>&1 &
            NEW_PID=$!
            sleep 3
            
            # Verify it started
            if kill -0 $NEW_PID 2>/dev/null; then
                echo "$LOG_PREFIX ✅ Frontend service restarted successfully (PID: $NEW_PID)"
            else
                echo "$LOG_PREFIX ❌ Failed to start frontend service"
            fi
        else
            echo "$LOG_PREFIX ❌ Frontend build failed!"
        fi
    fi
    
    # Clean up lock file
    rm "$LOCK_FILE"
    
    # Check if more changes were queued during build
    if [ -f "$LOCK_FILE.queued" ]; then
        rm "$LOCK_FILE.queued"
        echo "$LOG_PREFIX 📋 Processing queued changes..."
        # Small delay before processing queued changes
        sleep 1
        continue
    fi
    
    echo "$LOG_PREFIX ✅ Rebuild complete at $(date '+%Y-%m-%d %H:%M:%S')"
    echo "$LOG_PREFIX 👁️  Watching for changes..."
done