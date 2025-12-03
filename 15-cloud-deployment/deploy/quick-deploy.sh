#!/bin/bash

# Quick deployment script - runs all steps in sequence
# Use this for complete deployment from scratch

set -e

echo "=========================================="
echo "Step 15: Complete Cloud Run Deployment"
echo "=========================================="
echo ""

# Check for required tools
command -v gcloud >/dev/null 2>&1 || { echo "ERROR: gcloud CLI not found. Install from https://cloud.google.com/sdk/docs/install"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker not found. Install Docker Desktop."; exit 1; }

# Prompt for configuration
read -p "Enter your GCP Project ID: " PROJECT_ID
read -p "Enter region (default: us-central1): " REGION
REGION=${REGION:-us-central1}

export GCP_PROJECT_ID=$PROJECT_ID
export GCP_REGION=$REGION
export GCP_REPOSITORY="fashion-app"

echo ""
echo "Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Repository: $GCP_REPOSITORY"
echo ""

read -p "Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Step 1: Build and Push
echo ""
echo "Step 1/3: Building and pushing Docker images..."
./deploy/build-and-push.sh

# Step 2: Deploy to Cloud Run
echo ""
echo "Step 2/3: Deploying to Cloud Run..."
./deploy/deploy-to-cloudrun.sh

# Step 3: Update Environment Variables
echo ""
echo "Step 3/3: Updating environment variables..."
if [ -f .env.local ]; then
    ./deploy/update-env-vars.sh
else
    echo "WARNING: .env.local not found. Skipping environment variable update."
    echo "Run ./deploy/update-env-vars.sh manually after creating .env.local"
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your application is now live!"
echo ""
echo "Next steps:"
echo "1. Visit your frontend URL to test"
echo "2. Check logs: gcloud run services logs read fashion-app-frontend --region=$REGION"
echo "3. Monitor in console: https://console.cloud.google.com/run"
