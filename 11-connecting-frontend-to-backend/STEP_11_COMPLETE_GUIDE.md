# Step 11: Connecting Frontend to Backend - Complete Guide

## Overview
Step 11 connects the Next.js frontend to the FastAPI Python backend, enabling real-time data fetching and form submissions.

## Files Structure

\`\`\`
step-11-frontend-backend/
├── package.json                    ✅ Next.js dependencies
├── lib/
│   └── api-client.ts              ✅ API helper functions
├── app/
│   ├── trends/
│   │   └── page.tsx               ✅ Display live trends (GET)
│   └── journal/
│       └── page.tsx               ✅ Create entries + AI prompts (POST)
└── scripts/
    └── api.py                     ✅ FastAPI backend (from Steps 9-10)
\`\`\`

---

## Prerequisites

Before running Step 11, ensure you have:

1. **FastAPI Backend** - Created in Steps 9-10
2. **Ollama** - Installed and running (for AI prompts)
3. **Node.js** - Version 18 or higher
4. **Python** - Version 3.8 or higher

---

## Step-by-Step Instructions

### Step 1: Install Frontend Dependencies

\`\`\`bash
cd step-11-frontend-backend

npm install
\`\`\`

This installs:
- Next.js 15.5.4
- React 19.1.0
- Supabase client
- Tailwind CSS
- UI components

### Step 2: Start FastAPI Backend

Open **Terminal 1**:

\`\`\`bash
cd step-11-frontend-backend

# Make sure Python dependencies are installed
pip install -r requirements.txt

# Start FastAPI server
uvicorn scripts.api:app --reload
\`\`\`

**Expected Output:**
\`\`\`
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
\`\`\`

**Backend Endpoints Available:**
- `GET /` - Health check
- `GET /api/trends` - Fetch fashion trends
- `POST /api/generate-journal-prompt` - Generate AI prompts
- `GET /api/recommendations` - Get AI recommendations

### Step 3: Start Ollama (for AI Prompts)

Open **Terminal 2**:

\`\`\`bash
# Make sure Ollama is running
ollama serve

# In another terminal, verify model is installed
ollama list
\`\`\`

You should see `llama3.2:1b` in the list.

### Step 4: Start Next.js Frontend

Open **Terminal 3**:

\`\`\`bash
cd step-11-frontend-backend

npm run dev
\`\`\`

**Expected Output:**
\`\`\`
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Ready in 2.3s
\`\`\`

---

## Testing Step 11 Features

### Task 1: Fetching Data (GET Request)

**Test the Trends Page:**

1. Open browser: http://localhost:3000/trends
2. You should see:
   - Green dot indicator: "Connected to FastAPI backend"
   - Live fashion trends loaded from the backend
   - Search functionality
   - Favorite button for each trend

**What's Happening:**
\`\`\`javascript
// In app/trends/page.tsx
useEffect(() => {
  // Fetches data when component mounts
  const trends = await fetchTrends()
  setTrends(trends)
}, [])
\`\`\`

**Expected Behavior:**
- If FastAPI is running: Shows live trends from backend
- If FastAPI is offline: Shows red dot + fallback data

### Task 2: Sending Data (POST Request)

**Test the Journal Page:**

1. Open browser: http://localhost:3000/journal
2. Click "AI Prompt" button
3. Enter theme: `"Inspired by BLACKPINK"`
4. Click "Generate Prompt"
5. Wait for AI to generate creative prompt
6. Click "Use This Prompt" to fill the journal form
7. Fill in title and tags
8. Click "Save Entry"

**What's Happening:**
\`\`\`javascript
// In app/journal/page.tsx
const result = await generateJournalPrompt(theme)
// Sends POST request to FastAPI
// Ollama generates creative writing prompt
// Returns prompt to frontend
\`\`\`

**Expected Response:**
\`\`\`json
{
  "theme": "Inspired by BLACKPINK",
  "prompt": "Channel your inner K-pop icon today...",
  "model": "llama3.2:1b"
}
\`\`\`

### Creative Exercise: Live Journal

**Complete Workflow:**

1. **Generate AI Prompt** → POST to `/api/generate-journal-prompt`
2. **Use Prompt** → Fills journal form content
3. **Save Entry** → Stores in Supabase database
4. **View Entries** → Displays saved journal entries

---

## API Client Functions

### GET Request Example
\`\`\`typescript
// lib/api-client.ts
export async function fetchTrends(): Promise<Trend[]> {
  const response = await fetch('http://localhost:8000/api/trends')
  return await response.json()
}
\`\`\`

### POST Request Example
\`\`\`typescript
// lib/api-client.ts
export async function generateJournalPrompt(theme: string) {
  const response = await fetch('http://localhost:8000/api/generate-journal-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme })
  })
  return await response.json()
}
\`\`\`

---

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Browser (localhost:3000)                  │
│                                                               │
│  ┌────────────────┐              ┌─────────────────┐        │
│  │  Trends Page   │              │  Journal Page   │        │
│  │  (GET request) │              │  (POST request) │        │
│  └────────┬───────┘              └────────┬────────┘        │
│           │                               │                  │
└───────────┼───────────────────────────────┼──────────────────┘
            │                               │
            │   fetch API                   │   fetch API
            │                               │
            ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│           FastAPI Backend (localhost:8000)                   │
│                                                               │
│  ┌────────────────┐              ┌─────────────────┐        │
│  │ GET /api/trends│              │ POST /api/...   │        │
│  │ Returns trends │              │ Generate prompt │        │
│  └────────────────┘              └────────┬────────┘        │
│                                            │                  │
└────────────────────────────────────────────┼──────────────────┘
                                             │
                                             ▼
                                  ┌──────────────────┐
                                  │ Ollama (port 11434)│
                                  │ llama3.2:1b      │
                                  └──────────────────┘
\`\`\`

---

## Troubleshooting

### Problem: "Failed to fetch trends"

**Solution:**
\`\`\`bash
# Check if FastAPI is running
curl http://localhost:8000/

# If not running, start it
uvicorn scripts.api:app --reload
\`\`\`

### Problem: "Failed to generate prompt"

**Possible causes:**
1. Ollama not running
2. Model not installed
3. FastAPI offline

**Solutions:**
\`\`\`bash
# Check Ollama
ollama list

# Start Ollama
ollama serve

# Download model if missing
ollama pull llama3.2:1b

# Check FastAPI
curl http://localhost:8000/
\`\`\`

### Problem: "Connection refused to localhost:8000"

**Solution:**
- FastAPI must be running before starting Next.js
- Check port 8000 is not in use by another application
- Make sure you're in the correct directory

### Problem: CORS errors

FastAPI already includes CORS middleware:
\`\`\`python
# In scripts/api.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
\`\`\`

If you still see CORS errors, restart the FastAPI server.

---

## Expected Output Summary

### Terminal 1 (FastAPI)
\`\`\`
INFO:     127.0.0.1:xxxxx - "GET /api/trends HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /api/generate-journal-prompt HTTP/1.1" 200 OK
\`\`\`

### Terminal 2 (Ollama)
\`\`\`
time=2024-01-15T10:30:00 level=INFO msg="llama server listening" port=11434
\`\`\`

### Terminal 3 (Next.js)
\`\`\`
✓ Compiled in 1.2s
✓ Ready in 2.3s
\`\`\`

### Browser (Frontend)
- Trends page shows live data with green indicator
- Journal page generates AI prompts successfully
- Forms submit and save data
- Real-time updates work correctly

---

## Success Criteria

Step 11 is complete when:

- ✅ Trends page fetches and displays data from FastAPI
- ✅ Backend connection indicator works (green/red dot)
- ✅ AI prompt generator sends POST requests to Ollama
- ✅ Generated prompts can be used in journal entries
- ✅ Journal entries save to Supabase database
- ✅ Search and filter functionality works
- ✅ No console errors in browser or terminals

---

## Next Steps

After completing Step 11, you have:
- Connected Next.js frontend to Python backend
- Implemented GET and POST requests
- Integrated AI prompt generation
- Created a full-stack application

You can now extend this by:
- Adding more API endpoints
- Implementing user authentication
- Adding real-time updates with WebSockets
- Deploying to production

---

## Quick Reference

\`\`\`bash
# Start all services (3 terminals required)

# Terminal 1: FastAPI
uvicorn scripts.api:app --reload

# Terminal 2: Ollama
ollama serve

# Terminal 3: Next.js
npm run dev
\`\`\`

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Ollama: http://localhost:11434

---

**Step 11 Complete!** 🎉
