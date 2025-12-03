#!/bin/bash

# Step 15: Build and Push Docker Images to Google Artifact Registry
# This script builds your Docker images and pushes them to GCP Artifact Registry

set -e  # Exit on error

echo "=========================================="
echo "Step 15: Building and Pushing to GCP"
echo "=========================================="

# Configuration - Update these values
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
REPOSITORY="${GCP_REPOSITORY:-fashion-app}"

# Image names
FRONTEND_IMAGE="frontend"
BACKEND_IMAGE="backend"

# Full image paths
FRONTEND_FULL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${FRONTEND_IMAGE}"
BACKEND_FULL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${BACKEND_IMAGE}"

echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Repository: $REPOSITORY"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "ERROR: gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "ERROR: Not logged in to gcloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Set project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo ""
echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPOSITORY \
    --repository-format=docker \
    --location=$REGION \
    --description="Fashion app Docker images" \
    || echo "Repository already exists, continuing..."

# Configure Docker authentication
echo ""
echo "Configuring Docker authentication..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push frontend
echo ""
echo "=========================================="
echo "Building Frontend Image..."
echo "=========================================="
docker build -t ${FRONTEND_FULL}:latest -f Dockerfile.frontend .

echo ""
echo "Pushing Frontend Image..."
docker push ${FRONTEND_FULL}:latest

# Build and push backend
echo ""
echo "=========================================="
echo "Building Backend Image..."
echo "=========================================="
docker build -t ${BACKEND_FULL}:latest -f Dockerfile.backend .

echo ""
echo "Pushing Backend Image..."
docker push ${BACKEND_FULL}:latest

echo ""
echo "=========================================="
echo "Build and Push Complete!"
echo "=========================================="
echo "Frontend: ${FRONTEND_FULL}:latest"
echo "Backend: ${BACKEND_FULL}:latest"
echo ""
echo "Next step: Run deploy/deploy-to-cloudrun.sh to deploy"
