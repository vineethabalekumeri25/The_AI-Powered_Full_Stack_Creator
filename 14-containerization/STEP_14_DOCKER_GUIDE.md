# Step 14: Containerization with Docker

## Overview

This guide covers containerizing your full-stack application using Docker and Docker Compose. You'll learn to package your Next.js frontend, FastAPI backend, and n8n automation into portable containers that run consistently anywhere.

---

## Prerequisites

**Required Software:**
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (included with Docker Desktop)

**Verify Installation:**
\`\`\`bash
docker --version
# Docker version 24.0.0 or higher

docker compose version
# Docker Compose version v2.20.0 or higher
\`\`\`

---

## Project Structure

\`\`\`
13-automation-with-n8n/
├── Dockerfile.frontend          # Multi-stage Dockerfile for Next.js
├── Dockerfile.backend           # Dockerfile for FastAPI
├── docker-compose.yml           # Orchestrates all services
├── .dockerignore                # Files to exclude from Docker builds
├── .env.example                 # Environment variable template
├── .env                         # Your actual environment variables (create this)
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
└── scripts/                     # Backend Python code
\`\`\`

---

## Step 1: Understand the Dockerfiles

### Frontend Dockerfile (Dockerfile.frontend)

**Multi-stage build with 4 stages:**

1. **Base** - Sets up Node.js Alpine base image
2. **Deps** - Installs dependencies only (cached for faster rebuilds)
3. **Builder** - Builds Next.js application
4. **Runner** - Production image with only necessary files

**Key Features:**
- Uses Alpine Linux for minimal image size (~100MB vs 1GB)
- Non-root user for security
- Standalone output mode for self-contained deployment
- Layer caching for fast rebuilds

### Backend Dockerfile (Dockerfile.backend)

**Multi-stage build with 3 stages:**

1. **Base** - Python 3.11 slim base
2. **Deps** - Installs Python packages
3. **Runner** - Production image with non-root user

**Key Features:**
- Health check endpoint monitoring
- Non-root user for security
- Minimal dependencies for smaller image

---

## Step 2: Configure Environment Variables

**Create .env file:**
\`\`\`bash
cp .env.example .env
\`\`\`

**Edit .env with your Firebase credentials:**
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
\`\`\`

---

## Step 3: Build Docker Images

**Build all services:**
\`\`\`bash
# Build frontend
docker compose build frontend

# Build backend
docker compose build backend

# Or build everything at once
docker compose build
\`\`\`

**Expected output:**
\`\`\`
[+] Building 45.2s (23/23) FINISHED
 => [frontend internal] load build definition
 => [frontend] => exporting to image
 => [backend] => exporting to image
Successfully built frontend and backend images
\`\`\`

---

## Step 4: Run with Docker Compose

**Start all services:**
\`\`\`bash
docker compose up
\`\`\`

**Or run in detached mode (background):**
\`\`\`bash
docker compose up -d
\`\`\`

**Expected output:**
\`\`\`
[+] Running 3/3
 ✔ Container style-journal-backend    Started
 ✔ Container style-journal-frontend   Started
 ✔ Container style-journal-n8n        Started
\`\`\`

---

## Step 5: Access Your Application

**Services are now running:**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **n8n Automation:** http://localhost:5678

**Test each service:**
\`\`\`bash
# Test backend health
curl http://localhost:8000/api/health

# Test frontend
curl http://localhost:3000
\`\`\`

---

## Step 6: View Logs

**View all logs:**
\`\`\`bash
docker compose logs
\`\`\`

**View specific service logs:**
\`\`\`bash
docker compose logs frontend
docker compose logs backend
docker compose logs n8n
\`\`\`

**Follow logs in real-time:**
\`\`\`bash
docker compose logs -f
\`\`\`

---

## Step 7: Stop and Clean Up

**Stop all services:**
\`\`\`bash
docker compose down
\`\`\`

**Stop and remove volumes:**
\`\`\`bash
docker compose down -v
\`\`\`

**Remove all Docker images:**
\`\`\`bash
docker compose down --rmi all
\`\`\`

---

## Docker Compose Services

### Frontend Service
- **Port:** 3000
- **Depends on:** backend
- **Environment:** Production mode
- **Auto-restart:** Unless stopped manually

### Backend Service
- **Port:** 8000
- **Health check:** Every 30 seconds
- **Auto-restart:** Unless stopped manually

### n8n Service
- **Port:** 5678
- **Persistent data:** Stored in Docker volume
- **Credentials:** admin / admin123

---

## Troubleshooting

### Issue: Build fails with "module not found"

**Solution:**
\`\`\`bash
# Clean Docker cache and rebuild
docker compose build --no-cache
\`\`\`

### Issue: Port already in use

**Solution:**
\`\`\`bash
# Stop conflicting services
docker compose down

# Or change ports in docker-compose.yml
ports:
  - "3001:3000"  # Change 3000 to 3001
\`\`\`

### Issue: Container exits immediately

**Solution:**
\`\`\`bash
# Check logs for errors
docker compose logs backend
docker compose logs frontend

# Verify environment variables
cat .env
\`\`\`

### Issue: n8n data not persisting

**Solution:**
\`\`\`bash
# Check volumes
docker volume ls

# Recreate volume
docker compose down -v
docker compose up -d
\`\`\`

---

## Production Deployment Tips

**Security:**
1. Change n8n default credentials in `.env`
2. Use secrets management (Docker secrets, Kubernetes secrets)
3. Enable HTTPS with reverse proxy (Nginx, Caddy)
4. Set up firewall rules

**Performance:**
1. Use Docker layer caching in CI/CD
2. Optimize image sizes (multi-stage builds)
3. Set resource limits in docker-compose.yml
4. Use health checks for auto-restart

**Monitoring:**
1. Collect logs centrally (ELK stack, CloudWatch)
2. Set up container monitoring (Prometheus, Datadog)
3. Configure alerts for service failures

---

## Next Steps

**Step 15: Cloud Deployment**
- Deploy to Vercel (frontend)
- Deploy to Railway/Render (backend)
- Use managed databases

**Step 16: CI/CD Pipeline**
- Automate Docker builds
- Push images to registry
- Auto-deploy on git push

---

## Useful Docker Commands

\`\`\`bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop a specific container
docker stop style-journal-frontend

# Remove a container
docker rm style-journal-frontend

# View container resource usage
docker stats

# Execute command in running container
docker exec -it style-journal-backend bash

# Inspect container details
docker inspect style-journal-frontend

# View Docker networks
docker network ls

# View Docker volumes
docker volume ls

# Prune unused resources
docker system prune -a
\`\`\`

---

## Summary

You've successfully containerized your full-stack application! Your app now runs in isolated, portable containers that can be deployed anywhere Docker is supported.

**What you accomplished:**
- Created multi-stage Dockerfiles for frontend and backend
- Orchestrated services with Docker Compose
- Configured environment variables and networking
- Set up persistent data volumes
- Implemented health checks and auto-restart

**Benefits:**
- Consistent environment across development and production
- Easy deployment to any cloud platform
- Isolated dependencies prevent conflicts
- Simple scaling and orchestration
- Reproducible builds

Your application is now production-ready and can be deployed to any Docker-compatible hosting platform!
