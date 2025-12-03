#!/bin/bash

# Step 15: Deploy to Google Cloud Run
# This script deploys your containers to Cloud Run services

set -e  # Exit on error

echo "=========================================="
echo "Step 15: Deploying to Cloud Run"
echo "=========================================="

# Configuration - Update these values
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
REPOSITORY="${GCP_REPOSITORY:-fashion-app}"

# Service names
FRONTEND_SERVICE="fashion-app-frontend"
BACKEND_SERVICE="fashion-app-backend"

# Image paths
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/frontend:latest"
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/backend:latest"

echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Deploy Backend Service
echo "=========================================="
echo "Deploying Backend Service..."
echo "=========================================="
gcloud run deploy $BACKEND_SERVICE \
    --image=$BACKEND_IMAGE \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --port=8000 \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --set-env-vars="NODE_ENV=production"

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE \
    --platform=managed \
    --region=$REGION \
    --format="value(status.url)")

echo ""
echo "Backend deployed to: $BACKEND_URL"

# Deploy Frontend Service
echo ""
echo "=========================================="
echo "Deploying Frontend Service..."
echo "=========================================="
gcloud run deploy $FRONTEND_SERVICE \
    --image=$FRONTEND_IMAGE \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --port=3000 \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL"

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE \
    --platform=managed \
    --region=$REGION \
    --format="value(status.url)")

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo ""
echo "Visit your app: $FRONTEND_URL"
echo "API Docs: $BACKEND_URL/docs"
