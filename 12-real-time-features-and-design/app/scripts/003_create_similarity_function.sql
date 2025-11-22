-- Create function for vector similarity search
-- This function is called by the RAG pipeline to find similar trends

CREATE OR REPLACE FUNCTION match_fashion_trends(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.3,
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
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    title,
    category,
    season,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  FROM fashion_embeddings
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

COMMENT ON FUNCTION match_fashion_trends IS 'Performs vector similarity search on fashion embeddings using cosine distance';
