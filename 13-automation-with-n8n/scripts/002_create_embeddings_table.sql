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

COMMENT ON TABLE fashion_embeddings IS 'Stores vector embeddings of fashion trends for RAG-based recommendations';
