# Step 10: The Creative Muse (Ollama) - Complete Guide

This guide covers setting up and using Ollama, a local LLM runner, to generate creative journal prompts.

## Overview

**Step 10** introduces **Ollama**, which allows you to run large language models (LLMs) locally on your machine without needing cloud API keys or paying per request.

### What You'll Build

1. **Ollama Setup** - Install and run local LLM
2. **Python API Integration** - Connect to Ollama's HTTP API
3. **Journal Prompt Generator** - API endpoint that generates creative prompts

---

## Task 1: Setup and Run a Local LLM

### Step 1: Install Ollama

**Download Ollama:**
- **Windows/Mac/Linux**: [https://ollama.ai/download](https://ollama.ai/download)

**Windows Installation:**
\`\`\`bash
# Download the installer from ollama.ai
# Run the installer
# Ollama will be available in your PATH
\`\`\`

**Mac Installation:**
\`\`\`bash
brew install ollama
\`\`\`

**Linux Installation:**
\`\`\`bash
curl -fsSL https://ollama.ai/install.sh | sh
\`\`\`

### Step 2: Start Ollama Server

\`\`\`bash
ollama serve
\`\`\`

**Expected Output:**
\`\`\`
Ollama is running on http://localhost:11434
\`\`\`

Leave this terminal running!

### Step 3: Download a Model

Open a **new terminal** and run:

\`\`\`bash
# Download Llama 3 (recommended, ~4GB)
ollama pull llama3

# Or try smaller models:
ollama pull phi          # ~2GB, faster
ollama pull mistral      # ~4GB, good quality
\`\`\`

**Expected Output:**
\`\`\`
pulling manifest
pulling model...
verifying sha256 checksum
writing manifest
success
\`\`\`

### Step 4: Test Ollama Interactively

\`\`\`bash
ollama run llama3
\`\`\`

Try asking: `Write a creative fashion journal prompt`

Type `/bye` to exit.

---

## Task 2: API Integration

### Step 1: Test the Ollama Client

\`\`\`bash
cd D:\The_AI-Powered_Full_Stack_Creator\The_AI-Powered_Full_Stack_Creator\09-the-AI-stylist

python scripts/ollama_client.py
\`\`\`

**Expected Output:**
\`\`\`
Testing Ollama Client...
✅ Ollama is running

Available models: llama3, phi, mistral

Generating journal prompt...
Theme: Inspired by BLACKPINK
Generated Prompt:
Reflect on a time when bold fashion choices helped you express your inner strength. 
What colors, patterns, or accessories made you feel most powerful and confident? 
How can you incorporate that fearless energy into your everyday style?
\`\`\`

---

## Creative Exercise: Journal Prompt Generator API

### Step 1: Start the API Server

**Terminal 1: Ollama Server** (must be running)
\`\`\`bash
ollama serve
\`\`\`

**Terminal 2: FastAPI Server**
\`\`\`bash
cd D:\The_AI-Powered_Full_Stack_Creator\The_AI-Powered_Full_Stack_Creator\09-the-AI-stylist

uvicorn scripts.api:app --reload
\`\`\`

### Step 2: Test the Endpoint

**Method 1: Browser (Interactive Docs)**
1. Visit: http://127.0.0.1:8000/docs
2. Find `POST /api/generate-journal-prompt`
3. Click "Try it out"
4. Enter:
   \`\`\`json
   {
     "theme": "Inspired by BLACKPINK",
     "model": "llama3"
   }
   \`\`\`
5. Click "Execute"

**Method 2: curl**
\`\`\`bash
curl -X POST "http://127.0.0.1:8000/api/generate-journal-prompt" \
  -H "Content-Type: application/json" \
  -d '{"theme": "Inspired by BLACKPINK", "model": "llama3"}'
\`\`\`

**Method 3: Python**
\`\`\`python
import requests

response = requests.post(
    "http://127.0.0.1:8000/api/generate-journal-prompt",
    json={
        "theme": "Inspired by BLACKPINK",
        "model": "llama3"
    }
)

data = response.json()
print(f"Theme: {data['theme']}")
print(f"Prompt: {data['prompt']}")
\`\`\`

**Expected Response:**
\`\`\`json
{
  "theme": "Inspired by BLACKPINK",
  "prompt": "Reflect on a time when bold fashion choices helped you express your inner strength. What colors, patterns, or accessories made you feel most powerful and confident? How can you incorporate that fearless energy into your everyday style?",
  "model": "llama3"
}
\`\`\`

### Step 3: Try Different Themes

\`\`\`bash
# Vintage Hollywood
curl -X POST "http://127.0.0.1:8000/api/generate-journal-prompt" \
  -H "Content-Type: application/json" \
  -d '{"theme": "Vintage Hollywood Glam"}'

# Sustainable Fashion
curl -X POST "http://127.0.0.1:8000/api/generate-journal-prompt" \
  -H "Content-Type: application/json" \
  -d '{"theme": "Sustainable Fashion Journey"}'

# K-beauty
curl -X POST "http://127.0.0.1:8000/api/generate-journal-prompt" \
  -H "Content-Type: application/json" \
  -d '{"theme": "K-beauty Routine"}'
\`\`\`

---

## Troubleshooting

### Problem: "Cannot connect to Ollama"

**Solution:**
\`\`\`bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve
\`\`\`

### Problem: "Model not found"

**Solution:**
\`\`\`bash
# List installed models
ollama list

# Pull the model if not installed
ollama pull llama3
\`\`\`

### Problem: "Ollama is slow"

**Solutions:**
- Use a smaller model: `ollama pull phi` (2GB)
- Reduce temperature in the code (makes responses more deterministic)
- Ensure your computer has enough RAM (8GB+ recommended)

### Problem: "Port 11434 already in use"

**Solution:**
\`\`\`bash
# Kill existing Ollama process
# Windows:
taskkill /F /IM ollama.exe

# Mac/Linux:
killall ollama
\`\`\`

---

## Comparison: Ollama vs OpenAI

| Feature | Ollama (Step 10) | OpenAI (Step 9) |
|---------|------------------|-----------------|
| **Cost** | Free | Pay per request |
| **Privacy** | 100% local | Data sent to cloud |
| **Speed** | Depends on hardware | Fast (cloud) |
| **Setup** | Install + download models | API key only |
| **Models** | Open source (Llama, Mistral) | GPT-3.5, GPT-4 |
| **Use Case** | Experimentation, privacy | Production, quality |

---

## Summary

**Step 10 Complete! You now have:**

1. ✅ Local LLM running with Ollama
2. ✅ Python client for Ollama API integration
3. ✅ API endpoint that generates creative journal prompts
4. ✅ Experience with both cloud (OpenAI) and local (Ollama) LLMs

**Files Created:**
- `scripts/ollama_client.py` - Ollama API client
- `scripts/api.py` - Updated with `/api/generate-journal-prompt` endpoint
- `scripts/STEP_10_GUIDE.md` - This guide

**Next Steps:**
- Experiment with different Ollama models
- Try different journal prompt themes
- Compare responses between Ollama and OpenAI
- Consider when to use local vs cloud LLMs in production
