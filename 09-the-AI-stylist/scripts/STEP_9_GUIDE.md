# Step 9: The AI Stylist (RAG Pipeline)

Complete guide to setting up and running the RAG (Retrieval Augmented Generation) pipeline for personalized fashion recommendations.

## What is RAG?

**RAG = Retrieval Augmented Generation**

It's a 3-step process:
1. **RETRIEVE** - Find similar fashion trends using vector search
2. **AUGMENT** - Add retrieved trends as context to the prompt
3. **GENERATE** - Use LLM to create personalized recommendations

## Prerequisites

### 1. OpenAI API Key (Required)

Get your API key from: https://platform.openai.com/api-keys

**Set environment variable:**
\`\`\`bash
# Windows (Command Prompt)
set OPENAI_API_KEY=sk-your-key-here

# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-your-key-here"

# Mac/Linux
export OPENAI_API_KEY=sk-your-key-here
\`\`\`

### 2. Supabase Setup (Already Done)

Your Supabase environment variables are already configured:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Step-by-Step Instructions

### Step 1: Install Dependencies

\`\`\`bash
cd D:\The_AI-Powered_Full_Stack_Creator\The_AI-Powered_Full_Stack_Creator\style-journal

pip install -r scripts/requirements.txt
\`\`\`

This installs:
- `openai` - For embeddings and completions
- `supabase` - For vector database
- Already installed: `fastapi`, `uvicorn`, `celery`, `redis`

### Step 2: Create Database Schema

Run the SQL script in Supabase to create the embeddings table:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy contents from `scripts/002_create_embeddings_table.sql`
5. Paste and click "Run"

**Option B: Using Python Script (Coming Soon)**
\`\`\`bash
python scripts/run_sql_migration.py scripts/002_create_embeddings_table.sql
\`\`\`

### Step 3: Create Embeddings from Scraped Data

This script converts your scraped fashion trends into vector embeddings:

\`\`\`bash
python scripts/create_embeddings.py
\`\`\`

**What it does:**
- Loads trends from `scraped_trends.json` (or uses sample data)
- Creates 1536-dimensional embeddings using OpenAI
- Stores embeddings in Supabase `fashion_embeddings` table

**Expected output:**
\`\`\`
============================================================
Step 9: Creating Fashion Trend Embeddings
============================================================

1. Loading scraped trends...
   Loaded 10 trends

2. Creating embeddings and storing in Supabase...

   Processing trend 1/10...
✓ Stored embedding for: Minimalist Fashion Revival

   Processing trend 2/10...
✓ Stored embedding for: Bold Color Blocking

   ...

============================================================
✓ Successfully stored 10/10 embeddings
============================================================
\`\`\`

### Step 4: Test the RAG Pipeline

Test the RAG pipeline directly:

\`\`\`bash
python scripts/rag_pipeline.py
\`\`\`

**Expected output:**
\`\`\`
============================================================
Testing RAG Pipeline
============================================================

[RAG] Processing query: I want a minimalist spring outfit for work
[RAG] Step 1: Retrieving similar trends...
[RAG] Found 5 similar trends
[RAG] Step 2: Augmenting prompt with context...
[RAG] Step 3: Generating personalized recommendations...

============================================================
RESULTS
============================================================

Query: I want a minimalist spring outfit for work

Retrieved 5 relevant trends:
  - Minimalist Fashion Revival (Style Guide)
  - Sustainable Fashion (Eco-Friendly)
  - ...

Recommendations:
Based on current minimalist trends, I recommend:
1. A tailored blazer in neutral beige...
2. High-waisted trousers in cream...
...
\`\`\`

### Step 5: Start the API Server

\`\`\`bash
uvicorn scripts.api:app --reload
\`\`\`

**Test the recommendations endpoint:**

**Method 1: Browser**
Visit: http://127.0.0.1:8000/api/recommendations/test

**Method 2: curl**
\`\`\`bash
curl -X POST http://127.0.0.1:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"I want a casual summer outfit for a beach party\", \"limit\": 5}"
\`\`\`

**Method 3: Python**
\`\`\`python
import requests

response = requests.post(
    "http://127.0.0.1:8000/api/recommendations",
    json={
        "query": "I want an elegant evening dress",
        "limit": 5
    }
)

print(response.json())
\`\`\`

**Method 4: Interactive API Docs**
Visit: http://127.0.0.1:8000/docs
- Find `POST /api/recommendations`
- Click "Try it out"
- Enter your query
- Click "Execute"

## How It Works

### 1. Vector Embeddings

\`\`\`python
# Text is converted to a 1536-dimensional vector
text = "Minimalist Fashion Revival for Spring 2024"
embedding = [0.023, -0.015, 0.041, ..., 0.008]  # 1536 numbers
\`\`\`

**Why?**
- Similar fashion concepts have similar vectors
- Enables semantic search (meaning-based, not keyword-based)
- "minimalist outfit" finds "clean aesthetic" trends

### 2. Similarity Search

\`\`\`sql
-- Finds trends with similar embeddings using cosine similarity
SELECT * FROM fashion_embeddings
ORDER BY embedding <=> query_embedding
LIMIT 5;
\`\`\`

**Similarity scores:**
- 1.0 = Identical
- 0.8-0.9 = Very similar
- 0.7-0.8 = Somewhat similar
- < 0.7 = Not very similar

### 3. Context-Aware Generation

\`\`\`python
# Without RAG (generic response)
"Try a white shirt and jeans"

# With RAG (informed by current trends)
"Based on current minimalist trends, I recommend:
- Tailored beige blazer (Zara Spring Collection)
- Cream high-waisted trousers
- White sneakers for comfort..."
\`\`\`

## File Structure

\`\`\`
scripts/
├── 002_create_embeddings_table.sql  # Database schema
├── create_embeddings.py             # Create & store embeddings
├── rag_pipeline.py                  # RAG pipeline module
└── api.py                           # FastAPI with /api/recommendations
\`\`\`

## API Response Format

\`\`\`json
{
  "query": "I want a minimalist spring outfit for work",
  "retrieved_trends": [
    {
      "title": "Minimalist Fashion Revival",
      "category": "Style Guide",
      "season": "Spring 2024"
    }
  ],
  "recommendations": "Based on current minimalist trends, I recommend:\n1. A tailored blazer in neutral beige...\n2. High-waisted trousers in cream...\n3. White leather sneakers for comfort..."
}
\`\`\`

## Troubleshooting

### Error: "OpenAI API key not found"

**Solution:**
\`\`\`bash
# Set the environment variable
set OPENAI_API_KEY=sk-your-key-here

# Verify it's set
echo %OPENAI_API_KEY%
\`\`\`

### Error: "table fashion_embeddings does not exist"

**Solution:**
Run the SQL migration first:
\`\`\`sql
-- Copy and run scripts/002_create_embeddings_table.sql in Supabase SQL Editor
\`\`\`

### Error: "No embeddings found"

**Solution:**
Create embeddings first:
\`\`\`bash
python scripts/create_embeddings.py
\`\`\`

### Error: "RAG pipeline not available"

**Solution:**
Check that all environment variables are set:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Next Steps

1. Integrate with your Next.js frontend
2. Add user preferences to personalize further
3. Store user interaction data to improve recommendations
4. Add image generation for outfit visualization
5. Create outfit collections based on wardrobe items

## Learning Resources

- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings
- Vector Databases: https://supabase.com/docs/guides/ai
- RAG Pattern: https://www.pinecone.io/learn/retrieval-augmented-generation/
