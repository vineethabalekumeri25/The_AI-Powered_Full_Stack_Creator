#!/bin/bash

# Docker Logs Script for Step 14
# This script shows logs from all containers

echo "========================================"
echo "  Step 14: Viewing Docker Logs"
echo "========================================"
echo ""
echo "Press Ctrl+C to exit"
echo ""

# Follow logs from all containers
docker compose logs -f
