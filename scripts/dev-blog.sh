#!/bin/bash

# Development script for the blog system
# This runs MongoDB in Docker and the Go backend + Astro frontend locally

echo "🚀 Starting Blog Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Start MongoDB in Docker (detached)
echo "📦 Starting MongoDB..."
docker-compose up -d coders-blog-mongodb

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to start..."
sleep 5

# Check if MongoDB is running
if ! docker-compose ps | grep -q "coders-blog-mongodb.*Up"; then
    echo "❌ MongoDB failed to start. Check docker-compose logs coders-blog-mongodb"
    exit 1
fi

echo "✅ MongoDB is running on port 27419"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    # Kill the backend process if it exists
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    # Stop MongoDB
    docker-compose down
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Start the Go backend in background
echo "🔧 Starting Go backend..."
cd backend
./scripts/dev.sh &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:8749/api/categories > /dev/null; then
    echo "⚠️  Backend might not be running properly. Check the logs above."
fi

echo "✅ Backend is running on port 8749"

# Start the Astro frontend (this will block)
echo "🎨 Starting Astro frontend..."
echo ""
echo "📍 Access points:"
echo "   - Frontend: http://localhost:4321"
echo "   - Blog: http://localhost:4321/blog"
echo "   - Docs: http://localhost:4321/docs"
echo "   - Editor: http://localhost:4321/editor (admin@example.com / admin123)"
echo "   - API: http://localhost:8749"
echo "   - MongoDB: mongodb://admin:password@localhost:27419"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run dev

# This won't be reached unless npm exits
cleanup