# Step 9: The AI Stylist (RAG Pipeline)

This guide walks you through setting up and running the Retrieval Augmented Generation (RAG) pipeline for personalized fashion recommendations.

---

## 🎯 Learning Objectives

By the end of this step, you will understand:

1. **Vector Embeddings**: How to convert text into numerical representations
2. **Similarity Search**: How to find semantically similar content using cosine similarity
3. **RAG Pipeline**: Retrieve → Augment → Generate workflow
4. **Vector Databases**: Using Supabase with pgvector for storing embeddings

---

## 📋 Prerequisites

### 1. Supabase Account
- Sign up at: https://supabase.com
- Create a new project
- Get your project URL and service role key

### 2. OpenAI API Key
- Sign up at: https://platform.openai.com
- Go to API Keys section
- Create a new API key
- **Note**: You'll need credits for embeddings and completions

### 3. Environment Variables
Create a `.env` file in the `scripts/` directory:

\`\`\`env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

---

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

\`\`\`bash
cd D:\The_AI-Powered_Full_Stack_Creator\The_AI-Powered_Full_Stack_Creator\style-journal

pip install -r scripts/requirements.txt
\`\`\`

This installs:
- `supabase` - Python client for Supabase
- `openai` - OpenAI API client for embeddings and completions
- All previous dependencies (FastAPI, Celery, etc.)

---

### Step 2: Setup Supabase Database

#### A. Enable pgvector Extension

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the content from `scripts/002_create_embeddings_table.sql`
5. Click "Run" to execute

This creates:
- `fashion_embeddings` table with vector column
- Vector similarity search index
- Row Level Security policies

#### B. Create Similarity Search Function

1. In SQL Editor, create a new query
2. Copy and paste the content from `scripts/003_create_similarity_function.sql`
3. Click "Run" to execute

This creates the `match_fashion_trends()` function for similarity search.

---

### Step 3: Create and Store Embeddings

#### Option 1: From Scraped Data

First, make sure you have scraped data:

\`\`\`bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Celery worker
celery -A scripts.celery_app worker --loglevel=info --pool=solo

# Terminal 3: Trigger scraping
curl -X POST http://localhost:8000/api/scrape-trends
\`\`\`

Then create embeddings:

\`\`\`bash
python scripts/create_embeddings.py
\`\`\`

#### Option 2: Use Sample Data

The script includes sample fashion trends if you don't have scraped data yet:

\`\`\`bash
python scripts/create_embeddings.py
\`\`\`

**Expected Output:**
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

... (continues for all trends)

============================================================
✓ Successfully stored 10/10 embeddings
============================================================
\`\`\`

---

### Step 4: Test the RAG Pipeline

#### Test Directly with Python

\`\`\`bash
python scripts/rag_pipeline.py
\`\`\`

**Expected Output:**
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
  - Clean Lines Modern (Professional)
  ...

Recommendations:
Based on the current minimalist fashion trends, here are my recommendations:

1. **Foundation Pieces**:
   - Tailored beige blazer with clean lines
   - White silk blouse with minimal detailing
   - High-waisted wide-leg trousers in neutral tone

2. **Styling Tips**:
   - Stick to a monochromatic or two-color palette
   - Focus on quality fabrics over quantity
   - Keep accessories minimal and functional

3. **Color Palette**:
   - Primary: Beige, white, soft gray
   - Accent: Soft terracotta or sage green

4. **Accessories**:
   - Simple leather watch with tan strap
   - Structured tote bag in cognac
   - Delicate gold stud earrings
\`\`\`

---

### Step 5: Test the API Endpoint

#### Start the FastAPI Server

\`\`\`bash
# Make sure Redis and Celery are still running from Step 3

# Terminal 3: Start API
cd D:\The_AI-Powered_Full_Stack_Creator\The_AI-Powered_Full_Stack_Creator\style-journal
uvicorn scripts.api:app --reload
\`\`\`

#### Test with Browser

Visit: http://localhost:8000/api/recommendations/test

#### Test with API Docs (Swagger UI)

1. Go to: http://localhost:8000/docs
2. Find `POST /api/recommendations`
3. Click "Try it out"
4. Enter your query:
\`\`\`json
{
  "query": "I want a casual summer outfit for a beach party",
  "limit": 5
}
\`\`\`
5. Click "Execute"

#### Test with curl

\`\`\`bash
curl -X POST "http://localhost:8000/api/recommendations" \
  -H "Content-Type: application/json" \
  -d '{"query": "I want an elegant evening dress", "limit": 5}'
\`\`\`

#### Test with Python

\`\`\`python
import requests

response = requests.post(
    "http://localhost:8000/api/recommendations",
    json={
        "query": "I need a professional outfit for a job interview",
        "limit": 5
    }
)

result = response.json()
print(f"Query: {result['query']}")
print(f"\nFound {len(result['retrieved_trends'])} similar trends")
print(f"\nRecommendations:\n{result['recommendations']}")
\`\`\`

---

## 🧠 How RAG Works

### The 3-Step Pipeline

\`\`\`
User Query: "I want a minimalist spring outfit"
     ↓
[1] RETRIEVE - Find similar fashion trends
     ↓
   Query Embedding: [0.23, -0.45, 0.67, ...]
     ↓
   Vector Similarity Search in Supabase
     ↓
   Top 5 Similar Trends Retrieved
     ↓
[2] AUGMENT - Combine query with retrieved context
     ↓
   Enhanced Prompt = Query + Trend Context
     ↓
[3] GENERATE - Create personalized response
     ↓
   OpenAI GPT generates recommendations
     ↓
   Personalized Fashion Advice ✨
\`\`\`

### Why RAG is Better Than Pure LLM

**Without RAG:**
- LLM only knows what it was trained on (outdated)
- May hallucinate fashion trends
- Generic recommendations

**With RAG:**
- Uses YOUR scraped, current data
- Grounded in real fashion trends
- Personalized to your database
- More accurate and relevant

---

## 📊 Understanding Vector Embeddings

### What are Embeddings?

Embeddings convert text into numbers:

\`\`\`
Text: "Minimalist fashion with clean lines"
         ↓
Embedding: [0.234, -0.456, 0.678, ..., 0.123]
           (1536 numbers for OpenAI ada-002)
\`\`\`

### Similarity Measurement

Similar texts have similar embeddings:

\`\`\`
Query: "casual summer outfit"
Embedding: [0.2, 0.5, 0.3, ...]

Trend 1: "Summer beach fashion"
Embedding: [0.21, 0.48, 0.32, ...]
Similarity: 0.95 ✓ Very similar

Trend 2: "Winter formal attire"
Embedding: [-0.5, -0.2, 0.8, ...]
Similarity: 0.23 ✗ Not similar
\`\`\`

### Cosine Similarity

\`\`\`python
similarity = 1 - (embedding1 <=> embedding2)

# <=> is the cosine distance operator in pgvector
# Values range from 0 (completely different) to 1 (identical)
\`\`\`

---

## 🔧 Troubleshooting

### Issue: "OpenAI API Error"

**Solution:**
- Check your API key is correct in `.env`
- Verify you have credits in your OpenAI account
- Check rate limits: https://platform.openai.com/account/rate-limits

### Issue: "Supabase Connection Error"

**Solution:**
\`\`\`bash
# Test connection
python -c "from supabase import create_client; import os; client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY')); print('Connected!')"
\`\`\`

### Issue: "pgvector extension not found"

**Solution:**
- Go to Supabase SQL Editor
- Run: `CREATE EXTENSION IF NOT EXISTS vector;`
- Verify: `SELECT * FROM pg_extension WHERE extname = 'vector';`

### Issue: "No similar trends found"

**Solution:**
- Make sure you've run `create_embeddings.py` first
- Check data exists: Go to Supabase → Table Editor → fashion_embeddings
- Lower the similarity threshold in `rag_pipeline.py` (line 75)

### Issue: "RAG pipeline not available"

**Solution:**
- Make sure all dependencies are installed: `pip install -r scripts/requirements.txt`
- Check `.env` file has all required variables
- Look at API logs for specific error messages

---

## 🎓 Key Concepts Learned

1. **Vector Embeddings**: Text → Numbers for machine learning
2. **Semantic Search**: Finding similar meanings, not just keywords
3. **pgvector**: PostgreSQL extension for vector operations
4. **RAG Pipeline**: Combining retrieval with generation
5. **Context Augmentation**: Enhancing prompts with relevant data

---

## 🚀 Next Steps

1. **Experiment with Queries**: Try different fashion requests
2. **Tune Parameters**: Adjust similarity thresholds and result limits
3. **Add More Data**: Scrape more fashion sites and create embeddings
4. **Improve Prompts**: Customize the augmented prompt in `rag_pipeline.py`
5. **Frontend Integration**: Connect this API to your Next.js app

---

## 📝 Summary

You've successfully built an AI-powered fashion recommendation system using RAG! This system:

- Converts fashion trends into vector embeddings
- Stores them in a Supabase vector database
- Retrieves similar trends based on user queries
- Generates personalized recommendations using OpenAI

This is the foundation of modern AI applications like ChatGPT, Perplexity, and enterprise search systems.
