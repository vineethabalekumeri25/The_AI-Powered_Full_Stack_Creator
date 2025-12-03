#!/bin/bash

# Update environment variables for Cloud Run services
# This script updates your Firebase and other environment variables

set -e

echo "=========================================="
echo "Updating Cloud Run Environment Variables"
echo "=========================================="

PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
FRONTEND_SERVICE="fashion-app-frontend"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "ERROR: .env.local file not found"
    echo "Create .env.local with your Firebase credentials"
    exit 1
fi

echo "Reading environment variables from .env.local..."

# Read and set environment variables
echo ""
echo "Updating frontend environment variables..."
gcloud run services update $FRONTEND_SERVICE \
    --region=$REGION \
    --update-env-vars="$(cat .env.local | grep -v '^#' | grep -v '^$' | paste -sd,)"

echo ""
echo "Environment variables updated successfully!"
echo ""
echo "To verify, run:"
echo "gcloud run services describe $FRONTEND_SERVICE --region=$REGION"
