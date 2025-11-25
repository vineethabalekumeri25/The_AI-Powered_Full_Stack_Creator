"""
Complete test script for Step 9: RAG Pipeline
Tests all components: embeddings, similarity search, and recommendations
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_environment():
    """Test 1: Check environment variables"""
    print("=" * 60)
    print("Test 1: Environment Variables")
    print("=" * 60)
    
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_API_KEY"]
    missing = []
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✓ {var}: {'*' * 10}{value[-4:]}")
        else:
            print(f"✗ {var}: Not found")
            missing.append(var)
    
    if missing:
        print(f"\n⚠ Missing variables: {', '.join(missing)}")
        print("Please add them to your .env file")
        return False
    
    print("\n✓ All environment variables found")
    return True


def test_supabase_connection():
    """Test 2: Check Supabase connection"""
    print("\n" + "=" * 60)
    print("Test 2: Supabase Connection")
    print("=" * 60)
    
    try:
        from supabase import create_client
        
        supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        )
        
        # Try to query the fashion_embeddings table
        result = supabase.table("fashion_embeddings").select("count").execute()
        print(f"✓ Connected to Supabase")
        print(f"✓ fashion_embeddings table exists")
        return True
        
    except Exception as e:
        print(f"✗ Supabase connection failed: {e}")
        print("\nTroubleshooting:")
        print("1. Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        print("2. Make sure you've run the SQL scripts to create tables")
        return False


def test_embeddings_creation():
    """Test 3: Create test embedding"""
    print("\n" + "=" * 60)
    print("Test 3: Creating Embeddings")
    print("=" * 60)
    
    try:
        import requests
        
        url = "https://api.openai.com/v1/embeddings"
        headers = {
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "input": "Test fashion trend",
            "model": "text-embedding-ada-002"
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        embedding = response.json()["data"][0]["embedding"]
        print(f"✓ Created embedding with {len(embedding)} dimensions")
        print(f"✓ First 5 values: {embedding[:5]}")
        return True
        
    except Exception as e:
        print(f"✗ Failed to create embedding: {e}")
        print("\nTroubleshooting:")
        print("1. Check your OPENAI_API_KEY")
        print("2. Verify you have credits in your OpenAI account")
        return False


def test_rag_pipeline():
    """Test 4: Run RAG pipeline"""
    print("\n" + "=" * 60)
    print("Test 4: RAG Pipeline")
    print("=" * 60)
    
    try:
        from rag_pipeline import RAGPipeline
        
        rag = RAGPipeline()
        test_query = "I want a casual summer outfit"
        
        print(f"Query: {test_query}")
        print("\nRunning RAG pipeline...")
        
        result = rag.get_recommendations(test_query)
        
        print(f"\n✓ Retrieved {len(result['retrieved_trends'])} similar trends")
        print("\nRetrieved Trends:")
        for i, trend in enumerate(result['retrieved_trends'], 1):
            print(f"  {i}. {trend['title']} ({trend['category']})")
        
        print(f"\n✓ Generated recommendations")
        print("\nRecommendations Preview:")
        print(result['recommendations'][:200] + "...")
        
        return True
        
    except Exception as e:
        print(f"✗ RAG pipeline failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure you've created embeddings first (run create_embeddings.py)")
        print("2. Check that similarity search function exists in Supabase")
        return False


def test_api_endpoint():
    """Test 5: Test API endpoint"""
    print("\n" + "=" * 60)
    print("Test 5: API Endpoint")
    print("=" * 60)
    
    try:
        import requests
        
        # Check if API is running
        try:
            response = requests.get("http://localhost:8000/", timeout=2)
            api_running = True
        except:
            api_running = False
        
        if not api_running:
            print("⚠ API not running")
            print("\nTo test the API endpoint:")
            print("1. Start the API: uvicorn scripts.api:app --reload")
            print("2. Visit: http://localhost:8000/api/recommendations/test")
            return None
        
        # Test the recommendations endpoint
        response = requests.get("http://localhost:8000/api/recommendations/test")
        
        if response.status_code == 200:
            result = response.json()
            print("✓ API endpoint working")
            print(f"✓ Retrieved {len(result.get('retrieved_trends', []))} trends")
            return True
        else:
            print(f"✗ API returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"⚠ Could not test API: {e}")
        return None


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("STEP 9: RAG PIPELINE - COMPLETE TEST SUITE")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(("Environment Variables", test_environment()))
    
    if results[0][1]:  # Only continue if env vars are set
        results.append(("Supabase Connection", test_supabase_connection()))
        results.append(("Embeddings Creation", test_embeddings_creation()))
        results.append(("RAG Pipeline", test_rag_pipeline()))
        results.append(("API Endpoint", test_api_endpoint()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for test_name, result in results:
        if result is True:
            status = "✓ PASS"
        elif result is False:
            status = "✗ FAIL"
        else:
            status = "⚠ SKIP"
        print(f"{status}: {test_name}")
    
    passed = sum(1 for _, r in results if r is True)
    total = len([r for r in results if r[1] is not None])
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 All tests passed! Your RAG pipeline is ready to use.")
    else:
        print("\n⚠ Some tests failed. Check the troubleshooting steps above.")


if __name__ == "__main__":
    main()
