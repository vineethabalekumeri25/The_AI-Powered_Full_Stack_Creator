"""
Step 9: RAG Pipeline Module
Retrieval Augmented Generation for fashion recommendations
"""

import os
from typing import List, Dict, Optional
from supabase import create_client, Client
import requests

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "YOUR_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "YOUR_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class RAGPipeline:
    """
    Retrieval Augmented Generation Pipeline for Fashion Recommendations
    
    Learning Notes:
    RAG has 3 main steps:
    1. RETRIEVE - Find similar items using vector search
    2. AUGMENT - Add retrieved context to the prompt
    3. GENERATE - Use LLM to create personalized response
    """
    
    def __init__(self):
        self.supabase = supabase
        self.openai_api_key = OPENAI_API_KEY
    
    def create_embedding(self, text: str) -> List[float]:
        """
        Create embedding for user query
        """
        url = "https://api.openai.com/v1/embeddings"
        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "input": text,
            "model": "text-embedding-ada-002"
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["data"][0]["embedding"]
        except Exception as e:
            print(f"Error creating embedding: {e}")
            return [0.0] * 1536
    
    def retrieve_similar_trends(
        self, 
        query: str, 
        limit: int = 5,
        similarity_threshold: float = 0.7
    ) -> List[Dict]:
        """
        STEP 1: RETRIEVE
        Find fashion trends similar to the user's query using vector similarity
        
        Learning Note:
        - We use cosine similarity to measure how close two vectors are
        - Closer vectors = more semantically similar content
        - pgvector extension in Postgres makes this fast
        """
        # Create embedding for the query
        query_embedding = self.create_embedding(query)
        
        try:
            # Perform vector similarity search using Supabase RPC
            # The '<->' operator calculates cosine distance
            response = self.supabase.rpc(
                'match_fashion_trends',
                {
                    'query_embedding': query_embedding,
                    'match_threshold': 1 - similarity_threshold,  # Convert similarity to distance
                    'match_count': limit
                }
            ).execute()
            
            return response.data if response.data else []
            
        except Exception as e:
            print(f"Error retrieving trends: {e}")
            # Fallback to simple query without vector search
            response = self.supabase.table("fashion_embeddings").select("*").limit(limit).execute()
            return response.data if response.data else []
    
    def augment_prompt(self, query: str, retrieved_trends: List[Dict]) -> str:
        """
        STEP 2: AUGMENT
        Create an enriched prompt by combining user query with retrieved context
        
        Learning Note:
        - We give the LLM relevant background information
        - This grounds the response in factual data
        - Reduces hallucinations and improves accuracy
        """
        context = "\n\n".join([
            f"Trend: {trend.get('title', 'N/A')}\n"
            f"Category: {trend.get('category', 'N/A')}\n"
            f"Season: {trend.get('season', 'N/A')}\n"
            f"Details: {trend.get('content', 'N/A')}"
            for trend in retrieved_trends
        ])
        
        augmented_prompt = f"""You are an expert fashion stylist and trend advisor. 
Based on the following current fashion trends, provide personalized recommendations.

CURRENT FASHION TRENDS:
{context}

USER QUERY: {query}

Please provide:
1. 3-5 specific fashion recommendations based on these trends
2. Styling tips that match the user's request
3. Color palette suggestions
4. Accessories to complete the look

Be creative, specific, and personalized. Use the trend data to inform your recommendations."""
        
        return augmented_prompt
    
    def generate_recommendations(self, prompt: str) -> str:
        """
        STEP 3: GENERATE
        Use LLM to create personalized fashion recommendations
        
        Learning Note:
        - We use the augmented prompt with retrieved context
        - The LLM generates a response based on real trend data
        - This is more accurate than asking the LLM without context
        """
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are an expert fashion stylist."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return "Unable to generate recommendations at this time. Please try again later."
    
    def get_recommendations(self, user_query: str) -> Dict:
        """
        Complete RAG pipeline: Retrieve → Augment → Generate
        """
        print(f"\n[RAG] Processing query: {user_query}")
        
        # Step 1: Retrieve similar trends
        print("[RAG] Step 1: Retrieving similar trends...")
        retrieved_trends = self.retrieve_similar_trends(user_query, limit=5)
        print(f"[RAG] Found {len(retrieved_trends)} similar trends")
        
        # Step 2: Augment prompt with context
        print("[RAG] Step 2: Augmenting prompt with context...")
        augmented_prompt = self.augment_prompt(user_query, retrieved_trends)
        
        # Step 3: Generate recommendations
        print("[RAG] Step 3: Generating personalized recommendations...")
        recommendations = self.generate_recommendations(augmented_prompt)
        
        return {
            "query": user_query,
            "retrieved_trends": [
                {
                    "title": trend.get("title"),
                    "category": trend.get("category"),
                    "season": trend.get("season")
                }
                for trend in retrieved_trends
            ],
            "recommendations": recommendations
        }


# Test the RAG pipeline
if __name__ == "__main__":
    rag = RAGPipeline()
    
    # Test query
    test_query = "I want a minimalist spring outfit for work"
    print("=" * 60)
    print("Testing RAG Pipeline")
    print("=" * 60)
    
    result = rag.get_recommendations(test_query)
    
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(f"\nQuery: {result['query']}")
    print(f"\nRetrieved {len(result['retrieved_trends'])} relevant trends:")
    for trend in result['retrieved_trends']:
        print(f"  - {trend['title']} ({trend['category']})")
    print(f"\nRecommendations:\n{result['recommendations']}")
