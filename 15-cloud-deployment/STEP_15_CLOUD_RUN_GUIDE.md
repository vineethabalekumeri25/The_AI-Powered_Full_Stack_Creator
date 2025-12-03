# Step 15: Cloud Deployment Guide - Google Cloud Run

This guide walks you through deploying your full-stack application to Google Cloud Run.

## What You'll Deploy

- **Frontend**: Next.js application (Container on Cloud Run)
- **Backend**: FastAPI application (Container on Cloud Run)
- **n8n**: Automation workflows (Optional - can be self-hosted)

## Prerequisites

### 1. Google Cloud Account
- Sign up at https://cloud.google.com/free
- Free tier includes: $300 credit for 90 days
- Cloud Run free tier: 2 million requests/month

### 2. Install Google Cloud SDK

**Windows:**
\`\`\`bash
# Download installer from:
https://cloud.google.com/sdk/docs/install

# Or use PowerShell:
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
\`\`\`

**Verify installation:**
\`\`\`bash
gcloud --version
\`\`\`

### 3. Docker Desktop
- Must be installed and running (from Step 14)

---

## Step-by-Step Deployment

### Phase 1: GCP Project Setup

**1. Login to Google Cloud:**
\`\`\`bash
gcloud auth login
\`\`\`

**2. Create a new project:**
\`\`\`bash
# Set your project ID (must be globally unique)
export GCP_PROJECT_ID="fashion-app-2025"
export GCP_REGION="us-central1"
export GCP_REPOSITORY="fashion-app"

# Create project
gcloud projects create $GCP_PROJECT_ID --name="Fashion App"

# Set as active project
gcloud config set project $GCP_PROJECT_ID
\`\`\`

**3. Enable billing:**
- Go to https://console.cloud.google.com/billing
- Link your project to a billing account
- (Required even for free tier)

**4. Enable required APIs:**
\`\`\`bash
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com
\`\`\`

---

### Phase 2: Build and Push Docker Images

**1. Set environment variables:**
\`\`\`bash
cd D:/The_AI-Powered_Full_Stack_Creator/The_AI-Powered_Full_Stack_Creator/13-automation-with-n8n

# Export your configuration
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
export GCP_REPOSITORY="fashion-app"
\`\`\`

**2. Run the build and push script:**
\`\`\`bash
# Make script executable (Git Bash)
chmod +x deploy/build-and-push.sh

# Build and push images
./deploy/build-and-push.sh
\`\`\`

This script will:
- Create Artifact Registry repository
- Build frontend Docker image
- Build backend Docker image
- Push both images to Artifact Registry

**Expected output:**
\`\`\`
Building Frontend Image...
Pushing Frontend Image...
Building Backend Image...
Pushing Backend Image...
Build and Push Complete!
\`\`\`

---

### Phase 3: Deploy to Cloud Run

**1. Deploy services:**
\`\`\`bash
# Make script executable
chmod +x deploy/deploy-to-cloudrun.sh

# Deploy to Cloud Run
./deploy/deploy-to-cloudrun.sh
\`\`\`

This script will:
- Deploy backend service first
- Get backend URL
- Deploy frontend service with backend URL
- Output both service URLs

**Expected output:**
\`\`\`
Backend deployed to: https://fashion-app-backend-xxxxx-uc.a.run.app
Frontend deployed to: https://fashion-app-frontend-xxxxx-uc.a.run.app
\`\`\`

**2. Update Firebase environment variables:**
\`\`\`bash
# Make script executable
chmod +x deploy/update-env-vars.sh

# Update environment variables
./deploy/update-env-vars.sh
\`\`\`

---

### Phase 4: Configure Frontend-Backend Connection

**Update frontend to use live backend URL:**

1. Get your backend URL:
\`\`\`bash
gcloud run services describe fashion-app-backend \
    --region=$GCP_REGION \
    --format="value(status.url)"
\`\`\`

2. Update frontend environment:
\`\`\`bash
gcloud run services update fashion-app-frontend \
    --region=$GCP_REGION \
    --set-env-vars="NEXT_PUBLIC_API_URL=YOUR_BACKEND_URL"
\`\`\`

---

### Phase 5: Test Your Live Application

**1. Get your URLs:**
\`\`\`bash
# Frontend URL
gcloud run services describe fashion-app-frontend \
    --region=$GCP_REGION \
    --format="value(status.url)"

# Backend URL
gcloud run services describe fashion-app-backend \
    --region=$GCP_REGION \
    --format="value(status.url)"
\`\`\`

**2. Test all pages:**
- Home: `https://your-frontend-url.run.app`
- Trends: `https://your-frontend-url.run.app/trends`
- Journal: `https://your-frontend-url.run.app/journal`
- Mood Board: `https://your-frontend-url.run.app/mood-board`
- API Docs: `https://your-backend-url.run.app/docs`

