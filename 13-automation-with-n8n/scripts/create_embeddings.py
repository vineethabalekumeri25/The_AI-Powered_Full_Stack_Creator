"""
Step 9: The AI Stylist - Create Vector Embeddings
This script creates embeddings from scraped fashion trends and stores them in Supabase
"""

import json
import os
import sys
from typing import List, Dict
import requests
from supabase import create_client, Client

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "YOUR_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "YOUR_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_KEY")

def validate_environment():
    """Validate that all required environment variables are set"""
    required_vars = {
        "SUPABASE_URL": os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
        "SUPABASE_SERVICE_ROLE_KEY": os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY")
    }
    
    missing = [key for key, value in required_vars.items() if not value or value.startswith("YOUR_")]
    
    if missing:
        print("❌ ERROR: Missing required environment variables!")
        print("\nPlease set the following environment variables:\n")
        
        for var in missing:
            if var == "SUPABASE_URL":
                print(f"   {var}=https://your-project.supabase.co")
            elif var == "SUPABASE_SERVICE_ROLE_KEY":
                print(f"   {var}=eyJhbGc...")
            elif var == "OPENAI_API_KEY":
                print(f"   {var}=sk-...")
        
        print("\n📖 Instructions:")
        print("\nWindows (Command Prompt):")
        print('   set SUPABASE_URL=https://your-project.supabase.co')
        print('   set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
        print('   set OPENAI_API_KEY=sk-your-openai-key')
        
        print("\nWindows (PowerShell):")
        print('   $env:SUPABASE_URL="https://your-project.supabase.co"')
        print('   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"')
        print('   $env:OPENAI_API_KEY="sk-your-openai-key"')
        
        print("\nMac/Linux:")
        print('   export SUPABASE_URL=https://your-project.supabase.co')
        print('   export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
        print('   export OPENAI_API_KEY=sk-your-openai-key')
        
        print("\n💡 Get your keys from:")
        print("   Supabase: https://app.supabase.com/project/_/settings/api")
        print("   OpenAI: https://platform.openai.com/api-keys")
        
        sys.exit(1)
    
    return required_vars

# Validate and get environment variables
env_vars = validate_environment()
SUPABASE_URL = env_vars["SUPABASE_URL"]
SUPABASE_KEY = env_vars["SUPABASE_SERVICE_ROLE_KEY"]
OPENAI_API_KEY = env_vars["OPENAI_API_KEY"]

# Initialize Supabase client
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✓ Connected to Supabase successfully")
except Exception as e:
    print(f"❌ Failed to connect to Supabase: {e}")
    print("\n💡 Check that your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct")
    sys.exit(1)


def create_embedding(text: str) -> List[float]:
    """
    Create an embedding vector for the given text using OpenAI's API
    
    Learning Note:
    - Embeddings convert text into numerical vectors (arrays of numbers)
    - Similar texts have similar vectors (measured by cosine similarity)
    - This allows us to find semantically related content
    """
    url = "https://api.openai.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "input": text,
        "model": "text-embedding-ada-002"  # OpenAI's embedding model
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["data"][0]["embedding"]
    except Exception as e:
        print(f"❌ Error creating embedding: {e}")
        if "401" in str(e):
            print("💡 Check that your OPENAI_API_KEY is valid")
        raise


def load_scraped_trends(file_path: str = "scraped_trends.json") -> List[Dict]:
    """
    Load scraped fashion trends from JSON file
    """
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File {file_path} not found. Using sample data.")
        return [
            {
                "title": "Minimalist Fashion Revival",
                "category": "Style Guide",
                "season": "Spring 2024",
                "description": "Clean lines and neutral tones dominate the runway"
            },
            {
                "title": "Bold Color Blocking",
                "category": "Trends",
                "season": "Summer 2024",
                "description": "Vibrant contrasting colors create striking outfits"
            },
            {
                "title": "Sustainable Fashion",
                "category": "Eco-Friendly",
                "season": "All Seasons",
                "description": "Recycled materials and ethical production methods"
            }
        ]


def create_content_string(trend: Dict) -> str:
    """
    Combine trend data into a single string for embedding
    
    Learning Note:
    - We combine all relevant information into one text
    - This creates a rich semantic representation
    - More context = better recommendations
    """
    parts = [
        f"Title: {trend.get('title', '')}",
        f"Category: {trend.get('category', '')}",
        f"Season: {trend.get('season', '')}",
        f"Description: {trend.get('description', '')}"
    ]
    return "\n".join(parts)


def store_embedding(trend: Dict, embedding: List[float]) -> bool:
    """
    Store the trend and its embedding in Supabase
    """
    try:
        content = create_content_string(trend)
        
        data = {
            "content": content,
            "metadata": trend,
            "embedding": embedding
        }
        
        result = supabase.table("fashion_embeddings").insert(data).execute()
        print(f"✓ Stored embedding for: {trend.get('title')}")
        return True
        
    except Exception as e:
        print(f"✗ Error storing embedding: {e}")
        if "relation" in str(e).lower():
            print("💡 Run the SQL migration first: scripts/002_create_embeddings_table.sql")
        return False


def main():
    """
    Main function to create and store embeddings
    """
    print("=" * 60)
    print("Step 9: Creating Fashion Trend Embeddings")
    print("=" * 60)
    
    # Load scraped trends
    print("\n1. Loading scraped trends...")
    trends = load_scraped_trends()
    print(f"   Loaded {len(trends)} trends")
    
    # Create and store embeddings
    print("\n2. Creating embeddings and storing in Supabase...")
    success_count = 0
    
    for i, trend in enumerate(trends, 1):
        print(f"\n   Processing trend {i}/{len(trends)}...")
        
        # Create content string
        content = create_content_string(trend)
        
        # Generate embedding
        embedding = create_embedding(content)
        
        # Store in Supabase
        if store_embedding(trend, embedding):
            success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✓ Successfully stored {success_count}/{len(trends)} embeddings")
    print("=" * 60)
    print("\nNext Steps:")
    print("1. Run the RAG pipeline to get recommendations")
    print("2. Test the /api/recommendations endpoint")


if __name__ == "__main__":
    main()
