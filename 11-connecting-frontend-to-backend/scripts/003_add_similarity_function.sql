-- Add similarity search function for RAG pipeline
-- This function finds fashion trends similar to a query embedding

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

COMMENT ON FUNCTION match_fashion_trends IS 'Performs vector similarity search to find fashion trends similar to a query';
