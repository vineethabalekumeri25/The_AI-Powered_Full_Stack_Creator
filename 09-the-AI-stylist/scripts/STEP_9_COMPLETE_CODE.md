# Step 9: The AI Stylist (RAG Pipeline) - Complete Code Reference

This document contains all the code needed for Step 9: RAG-based fashion recommendations.

## Overview

**RAG (Retrieval Augmented Generation)** combines:
1. **Retrieve** - Find similar fashion trends using vector search
2. **Augment** - Add retrieved context to the prompt
3. **Generate** - Use LLM to create personalized recommendations

---

## File 1: Database Schema

**Location:** `scripts/002_create_embeddings_table.sql`

\`\`\`sql
-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table to store fashion trend embeddings
CREATE TABLE IF NOT EXISTS fashion_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  title TEXT,
  category TEXT,
  season TEXT,
  metadata JSONB,
  embedding vector(1536), -- OpenAI ada-002 embeddings are 1536 dimensions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS fashion_embeddings_embedding_idx 
ON fashion_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE fashion_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow all users to read embeddings (for recommendations)
CREATE POLICY "Allow public read access" ON fashion_embeddings
  FOR SELECT USING (true);

-- Allow authenticated users to insert embeddings
CREATE POLICY "Allow authenticated insert" ON fashion_embeddings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
\`\`\`

---

## File 2: Similarity Search Function

**Location:** `scripts/003_add_similarity_function.sql`

\`\`\`sql
-- Add similarity search function for RAG pipeline
CREATE OR REPLACE FUNCTION match_fashion_trends(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  title text,
  category text,
  season text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fashion_embeddings.id,
    fashion_embeddings.content,
    fashion_embeddings.title,
    fashion_embeddings.category,
    fashion_embeddings.season,
    fashion_embeddings.metadata,
    1 - (fashion_embeddings.embedding <=> query_embedding) AS similarity
  FROM fashion_embeddings
  WHERE 1 - (fashion_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY fashion_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
\`\`\`

---

## File 3: Create Embeddings Script

**Location:** `scripts/create_embeddings.py`

This script is already in your project. Key functions:

- `create_embedding(text)` - Converts text to vector using OpenAI
- `load_scraped_trends()` - Loads trends from JSON file
- `store_embedding()` - Saves embedding to Supabase
- `main()` - Processes all trends and creates embeddings

---

## File 4: RAG Pipeline Module

**Location:** `scripts/rag_pipeline.py`

This module is already in your project. Key class:

\`\`\`python
class RAGPipeline:
    def retrieve_similar_trends(query, limit=5)
        # Step 1: Find similar trends using vector search
    
    def augment_prompt(query, retrieved_trends)
        # Step 2: Create enriched prompt with context
    
    def generate_recommendations(prompt)
        # Step 3: Use LLM to generate response
    
    def get_recommendations(user_query)
        # Complete RAG pipeline
\`\`\`

---

## File 5: API Endpoint

**Location:** `scripts/api.py` (lines 201-240)

\`\`\`python
@app.post("/api/recommendations", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Get AI-powered fashion recommendations using RAG
    """
    if not RAG_AVAILABLE:
        raise HTTPException(status_code=503, detail="RAG pipeline not available")
    
    try:
        result = rag_pipeline.get_recommendations(request.query)
        return RecommendationResponse(
            query=result["query"],
            retrieved_trends=result["retrieved_trends"],
            recommendations=result["recommendations"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

---

## Dependencies Required

**Location:** `scripts/requirements.txt`

\`\`\`txt
openai==1.10.0          # For embeddings and completions
supabase==2.3.4         # Vector database client
postgrest==0.13.2       # Supabase REST client
\`\`\`

---

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
pip install openai supabase postgrest
\`\`\`

### 2. Set Environment Variables
\`\`\`bash
# Get these from your Supabase project
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Get from OpenAI (https://platform.openai.com/api-keys)
export OPENAI_API_KEY="your-openai-api-key"
\`\`\`

### 3. Run SQL Scripts in Supabase
\`\`\`bash
# In Supabase SQL Editor, run in order:
1. scripts/002_create_embeddings_table.sql
2. scripts/003_add_similarity_function.sql
\`\`\`

### 4. Create Embeddings
\`\`\`bash
python scripts/create_embeddings.py
\`\`\`

### 5. Test RAG Pipeline
\`\`\`bash
python scripts/rag_pipeline.py
\`\`\`

### 6. Start API Server
\`\`\`bash
uvicorn scripts.api:app --reload
\`\`\`

### 7. Test API Endpoint
\`\`\`bash
curl -X POST http://localhost:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"query": "minimalist spring outfit for work"}'
\`\`\`

---

## How It Works

1. **User sends query**: "I want a minimalist spring outfit for work"

2. **Create query embedding**: Convert query text to vector (1536 dimensions)

3. **Vector similarity search**: Find top 5 most similar fashion trends in database

4. **Augment prompt**: Combine query + retrieved trends into enriched prompt

5. **Generate recommendations**: LLM creates personalized response using context

6. **Return results**: API returns retrieved trends + AI recommendations

---

## Example Request/Response

**Request:**
\`\`\`json
{
  "query": "I want a casual summer outfit for a beach party",
  "limit": 5
}
\`\`\`

**Response:**
\`\`\`json
{
  "query": "I want a casual summer outfit for a beach party",
  "retrieved_trends": [
    {
      "title": "Breezy Summer Styles",
      "category": "Casual Wear",
      "season": "Summer 2024"
    },
    {
      "title": "Beach-to-Bar Fashion",
      "category": "Resort Wear",
      "season": "Summer 2024"
    }
  ],
  "recommendations": "Based on current trends, here are my recommendations:\n\n1. Flowy Linen Dress..."
}
\`\`\`

---

## Troubleshooting

**Issue: ModuleNotFoundError: No module named 'openai'**
\`\`\`bash
pip install openai==1.10.0
\`\`\`

**Issue: Supabase connection error**
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
- Check environment variables: `echo $SUPABASE_URL`

**Issue: OpenAI API key invalid**
- Get key from: https://platform.openai.com/api-keys
- Set environment variable: `export OPENAI_API_KEY="sk-..."`

**Issue: pgvector extension not found**
- Enable in Supabase Dashboard: Database → Extensions → Search "vector" → Enable

---

## Next Steps

After completing Step 9, you can:
- Add more fashion trends to improve recommendations
- Fine-tune the similarity threshold for better matches
- Implement user preferences and history
- Create a frontend UI for the recommendations API
- Add caching to reduce OpenAI API costs
