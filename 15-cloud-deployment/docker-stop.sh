#!/bin/bash

# Docker Stop Script for Step 14
# This script stops your containerized application

echo "========================================"
echo "  Step 14: Stopping Docker Containers"
echo "========================================"
echo ""

# Stop containers
echo "🛑 Stopping containers..."
docker compose down

echo ""
echo "✅ All containers stopped"
echo ""
echo "To restart: ./docker-start.sh"
echo "To remove volumes: docker compose down -v"
echo ""
