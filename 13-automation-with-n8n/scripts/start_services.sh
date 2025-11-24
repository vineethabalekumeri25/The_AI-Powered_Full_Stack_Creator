#!/bin/bash

# Start Services Script for Style Journal Backend
# This script helps you start all required services

echo "🚀 Starting Style Journal Backend Services..."
echo ""

# Check if Redis is running
echo "1️⃣ Checking Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis is running"
else
    echo "   ❌ Redis is not running"
    echo "   Please start Redis first:"
    echo "   - macOS: brew services start redis"
    echo "   - Linux: sudo systemctl start redis"
    echo "   - Docker: docker run -d -p 6379:6379 redis"
    exit 1
fi

echo ""
echo "2️⃣ Starting Celery Worker..."
echo "   Opening new terminal for Celery..."
# Start Celery in background
celery -A celery_app worker --loglevel=info &
CELERY_PID=$!

echo ""
echo "3️⃣ Starting FastAPI Server..."
echo "   API will be available at: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""

# Start FastAPI
python api.py

# Cleanup on exit
trap "kill $CELERY_PID" EXIT