---

## Configuration Files

### Environment Variables for Production

Create `.env.production` with:
\`\`\`env
NEXT_PUBLIC_API_URL=https://fashion-app-backend-xxxxx.run.app
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
\`\`\`

---

## Monitoring and Logs

**View logs:**
\`\`\`bash
# Frontend logs
gcloud run services logs read fashion-app-frontend --region=$GCP_REGION

# Backend logs
gcloud run services logs read fashion-app-backend --region=$GCP_REGION

# Follow logs in real-time
gcloud run services logs tail fashion-app-frontend --region=$GCP_REGION
\`\`\`

**View metrics in console:**
\`\`\`bash
# Open Cloud Run console
gcloud run services describe fashion-app-frontend --region=$GCP_REGION
\`\`\`

Or visit: https://console.cloud.google.com/run

---

## Cost Optimization

**Cloud Run Pricing (Free Tier):**
- 2 million requests/month free
- 360,000 GB-seconds memory free
- 180,000 vCPU-seconds free

**Tips to stay in free tier:**
- Use `--min-instances=0` (cold starts but free)
- Set reasonable `--max-instances` limits
- Use efficient Docker images (Alpine-based)

**Check current usage:**
\`\`\`bash
gcloud run services describe fashion-app-frontend \
    --region=$GCP_REGION \
    --format="table(metadata.name,status.url,status.conditions[0].status)"
\`\`\`

---

## Updating Your Application

**To deploy updates:**

1. Build new images:
\`\`\`bash
./deploy/build-and-push.sh
\`\`\`

2. Deploy updates:
\`\`\`bash
./deploy/deploy-to-cloudrun.sh
\`\`\`

Cloud Run will automatically handle rolling updates with zero downtime.

---

## Troubleshooting

**Issue: Image not found**
\`\`\`bash
# List images in Artifact Registry
gcloud artifacts docker images list \
    ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${GCP_REPOSITORY}
\`\`\`

**Issue: Permission denied**
\`\`\`bash
# Grant yourself permissions
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
    --member="user:YOUR_EMAIL@gmail.com" \
    --role="roles/run.admin"
\`\`\`

**Issue: Service not responding**
\`\`\`bash
# Check service status
gcloud run services describe fashion-app-frontend --region=$GCP_REGION

# View recent logs
gcloud run services logs read fashion-app-frontend \
    --region=$GCP_REGION \
    --limit=50
\`\`\`

**Issue: Environment variables not set**
\`\`\`bash
# View current environment variables
gcloud run services describe fashion-app-frontend \
    --region=$GCP_REGION \
    --format="value(spec.template.spec.containers[0].env)"
\`\`\`

---

## Cleanup

**To delete everything and stop charges:**

\`\`\`bash
# Delete Cloud Run services
gcloud run services delete fashion-app-frontend --region=$GCP_REGION
gcloud run services delete fashion-app-backend --region=$GCP_REGION

# Delete Artifact Registry images
gcloud artifacts repositories delete fashion-app --location=$GCP_REGION

# Delete entire project (careful!)
gcloud projects delete $GCP_PROJECT_ID
\`\`\`

---

## Success Checklist

- [ ] GCP project created and billing enabled
- [ ] Docker images built successfully
- [ ] Images pushed to Artifact Registry
- [ ] Backend deployed to Cloud Run
- [ ] Frontend deployed to Cloud Run
- [ ] Environment variables configured
- [ ] Frontend connected to live backend
- [ ] All pages load correctly
- [ ] Firebase real-time features working
- [ ] Application accessible via HTTPS URL

**Congratulations! Your application is live on the internet!**

Share your live URL: `https://fashion-app-frontend-xxxxx.run.app`
