#!/bin/bash

echo "=========================================="
echo "  Starting n8n Automation for Step 13"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create local-files directory if it doesn't exist
mkdir -p local-files

echo "✅ Prerequisites check passed"
echo ""
echo "Starting n8n container..."
echo ""

# Start n8n with Docker Compose
docker compose up -d

echo ""
echo "=========================================="
echo "  n8n Started Successfully!"
echo "=========================================="
echo ""
echo "📱 Access n8n at: http://localhost:5678"
echo "👤 Username: admin"
echo "🔑 Password: stylejournal2024"
echo ""
echo "To view logs: docker logs -f n8n-style-journal"
echo "To stop n8n: docker compose down"
echo ""
echo "=========================================="
